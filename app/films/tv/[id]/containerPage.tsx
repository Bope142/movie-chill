/* eslint-disable react/no-unescaped-entities */
"use client";
import React from "react";
import { PageContent } from "@/components/container/container";
import { ContainerScroll } from "@/components/container/container";
import "./style.scss";
import LoaderPage from "@/components/loader/loader";
import { Suspense } from "react";
import {
  DetailMovie,
  DetailTvMovie,
  TVShow,
  TypeMovieDetails,
} from "@/types/movie";
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
import { useGetDetailMovieTv } from "@/hooks/useMovie";
import { useSession } from "next-auth/react";
import useAuthRedirect from "@/hooks/useAuthRedirect";

type propsBanner = {
  movie?: DetailTvMovie;
  isLoading: boolean;
};
const Banner = ({ movie, isLoading }: propsBanner) => {
  const ratingCountIcons = (rating: number): React.ReactNode => {
    let containerRating: React.ReactNode[] = [];
    for (let index = 0; index < rating; index++) {
      containerRating.push(<MdStarRate key={index} className="icons-start" />);
    }
    return containerRating;
  };

  const displayContainer = isLoading ? (
    <section className="banner-loading section__page loading__container container__padding">
      <div className="skeleton-loading"></div>
    </section>
  ) : (
    <section
      className="section__page banner__page"
      id="bannerMovie"
      style={{
        background: `url("https://image.tmdb.org/t/p/original${
          movie && movie.poster_path
        }") center/cover fixed`,
      }}
    >
      <div className="container__details__movies">
        <div className="left">
          <h2>{movie && movie.original_name}</h2>
          <div className="category__movie__container">
            {movie &&
              movie.genres.map((genre) => (
                <CardCategorie
                  key={genre.id}
                  variant="default"
                  title={genre.name}
                />
              ))}
          </div>
          <div className="details__other">
            <div className="rating">
              {" "}
              {movie &&
                ratingCountIcons(
                  Math.round(Math.max(0, Math.min(5, movie.vote_average)))
                )}
            </div>
            <span className="circle"></span>
            <p className="years">{movie && movie.first_air_date}</p>
            <p className="langs">
              {movie &&
                movie.spoken_languages.map((language) => language.name + " ")}
            </p>
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
      <p className="overview-movie">{movie && movie.overview}</p>
    </section>
  );
  return displayContainer;
};

type SimilarMovies = TVShow[];
type propsSimilarMovie = {
  movie?: SimilarMovies;
  isLoading: boolean;
};

const ContainerMovieSimilar = ({ movie, isLoading }: propsSimilarMovie) => {
  const loadingCardMovies = Array.from({ length: 10 }).map((_, index) => (
    <CardMovie variant="primary" key={index} isLoading={true} />
  ));
  console.log(movie);
  return (
    <section className="section__page sections__movies">
      <TitleSection variant="title-large" title="SERIE SIMILAIRES" />
      <ContainerScroll>
        {isLoading
          ? loadingCardMovies
          : movie &&
            movie
              .filter((movie: TVShow) => movie.poster_path !== null)
              .slice(0, 20)
              .map((movie: TVShow) => (
                <CardMovie
                  key={movie.id}
                  variant="primary"
                  poster={movie.poster_path}
                  title={movie.original_name}
                  id={movie.id}
                  forTv={true}
                />
              ))}
      </ContainerScroll>
    </section>
  );
};

type propsContainer = {
  idMovie: number;
};

export const ContainerPage = ({ idMovie }: propsContainer) => {
  const { data: session, status } = useSession();
  useAuthRedirect(session, status);
  const { data, isLoading } = useGetDetailMovieTv(idMovie);

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
            <Banner isLoading={isLoading} movie={!isLoading && data.movie} />
            <ContainerMovieSimilar
              isLoading={isLoading}
              movie={!isLoading && data.similar}
            />
          </PageContent>
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
