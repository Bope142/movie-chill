"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function existingUser(email: string): Promise<boolean> {
  try {
    const user = await prisma.users.findUnique({
      where: { email: email },
    });
    console.log(user);
    return user ? true : false;
  } catch (error) {
    throw new Error("error verifying user");
  }
}

export async function createUser(
  username: string,
  email: string,
  password: string
): Promise<number> {
  try {
    const user = await prisma.users.create({
      data: {
        username,
        email,
        password,
      },
    });
    console.log(user);
    return user !== null ? user.user_id : 0;
  } catch (error) {
    throw new Error("error creating user");
  }
}
