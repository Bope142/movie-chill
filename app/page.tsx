/* eslint-disable react/no-unescaped-entities */
"use client";
import Header from "@/components/header/header";
import "./index.style.scss";
import Footer from "@/components/footer/footer";
import { Button, ButtonLink } from "@/components/button/button";
import { FaPlay } from "react-icons/fa";
import { TitleSection } from "@/components/titleSection/titleSection";
import { ContainerScroll } from "@/components/container/container";
import { CardMovie } from "@/components/card/card";
import { MdStarRate } from "react-icons/md";
import { TypePopularMovie } from "@/types/movie";
import { fakeDataPopularMovie } from "@/data/fakeData.PopularMovie";
import { useState } from "react";

const BannerHomePage = () => {
  return (
    <section
      className="section_page"
      id="banner_home"
      style={{
        background: `url("/images/cover/wallpaperflare.com_wallpaper.jpg") center/cover fixed`,
      }}
    >
      <div className="random__movie_container">
        <span>MADAME WEB</span>
        <div className="detail">2024 | LANGUE : English</div>
        <p className="overview">
          « Pendant ce temps, dans un autre univers... » Dans une variation du
          genre classique, Madame Web raconte les origines de l'une des plus
          énigmatiques héroïnes des bandes dessinées Marvel. Le suspense met en
          vedette Dakota Johnson dans le rôle de Cassandra Webb, une
          ambulancière de Manhattan ayant des dons de voyance. Contrainte de
          faire face à des révélations sur son passé, elle
        </p>
        <ButtonLink variant="primary" href="/movie/545">
          Voir Maintenant <FaPlay />
        </ButtonLink>
      </div>
      <div className="container__similar_movie">
        <TitleSection variant="title-small" title="FILM SIMILAIRE" />
        <ContainerScroll>
          <CardMovie
            variant="primary"
            poster="/images/cover/d0I7s9ysy5EEomq5Grvnxriak3v.jpg"
            title="Madame Web"
            id={52}
          />
          <CardMovie
            variant="primary"
            poster="/images/cover/gTANNf43FKKxN5bEGNGIhBF9Wg2.jpg"
            title="Madame Web"
            id={52}
          />
          <CardMovie
            variant="primary"
            poster="/images/cover/pwGmXVKUgKN13psUjlhC9zBcq1o.jpg"
            title="Madame Web"
            id={52}
          />
          <CardMovie
            variant="primary"
            poster="/images/cover/zTYdMdMeMxkPxzLtbkP44HThIAW.jpg"
            title="Madame Web"
            id={52}
          />
        </ContainerScroll>
      </div>
    </section>
  );
};

interface ContainerCurrentPopularMovieProps {
  movie: TypePopularMovie;
}

const ContainerCurrentPopularMovie: React.FC<
  ContainerCurrentPopularMovieProps
> = ({ movie }) => {
  const ratingCountIcons = (rating: number): React.ReactNode => {
    let containerRating: React.ReactNode[] = [];
    for (let index = 0; index < rating; index++) {
      containerRating.push(<MdStarRate key={index} className="icons-start" />);
    }
    return containerRating;
  };
  return (
    <section
      className="section__page"
      id="content__movie_popular"
      style={{
        background: `url("${movie.poster}") center/cover fixed`,
      }}
    >
      <h1>{movie.title}</h1>
      <div className="details__movie">
        <div className="rating">{ratingCountIcons(movie.ratingCount)}</div>{" "}
        <p className="rate_prct">{movie.ratingCount.toFixed(1)}</p>{" "}
        <p className="years">{movie.releaseDate}</p>
      </div>
      <p className="overview">{movie.overview}</p>
      <div className="controll-action-button">
        <Button variant="primary">
          Voir le trailer <FaPlay />
        </Button>
        <ButtonLink variant="secondary" href="/movies/12">
          Plus d'infos
        </ButtonLink>
      </div>
    </section>
  );
};

const PopularMoviesSection = () => {
  const [selectedMovieIndex, setSelectedMovieIndex] = useState<number>(0);
  const data: Array<TypePopularMovie> = fakeDataPopularMovie;
  const handleCardClick = (index: number) => {
    setSelectedMovieIndex(index);
  };
  return (
    <>
      <section className="section__page" id="popular__movie">
        <TitleSection
          variant="title-large"
          title="FILM POPULAIRE"
          linkMore="/movies/popular"
        />
        <ContainerScroll>
          {data.map((movie, index) => (
            <CardMovie
              key={index}
              variant="popular"
              poster={movie.poster}
              onClick={() => handleCardClick(index)}
              isSelected={index === selectedMovieIndex}
            />
          ))}
        </ContainerScroll>
      </section>
      <ContainerCurrentPopularMovie movie={data[selectedMovieIndex]} />
    </>
  );
};

const ContainerFilmsRecent = () => {
  const data: Array<TypePopularMovie> = fakeDataPopularMovie;
  return (
    <section className="section__page" id="film__recentes">
      <TitleSection
        variant="title-large"
        title="FILMS RECENTS"
        linkMore="/movies/recents"
      />
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

export default function Home() {
  return (
    <main className="container__page" id="homePage">
      <Header />
      <BannerHomePage />
      <PopularMoviesSection />
      <ContainerFilmsRecent />
      <Footer />
    </main>
  );
}
