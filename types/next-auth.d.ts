import "next-auth";

declare module "next-auth" {
  interface Session {
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
