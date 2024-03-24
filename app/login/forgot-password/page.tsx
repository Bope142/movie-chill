/* eslint-disable react/no-unescaped-entities */
import { InputBoxForm } from "@/components/form/form";
import "./style.scss";
import Link from "next/link";
import { Button } from "@/components/button/button";
import LoaderPage from "@/components/loader/loader";
import { Suspense } from "react";

const FormLogin = () => {
  return (
    <main className="container__form container__padding">
      <h1>
        Mot de passe <span>Oublié</span> ?🤔
      </h1>
      <p className="text-form">
        Si vous avez oublié votre mot de passe, ne vous inquiétez pas. Vous
        pouvez facilement le réinitialiser en suivant les étapes ci-dessous.
      </p>
      <form action="" className="form__reset__password form">
        <InputBoxForm
          label="Email"
          placeholder="Votre adresse email ici"
          typeInput="email"
          nameInput="emailUser"
        />
        <Button variant="primary">Rénitialiser le mot de passe</Button>
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
export default function ForgotPasswordPage() {
  return (
    <main className="container__page" id="forgotpassword__page">
      <Suspense fallback={<LoaderPage />}>
        <FormLogin />
        <RightContainer />
      </Suspense>
    </main>
  );
}
