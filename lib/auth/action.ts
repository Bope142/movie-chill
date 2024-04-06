"use server";
import {
  ActionResponseSignup,
  ResendVerificationCodeResponse,
} from "@/types/actionResponse";
import {
  createUser,
  existingUser,
  getUser,
  saveEmailVerification,
} from "../db/user";
import { sendMail } from "../email/sendEmail";
import { renderVerificationCodeEmail } from "../email/emailVerification";
import { redirects } from "../constants";
import { TimeSpan, createDate } from "oslo";

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
        "Nom d'utilisateur invalide. Utilisez uniquement des lettres, chiffres et underscores, de 3 à 20 caractères.",
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

async function generatePasswordResetToken(userId: string): Promise<string> {
  // await db
  //   .delete(passwordResetTokens)
  //   .where(eq(passwordResetTokens.userId, userId));
  // const tokenId = generateId(40);
  // await db.insert(passwordResetTokens).values({
  //   id: tokenId,
  //   userId,
  //   expiresAt: createDate(new TimeSpan(2, "h")),
  // });
  // return tokenId;
}

export async function sendPasswordResetLink(
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const email = formData.get("emailUser") as string;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Adresse e-mail invalide." };
  }
  try {
    const user = await getUser(email);
    if (!user || !user.email_verification[0].is_verified)
      return { error: "Provided email is invalid." };
    //const verificationToken = await generatePasswordResetToken(user.id);
    return { error: "Adresse e-mail invalide." };
  } catch (error) {
    return {
      error: "Oups ! Une erreur s'est produite lors de l'envoi du lien !",
    };
  }
}
