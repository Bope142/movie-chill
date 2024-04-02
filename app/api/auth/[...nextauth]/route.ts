import { authOption } from "@/lib/auth/authOption";
import NextAuth from "next-auth";

const handler = NextAuth(authOption as any);

export { handler as GET, handler as POST };
