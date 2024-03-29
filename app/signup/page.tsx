/* eslint-disable react/no-unescaped-entities */
"use client";
import { InputBoxForm } from "@/components/form/form";
import "./style.scss";
import Link from "next/link";
import { Button, ButtonLink } from "@/components/button/button";
import LoaderPage from "@/components/loader/loader";
import { Suspense, useState } from "react";
import { ModalMessage } from "@/components/modal/modal";
const FormLogin: React.FC<{ setOpenModal: (value: boolean) => void }> = ({
  setOpenModal,
}) => {
  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOpenModal(true);
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
        />
        <InputBoxForm
          label="Email"
          placeholder="Votre adresse email ici"
          typeInput="email"
          nameInput="emailUser"
        />
        <InputBoxForm
          label="Mot de Passe"
          placeholder="Votre mot de passe ici"
          typeInput="password"
          nameInput="passwordUser"
        />
        <InputBoxForm
          label="Confirmation du Mot de Passe"
          placeholder="Confirmer le mot de passe"
          typeInput="password"
          nameInput="confirmPassword"
        />
        <Button variant="primary">S'inscrire</Button>
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
export default function SignupPage() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const skipOnBoardingProfil = () => {
    setOpenModal(false);
  };
  return (
    <main className="container__page" id="signup__page">
      <Suspense fallback={<LoaderPage />}>
        <FormLogin setOpenModal={setOpenModal} />
        <RightContainer />
        <ModalMessage isOpen={openModal}>
          <p className="msg-modal">
            <span>Félicitations</span> 🤩 Votre inscription à{" "}
            <span> Movie Chill</span> a été un succès 🥰😍!
          </p>
          <p className="detail-msg-modal">
            Souhaitez-vous configurer votre compte maintenant ? Vous pouvez
            appuyer sur le bouton <span>Passer</span> pour ignorer cette étape
            ou continuer pour personnaliser votre compte immédiatement.
          </p>
          <div className="modal-action">
            <Button variant="secondary" onClick={skipOnBoardingProfil}>
              Passer
            </Button>
            <ButtonLink variant="primary" href="/">
              Continuer
            </ButtonLink>
          </div>
        </ModalMessage>
      </Suspense>
    </main>
  );
}
