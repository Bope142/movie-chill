/* eslint-disable react/no-unescaped-entities */
"use client";
import {
  ContainerScroll,
  HeaderContainer,
} from "@/components/container/container";
import "./style.scss";
import LoaderPage from "@/components/loader/loader";
import { Suspense } from "react";
import Footer from "@/components/footer/footer";
import { Button, ButtonLink } from "@/components/button/button";
import { FaPlay } from "react-icons/fa";
import { MdStarRate } from "react-icons/md";
import { TypeMovieDetails, TypeMovieOverview } from "@/types/movie";
import { fakeDataPopularMovie } from "@/data/fakeData.PopularMovie";
import { CardMovie } from "@/components/card/card";
import { TitleSection } from "@/components/titleSection/titleSection";
import { useGetPopularMovie } from "@/hooks/useMovie";
import { useEffect, useState, useMemo } from "react";
interface PropsMovieComponent {
  movie: TypeMovieOverview;
}

const BannerPage = () => {
  const { data, isLoading, isError } = useGetPopularMovie(1);
  const [randomMovie, setRandomMovie] = useState<TypeMovieDetails>();
  const ratingCountIcons = (rating: number): React.ReactNode => {
    let containerRating: React.ReactNode[] = [];
    for (let index = 0; index < rating; index++) {
      containerRating.push(<MdStarRate key={index} className="icons-start" />);
    }
    return containerRating;
  };
  useEffect(() => {
    if (!isLoading && data !== null) {
      const randomIndex: number = Math.floor(Math.random() * data.length - 1);
      setRandomMovie(data[randomIndex]);
    }
  }, [isLoading, data]);
  const displayContainer = isLoading ? (
    <section
      className="banner-loading section__page loading__container"
      id="banner__movie"
    >
      <div className="skeleton-loading"></div>
    </section>
  ) : (
    <section
      className="section__page"
      id="banner__movie"
      style={{
        background: `url("https://image.tmdb.org/t/p/original${
          randomMovie && randomMovie.poster_path
        }") center/cover fixed`,
      }}
    >
      <h1>{randomMovie && randomMovie.title}</h1>
      <div className="details__movie">
        <div className="rating">
          {randomMovie &&
            ratingCountIcons(
              Math.round(Math.max(0, Math.min(5, randomMovie.vote_average)))
            )}
        </div>
        <p className="rate_prct">
          {randomMovie && randomMovie.vote_count.toFixed(1)}
        </p>
        <p className="years">{randomMovie && randomMovie.release_date}</p>
      </div>
      <p className="overview">{randomMovie && randomMovie.overview}</p>

      <div className="controll-action-button">
        <Button variant="primary">
          Voir le trailer <FaPlay />
        </Button>
        <ButtonLink variant="secondary" href={`/movies/${randomMovie?.id}`}>
          Plus d'infos
        </ButtonLink>
      </div>
    </section>
  );
  return displayContainer;
};

const ContainerAllMovies = () => {
  const data: Array<TypeMovieOverview> = fakeDataPopularMovie;
  return (
    <section className="section__page" id="container__all_movie">
      {data.map((movie, index) => (
        <CardMovie
          key={index}
          variant="primary"
          poster={movie.poster}
          title={movie.title}
          id={movie.id}
        />
      ))}
    </section>
  );
};

const ContainerActionMoivies = () => {
  const data: Array<TypeMovieOverview> = fakeDataPopularMovie;
  return (
    <section className="section__page sections__movies">
      <TitleSection
        variant="title-large"
        title="FILMS D'ACTIONS"
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

const ContainerDrameMoivies = () => {
  const data: Array<TypeMovieOverview> = fakeDataPopularMovie;
  return (
    <section className="section__page sections__movies">
      <TitleSection
        variant="title-large"
        title="FILMS DRAMES"
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

const ContainerMusicMoivies = () => {
  const data: Array<TypeMovieOverview> = fakeDataPopularMovie;
  return (
    <section className="section__page sections__movies">
      <TitleSection
        variant="title-large"
        title="FILMS MUSIC"
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
export default function FilmPage() {
  return (
    <main className="container__page" id="filmPage">
      <Suspense fallback={<LoaderPage />}>
        <HeaderContainer />
        <BannerPage />
        <ContainerActionMoivies />
        <ContainerDrameMoivies />
        <ContainerMusicMoivies />
        <Footer />
      </Suspense>
    </main>
  );
}
