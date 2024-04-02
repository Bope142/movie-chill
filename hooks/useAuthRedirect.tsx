import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";

const useAuthRedirect = (session: Session | null, status: string) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const allowedRoutes = ["/", "/about", "/tv", "/signup", "/login"];

    if (status === "authenticated") {
      if (session?.user !== undefined && session.user.verified === false) {
        if (pathname !== "/verify-email") router.push("/verify-email");
        return;
      } else if (
        pathname === "/login" ||
        pathname === "/signup" ||
        pathname === "/verify-email"
      ) {
        router.push("/");
      } else {
        return;
      }
    } else if (status === "unauthenticated") {
      if (allowedRoutes.includes(pathname)) {
        return;
      }
      router.push("/login");
    }
  }, [status, session, router, pathname]);
};

export default useAuthRedirect;
