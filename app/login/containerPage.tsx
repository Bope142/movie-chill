"use client";
import { InputBoxForm } from "@/components/form/form";
import Link from "next/link";
import { Button } from "@/components/button/button";
import LoaderPage from "@/components/loader/loader";
import { useEffect, useState, Suspense } from "react";
import { signIn } from "next-auth/react";

import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
type TypeInputValidity = {
  emailUser: boolean;
  passwordUser: boolean;
};

const FormLogin = () => {
  const router = useRouter();
  const [loadingBtnSignup, setLoadingBtnSignup] = useState<boolean>(false);
  const [inputValidity, setInputValidity] = useState<TypeInputValidity>({
    emailUser: false,
    passwordUser: false,
  });
  const isFormValid = Object.values(inputValidity).every((valid) => valid);

  const handleValidityChange = (
    inputName: keyof TypeInputValidity,
    isValid: boolean
  ) => {
    setInputValidity((prevValidity) => ({
      ...prevValidity,
      [inputName]: isValid,
    }));
  };

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFormValid) {
      setLoadingBtnSignup(true);
      const formData = new FormData(e.currentTarget);
      const requestSignIn = await signIn("credentials", {
        redirect: false,
        email: formData.get("emailUser"),
        password: formData.get("passwordUser"),
        callbackUrl: "/",
      });
      console.log(requestSignIn);
      if (requestSignIn?.ok) {
        toast.success(
          "Authentification réussie! Vous allez être redirigé vers la page d'accueil dans les 2 prochaines sécondes."
        );
        setTimeout(function () {
          router.push("/");
        }, 1000);
      } else {
        toast.error(
          "Les identifiants que vous avez fournis ne sont pas valides. Veuillez vérifier votre adresse e-mail et votre mot de passe, puis réessayer."
        );
        setLoadingBtnSignup(false);
      }
    }
  };
  return (
    <main className="container__form container__padding">
      <h1>
        Bienvenue sur <span> Movie Chill</span> 👋
      </h1>
      <p className="text-form">
        Connectez-vous pour accéder à votre compte Movie Chill.
      </p>
      <form action="" className="form__login form" onSubmit={handleSubmitForm}>
        <InputBoxForm
          label="Email"
          placeholder="Votre adresse email ici"
          typeInput="email"
          nameInput="emailUser"
          required={true}
          onValidityChange={(isValid) =>
            handleValidityChange("emailUser", isValid)
          }
        />
        <InputBoxForm
          label="Mot de Passe"
          placeholder="Votre mot de passe ici"
          typeInput="password"
          nameInput="passwordUser"
          required={true}
          onValidityChange={(isValid) =>
            handleValidityChange("passwordUser", isValid)
          }
        />
        <Link href={"/login/forgot-password"} className="forgot-pswd">
          Mot de passe oublié ?
        </Link>
        <Button
          variant="primary"
          isDisabled={!isFormValid}
          isLoading={loadingBtnSignup}
        >
          Se connecter
        </Button>
      </form>
      <p className="bottom-text">
        Pas encore de compte ? Vous pouvez
        <Link href={"/signup"} className="">
          créer un compte ici
        </Link>
      </p>
    </main>
  );
};
const RightContainer = () => {
  return (
    <main className="container__right container__padding">
      <div className="box">
        <p>
          Connectez-vous pour accéder à une <span>expérience</span>{" "}
          cinématographique <span>personnalisée</span>.🤩{" "}
        </p>
      </div>
    </main>
  );
};

export const ContainerPage = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  useAuthRedirect(session, status, pathname);

  if (status === "loading") {
    return (
      <main className="page__content">
        <LoaderPage />
      </main>
    );
  }
  return (
    <main className="container__page" id="login__page">
      <Suspense fallback={<LoaderPage />}>
        <FormLogin />
        <RightContainer />
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </Suspense>
    </main>
  );
};
