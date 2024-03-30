"use server";
import { ActionResponseSignup } from "@/types/actionResponse";
import { createUser, existingUser, saveEmailVerification } from "./db/user";
import { sendMail } from "../email/sendEmail";
import { renderVerificationCodeEmail } from "../email/emailVerification";
import { redirects } from "../constants";

export async function signup(
  formData: FormData
): Promise<ActionResponseSignup> {
  const username = formData.get("nameUser") as string;
  const email = formData.get("emailUser") as string;
  const password = formData.get("passwordUser") as string;

  const usernameRegex = /^[a-zA-Z0-9._-]{4,20}$/;
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

  if (!passwordRegex.test(password)) {
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
    const createNewUser = await createUser(username, email, password);
    if (createNewUser !== 0) {
      console.log(createNewUser);
      const verificationCode = await saveEmailVerification(
        createNewUser,
        email
      );
      console.log(verificationCode);
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