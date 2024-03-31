import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";

const useAuthRedirect = (
  session: Session | null,
  status: string,
  pathname: string
) => {
  const router = useRouter();

  useEffect(() => {
    const allowedRoutes = ["/", "/about", "/tv"];

    if (status === "authenticated") {
      if (session?.user !== undefined && session.user.verified === false) {
        router.push("/verify-email");
      } else if (
        pathname === "/login" ||
        pathname === "/signup" ||
        pathname === "/verify-email"
      ) {
        router.push("/");
      } else {
      }
    } else if (status === "unauthenticated") {
      if (allowedRoutes.includes(pathname)) {
      }
      router.push("/login");
    }
  }, [status, session, router, pathname]);
};

export default useAuthRedirect;
