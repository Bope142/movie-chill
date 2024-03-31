import { PrismaClient } from "@prisma/client";
import { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createSessionUser } from "../db/user";
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

type NextAuthSessionCallback = {
  session: Session;
  token: Record<string, string>;
};

export const authOption = {
  debug: false,
  secret: process.env.NEXTAUTH_SECRET,
  strategy: "database",

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req): Promise<any> {
        if (!credentials) throw new Error("No provid credentials");
        const { email, password } = credentials;

        const user = await prisma.users.findUnique({
          where: {
            email: email,
          },
          include: {
            email_verification: true,
            user_sessions: true,
          },
        });

        if (user !== null) {
          const matchPasswordUser = await bcrypt.compare(
            password,
            user.password
          );
          console.log(matchPasswordUser);
          if (!user || !matchPasswordUser) {
            throw new Error("Invalid credentials");
          } else {
            const generateNewSession = await createSessionUser(user.user_id);
            console.log("session generated", generateNewSession);
            if (generateNewSession) return user;
            return null;
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: NextAuthSessionCallback) {
      console.log(token);
      if (session !== undefined && token.email !== undefined) {
        const user = await prisma.users.findUnique({
          where: {
            email: token.email,
          },
          include: {
            email_verification: true,
          },
        });

        if (user !== null && session !== undefined) {
          if (session.user !== undefined) {
            session.user.name = user.username;
            session.user.image = user.profile_picture;
            if (user.email_verification && user.email_verification.length > 0) {
              session.user.verified = user.email_verification[0].is_verified;
            } else {
              session.user.verified = false;
            }
            console.log("session user", session);
            return session;
          } else {
            console.error("session.user is undefined");
            return session;
          }
        }

        return null;
      }
    },

    async signIn({ user }: any) {
      return user;
    },
  },
};
