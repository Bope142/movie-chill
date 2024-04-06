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
  passwordUser: boolean;
};
type propsContainer = {
  token: string;
};

const FormForgotPassword = ({ token }: propsContainer) => {
  const [inputValidity, setInputValidity] = useState<TypeInputValidity>({
    passwordUser: false,
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
        Nouveau <span>Mot</span> de <span>Passe</span>🔐
      </h1>
      <p className="text-form">
        Sur cette page, vous pouvez changer votre mot de passe en suivant
        quelques étapes simples. Assurez-vous de choisir un mot de passe
        sécurisé et de le conserver en lieu sûr.
      </p>
      <form
        action=""
        className="form__reset__password form"
        onSubmit={handleSubmitForm}
      >
        <input type="hidden" name="token" value={token} />
        <InputBoxForm
          label="Mot de passe"
          placeholder="Votre nouveau mot de passe ici"
          typeInput="password"
          nameInput="passwordUser"
          required={true}
          onValidityChange={(isValid) =>
            handleValidityChange("passwordUser", isValid)
          }
        />
        <Button
          variant="primary"
          isDisabled={!isFormValid}
          isLoading={loadingBtnSendLink}
        >
          Rénitialiser le mot de passe
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
          Assurez-vous de <span>conserver</span> votre nouveau{" "}
          <span>mot de passe</span> en lieu sûr et de ne le{" "}
          <span>partager</span> avec <span>personne</span>.
        </p>
      </div>
    </main>
  );
};

export const ContainerPage = ({ token }: propsContainer) => {
  return (
    <main className="container__page" id="forgotpassword__page">
      <Suspense fallback={<LoaderPage />}>
        <FormForgotPassword token={token} />
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
