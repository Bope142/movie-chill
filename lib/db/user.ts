"use server";
import { UserType } from "@/types/user";
import { PrismaClient } from "@prisma/client";
import { isWithinExpirationDate, TimeSpan, createDate } from "oslo";
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
    const deleteVerificationCodeUser =
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
  }
}
