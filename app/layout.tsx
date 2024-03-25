import type { Metadata } from "next";
import "@/public/style/main.scss";
import QueryProvider from "@/providers/queryProviders";

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
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
