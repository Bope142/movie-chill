"use server";
import { ActionResponseSignup } from "@/types/actionResponse";
import {
  checkIfResetLinkValid,
  checkTokenResetLink,
  createUser,
  existingUser,
  getUser,
  saveEmailVerification,
  saveResetPasswordTokenUser,
  updatePasswordUser,
} from "../db/user";
import { sendMail } from "../email/sendEmail";
import { renderVerificationCodeEmail } from "../email/template/emailVerification";
import { redirects } from "../constants";
import { renderResetPasswordEmail } from "../email/template/resetPassword";

export async function signup(
  formData: FormData
): Promise<ActionResponseSignup> {
  const username = formData.get("nameUser") as string;
  const email = formData.get("emailUser") as string;
  const password = formData.get("passwordUser") as string;

  const usernameRegex = /^.{4,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[^\s]{8,20}$/;

  if (!usernameRegex.test(username)) {
    return {
      formError:
        "Nom d'utilisateur invalide.Utilisez uniquement des lettres, chiffres et underscores, de 3 à 20 caractères.",
    };
  }

  if (!emailRegex.test(email)) {
    return { formError: "Adresse e-mail invalide." };
  }

  if (password.length < 8) {
    return {
      formError:
        "Mot de passe invalide. Il doit contenir au moins 4 caractères avec au moins une lettre et un chiffre.",
    };
  }
  const emailExist = await existingUser(email);
  if (emailExist) {
    return {
      formError:
        "Un compte avec cet email existe déjà. Veuillez utiliser une autre adresse email ou connectez-vous si vous avez déjà un compte.",
    };
  } else {
    const newUser = await createUser(username, email, password);
    if (newUser !== null) {
      const verificationCode = await saveEmailVerification(
        newUser.user_id,
        email
      );
      if (verificationCode.length === 8) {
        await sendMail({
          to: email,
          subject:
            "Vérifiez votre adresse e-mail pour finaliser votre inscription à MOVIE CHILL",
          body: renderVerificationCodeEmail({ code: verificationCode }),
        });

        return { redirectTo: redirects.toVerify };
      } else {
        return {
          formError: "Une erreur s'est produite lors de votre inscription.",
        };
      }
    }

    return {
      formError: "Une erreur s'est produite lors de votre inscription.",
    };
  }
}

function generateResetPasswordToken(length: number): string {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  let token = "";
  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return token;
}

async function generatePasswordResetToken(userId: number): Promise<string> {
  const token = generateResetPasswordToken(15);
  const saveToken = await saveResetPasswordTokenUser(userId, token);
  return saveToken !== null ? token : "";
}

export async function sendPasswordResetLink(
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const email = formData.get("emailUser") as string;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return { error: "L'adresse e-mail est invalide." };
  }

  try {
    const user = await getUser(email);

    if (!user || !user.email_verification[0].is_verified) {
      return { error: "L'adresse e-mail fournie est invalide." };
    }
    const check = await checkIfResetLinkValid(user.user_id);
    if (check.error)
      return {
        error: check.error,
      };
    const resetToken = await generatePasswordResetToken(user.user_id);
    if (resetToken.length === 0) {
      return {
        error:
          "Oups ! Une erreur s'est produite lors de l'envoi du lien de réinitialisation.",
      };
    }
    if (user && user.email) {
      const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${resetToken}`;
      await sendMail({
        to: user.email,
        subject: "Réinitialisez votre mot de passe",
        body: renderResetPasswordEmail({ link: resetLink }),
      });
      return { success: true };
    } else {
      return {
        error:
          "Oups ! Une erreur s'est produite lors de l'envoi du lien de réinitialisation.",
      };
    }
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de l'envoi du lien de réinitialisation :",
      error
    );
    return {
      error:
        "Oups ! Une erreur s'est produite lors de l'envoi du lien de réinitialisation.",
    };
  }
}

export async function resetPassword(
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const token = formData.get("token") as string;
  const password = formData.get("passwordUser") as string;

  if (password.length < 8) {
    return {
      error:
        "Le mot de passe est invalide. Il doit contenir au moins 8 caractères.",
    };
  }

  const checkToken = await checkTokenResetLink(token);
  if (checkToken.error) {
    return {
      error: checkToken.error,
    };
  }

  if (checkToken.userId) {
    const changePswd = await updatePasswordUser(checkToken.userId, password);
    return changePswd
      ? { success: true }
      : {
          error:
            "Une erreur s'est produite lors de la réinitialisation du mot de passe.",
        };
  }

  return {
    error:
      "Le lien de réinitialisation de mot de passe est invalide ou a expiré.",
  };
}
