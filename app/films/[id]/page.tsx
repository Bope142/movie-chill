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
  TypeMovieDetails,
  TypeMovieOverview,
} from "@/types/movie";
import { fakeDataPopularMovie } from "@/data/fakeData.PopularMovie";
import { CardCategorie, CardMovie } from "@/components/card/card";
import { TitleSection } from "@/components/titleSection/titleSection";
import { MdStarRate } from "react-icons/md";
import { Button, ButtonLink } from "@/components/button/button";
import { FaHeart } from "react-icons/fa";
import { FaShareAlt } from "react-icons/fa";
import { IoLogoLinkedin } from "react-icons/io";
import { AiFillInstagram } from "react-icons/ai";
import { FaFacebookSquare } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { useGetDetailMovie } from "@/hooks/useMovie";
import { ModalMessage } from "@/components/modal/modal";
type propsBanner = {
  movie?: DetailMovie;
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
          <h2>{movie && movie.original_title}</h2>
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
            <p className="years">{movie && movie.release_date}</p>
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

type SimilarMovies = TypeMovieDetails[];
type propsSimilarMovie = {
  movie?: SimilarMovies;
  isLoading: boolean;
};

const ContainerMovieSimilar = ({ movie, isLoading }: propsSimilarMovie) => {
  const loadingCardMovies = Array.from({ length: 10 }).map((_, index) => (
    <CardMovie variant="primary" key={index} isLoading={true} />
  ));

  return (
    <section className="section__page sections__movies">
      <TitleSection variant="title-large" title="FILMS SIMILAIR" />
      <ContainerScroll>
        {isLoading
          ? loadingCardMovies
          : movie &&
            movie
              .slice(0, 20)
              .map(
                (movie: TypeMovieDetails) =>
                  movie.poster_path !== null && (
                    <CardMovie
                      key={movie.id}
                      variant="primary"
                      poster={movie.poster_path}
                      title={movie.title}
                      id={movie.id}
                      cover={movie.backdrop_path}
                    />
                  )
              )}
      </ContainerScroll>
    </section>
  );
};
function MovieDetailPage({ params }: { params: Record<string, string> }) {
  const id = parseInt(params.id);
  const { data, isLoading } = useGetDetailMovie(id);
  return (
    <main className="container__page">
      <Suspense fallback={<LoaderPage />}>
        <PageContent>
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

export default MovieDetailPage;
