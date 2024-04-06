"use client";
import React from "react";
import "./style.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Button } from "@/components/button/button";
import { IoCaretBackOutline } from "react-icons/io5";
import Image from "next/image";
import { TypeMovieCategory } from "@/types/categorie";
import { CardCategorie } from "@/components/card/card";
import { MdAddPhotoAlternate } from "react-icons/md";
import { useSession } from "next-auth/react";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import LoaderPage from "@/components/loader/loader";
import { Suspense, useRef, useState } from "react";
import { useGettAllCategories } from "@/hooks/useCategory";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMutation } from "react-query";
import axios from "axios";

type Swiper = any;
interface SelectedCategory {
  id: number;
  title: string;
}

interface OnboardingInfo {
  urlProfil: string;
  categoriesMovie: SelectedCategory[];
}

const ContainerSlide = () => {
  const { data: categoriesMovie, isLoading } = useGettAllCategories();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [awaitBtnSave, setAwaitBtnSave] = useState<boolean>(false);
  const fileInputRef = useRef(null);
  const [profilPic, setProfilPic] = useState<string>(
    "/images/icons/female_profile.svg"
  );
  const swiperRef = useRef<Swiper | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<
    SelectedCategory[]
  >([]);
  const { mutate: newInfosUser } = useMutation<void, unknown, OnboardingInfo>(
    (onboardingInfo) =>
      axios.put("/api/users/profil/onboarding", onboardingInfo),
    {
      onSuccess: async (response) => {
        setAwaitBtnSave(false);
        toast.success("Le processus d'onboarding s'est terminé avec succès !");
        window.location.assign("/");
      },
      onError: async (error) => {
        setAwaitBtnSave(false);
        console.error(error);
        toast.error(
          "Oups 🫡 une erreur s'est produite. Veuillez réessayer ultérieurement."
        );
      },
    }
  );

  const handleCategoryClick = (id: number, title: string) => {
    const categoryIndex = selectedCategories.findIndex((cat) => cat.id === id);
    if (categoryIndex === -1) {
      setSelectedCategories((prevCategories) => [
        ...prevCategories,
        { id, title },
      ]);
    } else {
      setSelectedCategories((prevCategories) =>
        prevCategories.filter((cat) => cat.id !== id)
      );
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size <= 1572864) {
        // Check if file is less than or equal to 1.5MB
        setSelectedImage(file);
        const imageUrl = URL.createObjectURL(file);
        setProfilPic(imageUrl);
      } else {
        toast.error("La taille du fichier est supérieure à 1.5MB !");
      }
    }
  };

  const handleFinishButtonClick = async () => {
    try {
      if (selectedImage) {
        setAwaitBtnSave(true);
        const imageUrl = await uploadImage(selectedImage);
        newInfosUser({
          urlProfil: imageUrl,
          categoriesMovie: selectedCategories,
        });
      } else {
        setAwaitBtnSave(false);
        toast.warn("Aucune photo séléctionnée!");
      }
    } catch (error: any) {
      setAwaitBtnSave(false);
      console.error("Error uploading image: ", error);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const storageRef = ref(storage, `profil/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error: any) {
      console.error("Error uploading file: ", error);
      setAwaitBtnSave(false);
      throw error;
    }
  };

  return (
    <main className="container__slide">
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        onSwiper={(swiper) => {
          if (swiper !== undefined) {
            swiperRef.current = swiper;
          }
        }}
        simulateTouch={false}
      >
        <SwiperSlide className="content">
          <p className="title-slide">
            Étape 1: Choisissez votre photo de profil
          </p>
          <div className="box-profil">
            <Image
              src={profilPic}
              alt=""
              width={100}
              height={100}
              className="img-fluid"
            />
            <div
              className="btn-add-photo"
              onClick={() => {
                if (
                  fileInputRef.current !== null &&
                  fileInputRef.current !== undefined
                ) {
                  (fileInputRef.current as HTMLInputElement).click();
                }
              }}
            >
              <MdAddPhotoAlternate />
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpeg, image/png"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />

          <div className="controll__slide">
            <Button
              variant="primary"
              onClick={() => {
                if (swiperRef.current !== undefined) {
                  swiperRef.current.slideNext();
                }
              }}
            >
              Continuer
            </Button>
          </div>
        </SwiperSlide>
        <SwiperSlide className="content">
          <p className="title-slide">
            {" "}
            Étape 2: Définissez vos préférences de catégories de films
          </p>
          <div className="box-categories-movie-app">
            {isLoading === false &&
              categoriesMovie.map((genre: TypeMovieCategory) => (
                <CardCategorie
                  key={genre.category_id}
                  variant="primary"
                  title={genre.category_name}
                  id={genre.category_id}
                  onClick={() =>
                    handleCategoryClick(genre.category_id, genre.category_name)
                  }
                />
              ))}
          </div>
          <div className="controll__slide">
            <Button
              variant="primary"
              onClick={() => {
                if (swiperRef.current !== undefined) {
                  swiperRef.current.slidePrev();
                }
              }}
            >
              <IoCaretBackOutline />
            </Button>
            <Button
              variant="primary"
              onClick={handleFinishButtonClick}
              isLoading={awaitBtnSave}
            >
              Terminer
            </Button>
          </div>
        </SwiperSlide>
      </Swiper>
    </main>
  );
};

export const ContainerPage = () => {
  const { data: session, status } = useSession();
  useAuthRedirect(session, status);

  console.log(session);
  if (status === "loading") {
    return (
      <main className="page__content">
        <LoaderPage />
      </main>
    );
  } else if (status === "authenticated" && session.user !== undefined) {
    return (
      <main className="container__page">
        <Suspense fallback={<LoaderPage />}>
          <main className="page__success container__padding">
            <div className="hd">
              <h1>
                Configuration de votre <span>compte</span>
              </h1>
              <div className="indicator">
                <div className="items"></div>
                <div className="items"></div>
              </div>
            </div>
            <ContainerSlide />
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
          </main>
        </Suspense>
      </main>
    );
  }
  return (
    <main className="page__content">
      <LoaderPage />
    </main>
  );
};
