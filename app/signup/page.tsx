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
        Prêt à rejoindre la <span>communauté</span> 😁?
      </h1>
      <p className="text-form">
        Remplissez le formulaire ci-dessous pour créer votre compte Movie Chill
        dès maintenant!
      </p>
      <form action="" className="form__signup form">
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
  return (
    <main className="container__page" id="signup__page">
      <Suspense fallback={<LoaderPage />}>
        <FormLogin />
        <RightContainer />
      </Suspense>
    </main>
  );
}
