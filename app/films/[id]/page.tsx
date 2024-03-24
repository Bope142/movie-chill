/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { PageContent } from "@/components/container/container";
import { ContainerScroll } from "@/components/container/container";
import "./style.scss";
import LoaderPage from "@/components/loader/loader";
import { Suspense } from "react";
import { TypeMovieOverview } from "@/types/movie";
import { fakeDataPopularMovie } from "@/data/fakeData.PopularMovie";
import { CardCategorie, CardMovie } from "@/components/card/card";
import { TitleSection } from "@/components/titleSection/titleSection";
import { MdStarRate } from "react-icons/md";
import { Button } from "@/components/button/button";
import { FaHeart } from "react-icons/fa";
import { FaShareAlt } from "react-icons/fa";
import { IoLogoLinkedin } from "react-icons/io";
import { AiFillInstagram } from "react-icons/ai";
import { FaFacebookSquare } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
const Banner = () => {
  const ratingCountIcons = (rating: number): React.ReactNode => {
    let containerRating: React.ReactNode[] = [];
    for (let index = 0; index < rating; index++) {
      containerRating.push(<MdStarRate key={index} className="icons-start" />);
    }
    return containerRating;
  };
  return (
    <section className="section__page banner__page" id="bannerMovie">
      <div className="container__details__movies">
        <div className="left">
          <h2>The Last Human Season 1</h2>
          <div className="category__movie__container">
            <CardCategorie variant="default" title="Action" />
            <CardCategorie variant="default" title="Drame" />
            <CardCategorie variant="default" title="Horreur" />
          </div>
          <div className="details__other">
            <div className="rating">{ratingCountIcons(4)}</div>
            <span className="circle"></span>
            <p className="years">2024</p>
            <p className="langs">French, English</p>
          </div>
        </div>
        <div className="right">
          <Button variant="secondary">Voir le trailer</Button>
          <Button variant="primary">
            <FaHeart />
          </Button>
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
      </div>
      <p className="overview-movie">
        « Pendant ce temps, dans un autre univers... » Dans une variation du
        genre classique, Madame Web raconte les origines de l'une des plus
        énigmatiques héroïnes des bandes dessinées Marvel. Le suspense met en
        vedette Dakota Johnson dans le rôle de Cassandra Webb, une ambulancière
        de Manhattan ayant des dons de voyance. Contrainte de faire face à des
        révélations sur son passé, elle
      </p>
    </section>
  );
};

const ContainerMovieSimilar = () => {
  const data: Array<TypeMovieOverview> = fakeDataPopularMovie;
  return (
    <section className="section__page sections__movies">
      <TitleSection variant="title-large" title="FILMS SIMILAIR" />
      <ContainerScroll>
        {data.map((movie, index) => (
          <CardMovie
            key={index}
            variant="primary"
            poster={movie.poster}
            title={movie.title}
            id={movie.id}
          />
        ))}
      </ContainerScroll>
    </section>
  );
};
function MovieDetailPage() {
  return (
    <main className="container__page">
      <Suspense fallback={<LoaderPage />}>
        <PageContent>
          <Banner />
          <ContainerMovieSimilar />
        </PageContent>
      </Suspense>
    </main>
  );
}

export default MovieDetailPage;
