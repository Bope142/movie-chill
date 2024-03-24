"use client";
import React from "react";
import "./style.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Button } from "@/components/button/button";
import { IoCaretBackOutline } from "react-icons/io5";
import Image from "next/image";
import { TypeGenreMMovies } from "@/types/categorie";
import { dataGenreMovie } from "@/data/genreMovie";
import { CardCategorie } from "@/components/card/card";
import { MdAddPhotoAlternate } from "react-icons/md";

const ContainerSlide = () => {
  const data: Array<TypeGenreMMovies> = dataGenreMovie;
  return (
    <main className="container__slide">
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
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
            {data.map((genre, index) => (
              <CardCategorie
                key={index}
                variant="primary"
                title={genre.name}
                id={genre.id}
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
function SuccesSignupPage() {
  return (
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
  );
}

export default SuccesSignupPage;
