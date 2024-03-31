"use server";

import { PrismaClient } from "@prisma/client";
import { isWithinExpirationDate, TimeSpan, createDate } from "oslo";
import { sendMail } from "../email/sendEmail";
import { renderVerificationCodeEmail } from "../email/emailVerification";
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

export async function existingUser(email: string): Promise<boolean> {
  try {
    const user = await prisma.users.findUnique({
      where: { email: email },
    });
    return user ? true : false;
  } catch (error) {
    throw new Error("error verifying user");
  } finally {
    await prisma.$disconnect();
  }
}

export async function createUser(
  username: string,
  email: string,
  password: string
) {
  try {
    const password_hash = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: {
        username,
        email,
        password: password_hash,
      },
    });
    return user !== null ? user : null;
  } catch (error) {
    throw new Error("error creating user");
  } finally {
    await prisma.$disconnect();
  }
}

function generateVerificationCode(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let code = "";
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return code;
}

export async function saveEmailVerification(
  userId: number,
  email: string
): Promise<string> {
  try {
    await prisma.email_verification.deleteMany({
      where: {
        email: email,
        user_id: userId,
      },
    });
    const verificationCode = generateVerificationCode(8);
    const newVerificationCode = await prisma.email_verification.create({
      data: {
        user_id: userId,
        email: email,
        expires_at: createDate(new TimeSpan(5, "m")),
        verification_code: verificationCode,
      },
    });
    console.log("Email verification code saved successfully.");
    return newVerificationCode !== null
      ? newVerificationCode.verification_code
      : "";
  } catch (error) {
    console.error("Error saving email verification code:", error);
    throw new Error("Failed to save email verification code.");
  } finally {
    await prisma.$disconnect();
  }
}

export async function getUser(email: string) {
  try {
    const user = await prisma.users.findUnique({
      where: { email: email },
    });
    return user;
  } catch (error) {
    throw new Error("error get user");
  } finally {
    await prisma.$disconnect();
  }
}

const timeFromNow = (time: Date) => {
  const now = new Date();
  const diff = time.getTime() - now.getTime();
  const minutes = Math.floor(diff / 1000 / 60);
  const seconds = Math.floor(diff / 1000) % 60;
  return `${minutes}m ${seconds}s`;
};

export async function resendVerificationEmail(
  userId: number,
  email: string
): Promise<{
  error?: string;
  success?: boolean;
}> {
  try {
    const lastSent = await prisma.email_verification.findMany({
      where: { email: email, user_id: userId },
    });
    if (lastSent.length > 0) {
      if (lastSent && isWithinExpirationDate(lastSent[0].expires_at)) {
        return {
          error: `Désolé, veuillez patienter ${timeFromNow(
            lastSent[0].expires_at
          )} avant de renvoyer le code de vérification.`,
        };
      }
      const verificationCode = await saveEmailVerification(userId, email);
      await sendMail({
        to: email,
        subject:
          "Vérifiez votre adresse e-mail pour finaliser votre inscription à MOVIE CHILL",
        body: renderVerificationCodeEmail({ code: verificationCode }),
      });

      return { success: true };
    }
    return {
      error: `no existing verification code`,
    };
  } catch (error) {
    console.error("Error resend verification code:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function verifyUser(userId: number, email: string) {
  try {
    const user = await prisma.email_verification.updateMany({
      where: { email: email, user_id: userId },
      data: {
        is_verified: true,
      },
    });
    return user;
  } catch (error) {
    throw new Error("error get user");
  } finally {
    await prisma.$disconnect();
  }
}

export async function verifyEmail(
  userId: number,
  email: string,
  code: string
): Promise<{
  error?: string;
  success?: boolean;
}> {
  console.log("object", userId, email, code);
  const dbCode = await prisma.email_verification.findMany({
    where: { email: email, user_id: userId, verification_code: code },
  });
  console.log(dbCode);
  if (dbCode.length > 0) {
    if (!isWithinExpirationDate(dbCode[0].expires_at)) {
      return { error: "Le code de vérification a expiré." };
    }
    const validEmailUser = await verifyUser(userId, email);
    if (validEmailUser) {
      return { success: true };
    }
    return { error: "L'adresse e-mail ne correspond pas." };
  }
  return {
    error: "Aucun code de vérification existant n'a été trouvé.",
  };
}

export async function createSessionUser(userId: number): Promise<any> {
  try {
    // await prisma.user_sessions.deleteMany({
    //   where: {
    //     user_id: userId,
    //   },
    // });
    const expirationTime = createDate(new TimeSpan(5, "m"));
    const sessionUser = await prisma.user_sessions.create({
      data: {
        user_id: userId,
        expires_at: expirationTime,
      },
    });
    return sessionUser;
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function isSessionValid(userId: number): Promise<boolean> {
  try {
    const userSession = await prisma.user_sessions.findFirst({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (!userSession) {
      console.log("No session found for the user.");
      return false;
    }
    const expiresAt = userSession.expires_at;
    if (!isWithinExpirationDate(expiresAt)) {
      console.log("Session has expired.");
      return false;
    }

    console.log(`Session is valid.`);
    return true;
  } catch (error) {
    console.error("Error checking session validity:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
