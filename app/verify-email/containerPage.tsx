/* eslint-disable react/no-unescaped-entities */
"use client";
import { InputBoxForm } from "@/components/form/form";
import "./style.scss";
import Link from "next/link";
import { Button, ButtonLink } from "@/components/button/button";
import LoaderPage from "@/components/loader/loader";
import { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMutation } from "react-query";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import { ModalMessage } from "@/components/modal/modal";

type propsForm = {
  emailUser: any;
  setOpenModal: (value: boolean) => void;
};
type TypeInputValidity = {
  verificationCode: boolean;
};
const FormVerifyEmail = ({ emailUser, setOpenModal }: propsForm) => {
  const router = useRouter();
  const [loadingBtnSignup, setLoadingBtnSignup] = useState<boolean>(false);
  const [inputValidity, setInputValidity] = useState<TypeInputValidity>({
    verificationCode: false,
  });
  const { mutate: resendVerificationCode, isLoading: loaded } = useMutation(
    () => axios.get(`/api/auth/resend-verification-email`),
    {
      onSuccess: async (response) => {
        if (response.data.code === 200) {
          toast.success(
            "votre code de vérification a été renvoyé avec succès ! Veuillez vérifier votre messagerie et saisir le code pour continuer."
          );
        } else {
          toast.error(response.data.message);
        }
      },
      onError: async (error) => {},
    }
  );
  const { mutate: verifyEmail, isLoading } = useMutation(
    (code: string) => axios.get(`/api/auth/verify-email/${code}`),
    {
      onSuccess: async (response) => {
        if (response.data.code === 200) {
          toast.success("Votre adresse e-mail a été vérifiée avec succès !");
          setLoadingBtnSignup(false);
          setOpenModal(true);
          router.prefetch("/onboarding-profil");
        } else {
          toast.error(response.data.message);
          setLoadingBtnSignup(false);
        }
      },
      onError: async (error) => {
        console.log(error);
        setLoadingBtnSignup(false);
      },
    }
  );

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
      const code = formData.get("verificationCode") as string;
      verifyEmail(code);
    }
  };

  return (
    <main className="container__form container__padding">
      <h1>
        <span>Vérification</span> de l'adresse <span>e-mail</span>
      </h1>
      <p className="text-form">
        Un e-mail contenant un code de vérification a été envoyé à{" "}
        <strong> {emailUser}</strong>. Veuillez vérifier votre boîte de
        réception et suivez les instructions pour compléter le processus de
        vérification.
      </p>
      <form
        action=""
        className="form__reset__password form"
        onSubmit={handleSubmitForm}
      >
        <InputBoxForm
          label="Code de vérification"
          placeholder="Entrez le code de vérification ici"
          typeInput="text"
          nameInput="verificationCode"
          required={true}
          onValidityChange={(isValid) =>
            handleValidityChange("verificationCode", isValid)
          }
        />
        <Button
          variant="primary"
          isDisabled={!isFormValid}
          isLoading={loadingBtnSignup}
        >
          Confirmer l'adresse
        </Button>
      </form>
      <p className="bottom-text">
        Si vous n'avez pas reçu de code de vérification, veuillez{" "}
        <span
          onClick={() => {
            if (!loaded) {
              resendVerificationCode();
            } else {
              toast.warn(
                "Vous avez déjà demandé un code de vérification. Veuillez attendre avant d'en demander un autre."
              );
            }
          }}
        >
          cliquer ici{" "}
        </span>
        pour renvoyer un nouveau code.
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

export const ContainerPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  useAuthRedirect(session, status);
  console.log(session);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const skipOnBoardingProfil = () => {
    setOpenModal(false);
    window.location.assign("/");
  };

  const goTOOnBoardingProfil = () => {
    setOpenModal(false);
    window.location.assign("/onboarding-profil");
  };
  if (status === "loading") {
    return (
      <main className="page__content">
        <LoaderPage />
      </main>
    );
  } else if (status === "authenticated" && session.user.verified === false) {
    return session !== null ? (
      <main className="container__page" id="verify_email__page">
        <Suspense fallback={<LoaderPage />}>
          {session.user && (
            <FormVerifyEmail
              emailUser={session.user && session.user.email}
              setOpenModal={setOpenModal}
            />
          )}

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
              <Button variant="primary" onClick={goTOOnBoardingProfil}>
                Continuer
              </Button>
            </div>
          </ModalMessage>
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
    ) : (
      <main className="page__content">
        <LoaderPage />
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
