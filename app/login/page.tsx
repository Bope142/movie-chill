import { InputBoxForm } from "@/components/form/form";
import "./style.scss";
import Link from "next/link";
import { Button } from "@/components/button/button";

const FormLogin = () => {
  return (
    <main className="container__form container__padding">
      <h1>
        Bienvenue sur <span> Movie Chill</span> 👋
      </h1>
      <p className="text-form">
        Connectez-vous pour accéder à votre compte Movie Chill.
      </p>
      <form action="" className="form__login form">
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
        <Link href={"/"} className="forgot-pswd">
          Mot de passe oublié ?
        </Link>
        <Button variant="primary">Se connecter</Button>
      </form>
      <p className="bottom-text">
        Pas encore de compte ? Vous pouvez
        <Link href={"/"} className="">
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
export default function LoginPage() {
  return (
    <main className="container__page" id="login__page">
      <FormLogin />
      <RightContainer />
    </main>
  );
}
