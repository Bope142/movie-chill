import "next-auth";
import NextAuth, { DefaultSession } from "next-auth";
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      verified?: boolean;
    };
  }
  interface User {
    verified?: boolean;
  }
}
