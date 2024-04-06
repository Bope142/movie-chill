/* eslint-disable react/no-unescaped-entities */
"use client";
import { InputBoxForm } from "@/components/form/form";
import "./style.scss";
import Link from "next/link";
import { Button } from "@/components/button/button";
import LoaderPage from "@/components/loader/loader";
import { Suspense, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sendPasswordResetLink } from "@/lib/auth/action";

type TypeInputValidity = {
  emailUser: boolean;
};
const FormForgotPassword = () => {
  const [inputValidity, setInputValidity] = useState<TypeInputValidity>({
    emailUser: false,
  });
  const [loadingBtnSendLink, setLoadingBtnSendLink] = useState<boolean>(false);
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
      setLoadingBtnSendLink(true);
      const formData = new FormData(e.currentTarget);
      const response = await sendPasswordResetLink(formData);
      if (response.success) {
        toast.success(
          "Un lien de réinitialisation de mot de passe a été envoyé à votre adresse e-mail."
        );
        setLoadingBtnSendLink(false);
      } else if (response.error) {
        console.error(response.error);
        toast.error(response.error);
        setLoadingBtnSendLink(false);
      }
    }
  };
  return (
    <main className="container__form container__padding">
      <h1>
        Mot de passe <span>Oublié</span> ?🤔
      </h1>
      <p className="text-form">
        Si vous avez oublié votre mot de passe, ne vous inquiétez pas. Vous
        pouvez facilement le réinitialiser en suivant les étapes ci-dessous.
      </p>
      <form
        action=""
        className="form__reset__password form"
        onSubmit={handleSubmitForm}
      >
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
        <Button
          variant="primary"
          isDisabled={!isFormValid}
          isLoading={loadingBtnSendLink}
        >
          Envoyer le lien
        </Button>
      </form>
      <p className="bottom-text">
        <Link href={"/"} className="">
          Retour à la page d'accueil
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
          Une fois que vous aurez reçu le lien de <span>réinitialisation</span>{" "}
          par e-mail, suivez les instructions pour choisir un nouveau{" "}
          <span>mot de passe</span> et accéder à votre <span>compte</span> en un
          rien de temps.
        </p>
      </div>
    </main>
  );
};

export const ContainerPage = () => {
  return (
    <main className="container__page" id="forgotpassword__page">
      <Suspense fallback={<LoaderPage />}>
        <FormForgotPassword />
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
