import type { Metadata } from "next";
import "@/public/style/main.scss";
import QueryProvider from "@/providers/queryProviders";
import { SessionProvider } from "next-auth/react";
import AuthProvider from "@/providers/authProvider";

export const metadata: Metadata = {
  title: "Movie Chill",
  description: "Découvrez et appréciez vos films préférés avec Movie Chill.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          <QueryProvider>{children}</QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
