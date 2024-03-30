/* eslint-disable react/no-unescaped-entities */
"use client";
import { InputBoxForm } from "@/components/form/form";
import "./style.scss";
import Link from "next/link";
import { Button } from "@/components/button/button";
import LoaderPage from "@/components/loader/loader";
import { Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
type propsForm = {
  emailUser: any;
};
const FormVerifyEmail = ({ emailUser }: propsForm) => {
  return (
    <main className="container__form container__padding">
      <h1>
        <span>Vérification</span> de l'adresse <span>e-mail</span>
      </h1>
      <p className="text-form">
        Un e-mail contenant un code de vérification a été envoyé à {emailUser}.
        Veuillez vérifier votre boîte de réception et suivez les instructions
        pour compléter le processus de vérification.
      </p>
      <form action="" className="form__reset__password form">
        <InputBoxForm
          label="Email"
          placeholder="Votre adresse email ici"
          typeInput="email"
          nameInput="emailUser"
          required={true}
        />
        <Button variant="primary">Confirmer l'adresse</Button>
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
          Si vous ne trouvez pas <span>l'e-mail</span> dans votre boîte de
          réception, veuillez vérifier votre dossier de{" "}
          <span>courrier indésirable</span>
          (spam).
        </p>
      </div>
    </main>
  );
};
export default function ForgotPasswordPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  console.log(session);
  console.log(status);
  if (status === "loading") {
    return (
      <main className="page__content">
        <LoaderPage />
      </main>
    );
  } else if (status === "authenticated") {
    return (
      <main className="container__page" id="verify_email__page">
        <Suspense fallback={<LoaderPage />}>
          {session.user && (
            <FormVerifyEmail emailUser={session.user && session.user.email} />
          )}

          <RightContainer />
        </Suspense>
      </main>
    );
  } else {
    router.push("/login");
    return (
      <main className="page__content" id="homePage">
        <LoaderPage />
      </main>
    );
  }
}
