/* eslint-disable react/no-unescaped-entities */
"use client";
import { InputBoxForm } from "@/components/form/form";
import "./style.scss";
import Link from "next/link";
import { Button } from "@/components/button/button";
import LoaderPage from "@/components/loader/loader";
import { Suspense, useState } from "react";
import { ModalMessage } from "@/components/modal/modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signup } from "@/lib/auth/action";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useAuthRedirect from "@/hooks/useAuthRedirect";

type TypeInputValidity = {
  nameUser: boolean;
  emailUser: boolean;
  passwordUser: boolean;
  confirmPassword: boolean;
};

const FormSignup = () => {
  const router = useRouter();
  const [loadingBtnSignup, setLoadingBtnSignup] = useState<boolean>(false);
  const [inputValidity, setInputValidity] = useState<TypeInputValidity>({
    nameUser: false,
    emailUser: false,
    passwordUser: false,
    confirmPassword: false,
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
      const formData = new FormData(e.currentTarget);
      const password = formData.get("passwordUser") as string;
      const confirmPassword = formData.get("confirmPassword") as string;

      if (password !== confirmPassword) {
        toast.error("Les mots de passe ne correspondent pas");
        return;
      }
      setLoadingBtnSignup(true);
      const response = await signup(formData);
      if (response.redirectTo) {
        const requestSignIn = await signIn("credentials", {
          redirect: false,
          email: formData.get("emailUser"),
          password: formData.get("passwordUser"),
          callbackUrl: "/",
        });
        if (requestSignIn?.ok) {
          toast.success(
            "Votre inscription sur MOVIE CHILL a été effectuée avec succès ! Veuillez vérifier votre boîte de réception pour activer votre compte."
          );
          router.push("/verify-email");
        } else {
          toast.error("Une erreur s'est produite");
        }

        setLoadingBtnSignup(false);
      } else if (response.formError) {
        console.error(response.formError);
        toast.error(response.formError);
        setLoadingBtnSignup(false);
      }
    }
  };

  return (
    <main className="container__form container__padding">
      <h1>
        Prêt à rejoindre la <span>communauté</span> 😁?
      </h1>
      <p className="text-form">
        Remplissez le formulaire ci-dessous pour créer votre compte Movie Chill
        dès maintenant!
      </p>
      <form action="" className="form__signup form" onSubmit={handleSubmitForm}>
        <InputBoxForm
          label="Nom d'utilisateur"
          placeholder="Votre nom d'utilisateur ici"
          typeInput="text"
          nameInput="nameUser"
          required={true}
          onValidityChange={(isValid) =>
            handleValidityChange("nameUser", isValid)
          }
        />
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
        <InputBoxForm
          label="Confirmation du Mot de Passe"
          placeholder="Confirmer le mot de passe"
          typeInput="password"
          nameInput="confirmPassword"
          required={true}
          onValidityChange={(isValid) =>
            handleValidityChange("confirmPassword", isValid)
          }
        />
        <Button
          variant="primary"
          isDisabled={!isFormValid}
          isLoading={loadingBtnSignup}
        >
          S'inscrire
        </Button>
      </form>
      <p className="bottom-text">
        Vous avez déjà un compte ? Vous pouvez
        <Link href={"/login"} className="">
          connecter ici
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
          Rejoignez la communauté <span>Movie Chill</span> dès aujourd'hui et
          explorez un univers de divertissement <span>cinématographique</span>
          !🤩
        </p>
      </div>
    </main>
  );
};

export const ContainerPage = () => {
  const { data: session, status } = useSession();
  useAuthRedirect(session, status);

  if (status === "loading") {
    return (
      <main className="page__content">
        <LoaderPage />
      </main>
    );
  } else if (status === "unauthenticated") {
    return (
      <main className="container__page" id="signup__page">
        <Suspense fallback={<LoaderPage />}>
          <FormSignup />
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
  } else {
    return (
      <main className="page__content">
        <LoaderPage />
      </main>
    );
  }
};
