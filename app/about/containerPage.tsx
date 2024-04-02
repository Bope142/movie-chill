/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState } from "react";
import "./style.scss";
import { PageContent } from "@/components/container/container";
import LoaderPage from "@/components/loader/loader";
import { Suspense } from "react";
import { CardAbout, CardFAQ } from "@/components/card/card";
import Image from "next/image";
import { MdMovieFilter } from "react-icons/md";
import { TbWorldShare } from "react-icons/tb";
import { FaCode } from "react-icons/fa";
import { TitleSection } from "@/components/titleSection/titleSection";
import { FaShareAlt } from "react-icons/fa";
import { IoLogoLinkedin } from "react-icons/io";
import { AiFillInstagram } from "react-icons/ai";
import { FaFacebookSquare } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { useSession } from "next-auth/react";
import useAuthRedirect from "@/hooks/useAuthRedirect";

const Banner = () => {
  return (
    <section className="section__page banner__page" id="banner">
      <p>
        <span>Movie Chill</span>, votre destination ultime pour{" "}
        <span>découvrir</span>, partager et sauvegarder vos <span>films</span>{" "}
        et <span>séries</span> préférés.
      </p>
    </section>
  );
};
const ContainerAboutText = () => {
  return (
    <section className="section__about container__padding">
      <div className="card__about_container">
        <CardAbout
          title="Exploration sans fin"
          overview="Explorez une vaste bibliothèque de films et de séries provenant de la base de données de The Movie Database (TMDb). Que vous recherchiez des classiques intemporels, des blockbusters récents ou des pépites méconnues, nous avons quelque chose pour tout le monde."
          icons={<MdMovieFilter />}
        />
        <CardAbout
          title="Interaction sociale"
          overview="Créez un compte Movie Chill pour enregistrer vos films et séries préférés, partager des recommandations avec vos amis et découvrir ce que les autres membres de la communauté regardent."
          icons={<TbWorldShare />}
        />
        <CardAbout
          title="Collaboration ouverte"
          overview="Movie Chill est un projet open-source hébergé sur GitHub. Nous accueillons les contributions de développeurs du monde entier pour améliorer et étendre les fonctionnalités de l'application. Si vous souhaitez contribuer, consultez notre dépôt GitHub et laissez une étoile pour montrer votre soutien."
          icons={<FaCode />}
        />
      </div>
      <p className="text-about">
        Movie Chill est un <span>projet open-source</span> disponible sur
        <span>GitHub</span>. Mon objectif est de vous offrir une expérience de
        <span>divertissement</span> cinématographique <span>enrichissante</span>{" "}
        et
        <span> collaborative</span>.
      </p>
    </section>
  );
};

const ContainerFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const faqData = [
    {
      title: "1. Qu'est-ce que Movie Chill?",
      response:
        "Movie Chill est une plateforme en ligne dédiée à la découverte, au partage et à la sauvegarde de films et de séries. Notre objectif est de fournir une expérience de divertissement cinématographique enrichissante en mettant à disposition une vaste collection de contenus, ainsi qu'en encourageant l'interaction sociale entre les utilisateurs.",
    },
    {
      title: "2. Comment puis-je utiliser Movie Chill?",
      response:
        "Pour utiliser Movie Chill, vous pouvez simplement parcourir notre catalogue de films et de séries, enregistrer vos titres préférés, partager des recommandations avec vos amis, et découvrir ce que d'autres membres de la communauté regardent. Créez un compte gratuit pour accéder à toutes les fonctionnalités de Movie Chill.",
    },
    {
      title: "3. Est-ce que Movie Chill est gratuit?",
      response:
        "Oui, Movie Chill est entièrement gratuit à utiliser. Vous pouvez parcourir notre catalogue, enregistrer des films et des séries, partager des recommandations, et interagir avec la communauté sans aucun frais.",
    },
    {
      title: "4. Comment puis-je contribuer à Movie Chill?",
      response:
        "Si vous souhaitez contribuer à Movie Chill, vous pouvez soutenir le projet en laissant une étoile sur notre dépôt GitHub, en partageant l'application avec vos amis, ou en proposant des suggestions d'amélioration. Si vous êtes un développeur, vous pouvez également contribuer au code source de Movie Chill sur GitHub.",
    },
    {
      title:
        "5. Comment puis-je signaler un problème ou suggérer une amélioration?",
      response:
        "Si vous rencontrez un problème technique, avez des questions ou souhaitez suggérer une amélioration pour Movie Chill, n'hésitez pas à nous contacter à [votre adresse email] ou à soumettre une issue sur notre dépôt GitHub. Nous apprécions votre retour et travaillons continuellement pour rendre Movie Chill encore meilleur.",
    },
    {
      title: "6. Movie Chill est-il disponible sur mobile?",
      response:
        "Actuellement, Movie Chill est une application web optimisée pour une utilisation sur les navigateurs web sur ordinateurs de bureau et portables. Nous n'avons pas encore de version mobile dédiée, mais vous pouvez accéder à Movie Chill depuis votre téléphone ou votre tablette via le navigateur web de votre appareil.",
    },
  ];
  const handleCardClick = (index: any) => {
    setActiveIndex(index === activeIndex ? null : index);
  };
  return (
    <section className="section__faq container__padding">
      <TitleSection variant="title-large" title="FAQ - Movie Chill" />
      <div className="container__faq">
        {faqData.map((faq, index) => (
          <CardFAQ
            key={index}
            title={faq.title}
            response={faq.response}
            isOpen={index === activeIndex}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>
    </section>
  );
};

const SectionSharePage = () => {
  return (
    <section className="section__share container__padding">
      <div className="img-content">
        <Image
          src={"/images/icons/share.svg"}
          alt=""
          width={100}
          height={100}
          className="img-fluid
          "
        />
      </div>
      <div className="text-content">
        <p>
          Ensemble, vivons des moments de
          <span> divertissement inoubliables !</span>
        </p>
        <div className="btn-share">
          <div className="front">
            <FaShareAlt /> <p>Partager</p>
          </div>
          <div className="content-icons">
            <a href="">
              <IoLogoLinkedin />
            </a>
            <a href="">
              <AiFillInstagram />
            </a>
            <a href="">
              <FaFacebookSquare />
            </a>
            <a href="">
              <IoLogoWhatsapp />
            </a>
          </div>
        </div>
      </div>
    </section>
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
          <PageContent name={session.user?.name} image={session.user?.image}>
            <Banner />
            <ContainerAboutText />
            <ContainerFAQ />
            <SectionSharePage />
          </PageContent>
        </Suspense>
      </main>
    );
  }
  return (
    <main className="page__content">
      <Suspense fallback={<LoaderPage />}>
        <PageContent name={null} image={null}>
          <Banner />
          <ContainerAboutText />
          <ContainerFAQ />
          <SectionSharePage />
        </PageContent>
      </Suspense>
    </main>
  );
};
