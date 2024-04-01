/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState } from "react";
import { PageContent } from "@/components/container/container";
import { ContainerScroll } from "@/components/container/container";
import "./style.scss";
import LoaderPage from "@/components/loader/loader";
import { Suspense } from "react";
import { DetailMovie, TypeMovieDetails } from "@/types/movie";
import { CardCategorie, CardMovie } from "@/components/card/card";
import { TitleSection } from "@/components/titleSection/titleSection";
import { MdStarRate } from "react-icons/md";
import { Button } from "@/components/button/button";
import { FaHeart } from "react-icons/fa";
import { FaShareAlt } from "react-icons/fa";
import { IoLogoLinkedin } from "react-icons/io";
import { AiFillInstagram } from "react-icons/ai";
import { FaFacebookSquare } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { useGetDetailMovie } from "@/hooks/useMovie";
import ModalVideo, { ModalMessage } from "@/components/modal/modal";
import { useSession } from "next-auth/react";
import useAuthRedirect from "@/hooks/useAuthRedirect";

type propsBanner = {
  movie?: DetailMovie;
  isLoading: boolean;
  setOpenModal: (value: boolean) => void;
  existUrlVideo: boolean;
};
const Banner = ({
  movie,
  isLoading,
  setOpenModal,
  existUrlVideo,
}: propsBanner) => {
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
          {existUrlVideo && (
            <Button variant="secondary" onClick={() => setOpenModal(true)}>
              Voir le trailer
            </Button>
          )}

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

type propsContainer = {
  idMovie: number;
};

export const ContainerPage = ({ idMovie }: propsContainer) => {
  const { data: session, status } = useSession();
  useAuthRedirect(session, status);
  const { data, isLoading } = useGetDetailMovie(idMovie);
  const [openModalVideo, setOpenModalVideo] = useState<boolean>(false);

  if (status === "loading") {
    return (
      <main className="page__content">
        <LoaderPage />
      </main>
    );
  } else if (status === "authenticated" && session.user.name !== null) {
    return (
      <main className="container__page">
        <Suspense fallback={<LoaderPage />}>
          <PageContent name={session.user?.name} image={session.user?.image}>
            <Banner
              isLoading={isLoading}
              movie={!isLoading && data.movie}
              setOpenModal={setOpenModalVideo}
              existUrlVideo={
                isLoading ? false : data.videoLink === null ? false : true
              }
            />
            <ContainerMovieSimilar
              isLoading={isLoading}
              movie={!isLoading && data.similar}
            />
            {!isLoading && data.videoLink !== null && (
              <ModalVideo
                isOpen={openModalVideo}
                videoLink={
                  !isLoading && data.videoLink !== null && data.videoLink
                }
                onClose={() => setOpenModalVideo(false)}
              ></ModalVideo>
            )}
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
