"use client";
import React from "react";
import "./style.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, ButtonIcon } from "../button/button";
import { FaPlay } from "react-icons/fa";
import {
  CardAbout,
  CardCategorie,
  CardFAQ,
  CardMovie,
  CardMovieFavorite,
} from "../card/card";
import { InputBoxForm } from "../form/form";
import { TitleSection } from "../titleSection/titleSection";

const HeaderProfilUser = () => {
  return (
    <div className="profil__user_header">
      <Button variant="primary">Se connecter primary</Button>
      <Button variant="secondary">Se connecter secondary</Button>
      <Button variant="danger">
        Se connecter danger <FaPlay />
      </Button>
      <ButtonIcon variant="primary">
        <FaPlay />
      </ButtonIcon>
      <CardMovie
        variant="primary"
        id={15}
        title="La démoiselle et le dragon"
        poster="/images/cover/zTYdMdMeMxkPxzLtbkP44HThIAW.jpg"
        isLoading={true}
      />
      <CardMovie
        variant="primary"
        id={15}
        title="La démoiselle et le dragon"
        poster="/images/cover/zTYdMdMeMxkPxzLtbkP44HThIAW.jpg"
        isLoading={false}
      />
      <CardMovie
        variant="popular"
        id={15}
        title="La démoiselle et le dragon"
        poster="/images/cover/zTYdMdMeMxkPxzLtbkP44HThIAW.jpg"
        isLoading={false}
      />
      <CardMovie
        variant="popular"
        id={15}
        title="La démoiselle et le dragon"
        poster="/images/cover/zTYdMdMeMxkPxzLtbkP44HThIAW.jpg"
        isLoading={true}
      />
      <CardMovie
        variant="simple"
        id={15}
        title="La démoiselle et le dragon"
        poster="/images/cover/zTYdMdMeMxkPxzLtbkP44HThIAW.jpg"
        isLoading={false}
      />
      <CardMovie
        variant="simple"
        id={15}
        title="La démoiselle et le dragon"
        poster="/images/cover/zTYdMdMeMxkPxzLtbkP44HThIAW.jpg"
        isLoading={true}
      />
      <CardMovieFavorite
        title="La démoiselle et le dragon"
        poster="/images/cover/zTYdMdMeMxkPxzLtbkP44HThIAW.jpg"
        detailsMovie="2024 | English,French,Spanish"
        rating={4}
      />
      <CardMovieFavorite isLoading={true} />
      <CardCategorie variant="primary" title="Action" />
      <CardCategorie variant="simple" title="Action" />
      <CardAbout
        title="Exploration sans fin"
        overview="Explorez une vaste bibliothèque de films et de séries provenant de la base de données de The Movie Database (TMDb). Que vous recherchiez des classiques intemporels, des blockbusters récents ou des pépites méconnues, nous avons quelque chose pour tout le monde."
        icons={<FaPlay />}
      />
      <CardFAQ
        title="1. Qu'est-ce que Movie Chill?"
        response="Movie Chill est une plateforme en ligne dédiée à la découverte, au partage et à la sauvegarde de films et de séries. Notre objectif est de fournir une expérience de divertissement cinématographique enrichissante en mettant à disposition une vaste collection de contenus, ainsi qu'en encourageant l'interaction sociale entre les utilisateurs."
      />
      <InputBoxForm
        label="Email"
        placeholder="Entrez votre adresse email ici"
        typeInput="email"
        nameInput="emailUser"
        required={true}
      />
      <TitleSection variant="title-large" title="FILM POPULAIRE" />
      <TitleSection
        variant="title-large"
        title="FILM POPULAIRE"
        linkMore="/dd"
      />
      <TitleSection
        variant="title-small"
        title="FILM POPULAIRE"
        linkMore="/dd"
      />
    </div>
  );
};

const HeaderLogo = () => {
  return (
    <h1 id="headerLogo">
      MOVIE <span>CHILL</span>
    </h1>
  );
};

const HeaderNav = () => {
  const pathname = usePathname();
  const navLinks = [
    { title: "Accueil", path: "/" },
    { title: "Films", path: "/films" },
    { title: "tv lives", path: "/tv" },
    { title: "mes favoris", path: "/favoris" },
    { title: "À propos", path: "/about" },
  ];
  return (
    <nav className="header__nav">
      {navLinks.map((link) => (
        <Link
          key={link.path}
          href={link.path}
          passHref
          className={
            pathname === link.path
              ? "active_item_nav nav__item__header"
              : " nav__item__header"
          }
        >
          {link.title}
        </Link>
      ))}
    </nav>
  );
};

function Header() {
  return (
    <header className="header">
      <HeaderLogo />
      <HeaderNav />
      <HeaderProfilUser />
    </header>
  );
}

export default Header;
