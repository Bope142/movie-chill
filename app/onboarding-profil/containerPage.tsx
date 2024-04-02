"use client";
import React from "react";
import "./style.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Button } from "@/components/button/button";
import { IoCaretBackOutline } from "react-icons/io5";
import Image from "next/image";
import { TypeGenreMMovies, TypeMovieCategory } from "@/types/categorie";
import { dataGenreMovie } from "@/data/genreMovie";
import { CardCategorie } from "@/components/card/card";
import { MdAddPhotoAlternate } from "react-icons/md";
import { useSession } from "next-auth/react";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import LoaderPage from "@/components/loader/loader";
import { Suspense } from "react";
import { useGettAllCategories } from "@/hooks/useCategory";

const ContainerSlide = () => {
  const data: Array<TypeGenreMMovies> = dataGenreMovie;
  const { data: categoriesMovie, isLoading } = useGettAllCategories();
  return (
    <main className="container__slide">
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
        simulateTouch={false}
      >
        <SwiperSlide className="content">
          <p className="title-slide">
            Étape 1: Choisissez votre photo de profil
          </p>
          <div className="box-profil">
            <Image
              src={"/images/icons/female_profile.svg"}
              alt=""
              width={100}
              height={100}
              className="img-fluid"
            />
            <div className="btn-add-photo">
              <MdAddPhotoAlternate />
            </div>
          </div>
          <div className="controll__slide">
            <Button variant="primary">Continuer</Button>
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
                />
              ))}
          </div>
          <div className="controll__slide">
            <Button variant="primary">
              <IoCaretBackOutline />
            </Button>
            <Button variant="primary">Terminer</Button>
          </div>
        </SwiperSlide>
      </Swiper>
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
