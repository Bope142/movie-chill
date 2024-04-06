"use client";
import type { Metadata } from "next";
import "@/public/style/main.scss";
import QueryProvider from "@/providers/queryProviders";
import NProgress from "nprogress";
import AuthProvider from "@/providers/authProvider";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  NProgress.configure({ showSpinner: false });
  useEffect(() => {
    NProgress.start();
    setTimeout(() => {
      NProgress.done();
    }, 1000);
  }, [pathname]);

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
