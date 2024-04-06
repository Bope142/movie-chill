import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";
import { checkSessionUserClient } from "@/lib/db/user";
import { signOut } from "next-auth/react";

const useAuthRedirect = (session: Session | null, status: string) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const allowedRoutes = ["/", "/about", "/tv", "/signup", "/login"];

    const sessionCheck = async () => {
      if (status === "authenticated") {
        if (session?.user !== undefined && session.user.verified === false) {
          if (pathname !== "/verify-email")
            window.location.assign("/verify-email");
          return;
        } else if (
          pathname === "/login" ||
          pathname === "/signup" ||
          pathname === "/verify-email"
        ) {
          window.location.assign("/");
        } else {
          if (session?.user !== undefined && session.user.email) {
            const checkSession = await checkSessionUserClient(
              session.user.email
            );
            if (checkSession) return;
            window.location.assign("/login");
          }
        }
      } else if (status === "unauthenticated") {
        if (allowedRoutes.includes(pathname)) {
          return;
        }
        window.location.assign("/login");
      }
    };

    sessionCheck();
  }, [status, session, router, pathname]);
};

export default useAuthRedirect;
