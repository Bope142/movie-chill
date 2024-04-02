import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Lucia, TimeSpan } from "lucia";
import { UserType } from "@/types/user";

const client = new PrismaClient();
const adapter = new PrismaAdapter(client.user_sessions, client.users);

export const lucia = new Lucia(adapter, {
  getSessionAttributes: () => {
    return {};
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.user_id,
      email: attributes.email,
      username: attributes.username,
      //   emailVerified: attributes.emailVerified,
      avatar: attributes.profile_picture,
      createdAt: attributes.date_registered,
      //   updatedAt: attributes.updatedAt,
    };
  },
  sessionExpiresIn: new TimeSpan(5, "m"),
  sessionCookie: {
    name: "session",
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});

// Étendre le module lucia
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseSessionAttributes: DatabaseSessionAttributes;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

// Déclaration des interfaces
interface DatabaseSessionAttributes {}
interface DatabaseUserAttributes extends Omit<UserType, "password"> {}
