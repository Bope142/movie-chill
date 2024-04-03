/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect, useState } from "react";
import { PageContent } from "@/components/container/container";
import { ContainerScroll } from "@/components/container/container";
import "./style.scss";
import LoaderPage from "@/components/loader/loader";
import { Suspense } from "react";
import {
  DetailMovie,
  TypeMovieDetails,
  UserFavoriteMovie,
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
import { IoLogoWhatsapp } from "react-icons/io";
import { useGetDetailMovie } from "@/hooks/useMovie";
import ModalVideo, { ModalMessage } from "@/components/modal/modal";
import { useSession } from "next-auth/react";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { FaRegHeart } from "react-icons/fa6";
type propsBanner = {
  movie?: DetailMovie;
  isLoading: boolean;
  setOpenModal: (value: boolean) => void;
  existUrlVideo: boolean;
  isFavoriteMovie: boolean;
};
const Banner = ({
  movie,
  isLoading,
  setOpenModal,
  existUrlVideo,
  isFavoriteMovie,
}: propsBanner) => {
  const [loadingBtnLike, setLoadingBtnLike] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(isFavoriteMovie);
  const { mutate: addMovieAsFavorite, isLoading: loaded } = useMutation(
    (movie: UserFavoriteMovie) =>
      axios.post(`/api/users/movies/favorite/`, movie),
    {
      onSuccess: async (response) => {
        console.log(response);
        setLoadingBtnLike(false);
        setIsFavorite(true);
      },
      onError: async (error) => {
        console.log(error);
        setLoadingBtnLike(false);
        setIsFavorite(false);
      },
    }
  );
  const { mutate: removeMovieFromFavorites, isLoading: loadingDelete } =
    useMutation(
      (movieId: number) =>
        axios.delete(`/api/users/movies/favorite?id=${movieId}`),
      {
        onSuccess: async (response) => {
          console.log(response);
          setLoadingBtnLike(false);
          setIsFavorite(false);
        },
        onError: async (error) => {
          console.log(error);
          setLoadingBtnLike(false);
          setIsFavorite(false);
        },
      }
    );

  useEffect(() => {
    setIsFavorite(isFavoriteMovie);
  }, [isFavoriteMovie]);

  const handlerClickFavoriteMovie = () => {
    if (movie) {
      setLoadingBtnLike(true);
      if (isFavorite) {
        removeMovieFromFavorites(movie.id);
      } else {
        const movieData: UserFavoriteMovie = {
          idMovieDb: movie.id,
          title: movie.original_title,
          poster: movie.poster_path,
          release_date: movie.release_date,
          rating_count: movie.vote_average,
          isTvMovie: false,
        };
        addMovieAsFavorite(movieData);
      }
    }
  };
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

          <Button
            variant="primary"
            isLoading={loadingBtnLike}
            onClick={handlerClickFavoriteMovie}
          >
            {isFavorite ? <FaHeart /> : <FaRegHeart />}
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
  } else if (status === "authenticated" && session.user !== undefined) {
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
              isFavoriteMovie={isLoading ? false : data.isFavorite}
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
