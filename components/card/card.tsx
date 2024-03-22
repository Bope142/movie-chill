/* eslint-disable react/no-unescaped-entities */
import React from "react";
import "./style.scss";
import Image from "next/image";
import { Button, ButtonLink } from "../button/button";
import { MdStarRate } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { BsInfoCircleFill } from "react-icons/bs";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
interface CardFaq {
  title: string;
  response: string;
  isOpen?: boolean;
  onClick?: () => void;
}
interface CardAbout {
  title: string;
  icons: React.ReactNode;
  overview: string;
}

interface CardCategoryMovie {
  variant: "primary" | "simple";
  id?: number;
  title?: string;
  onClick?: () => void;
}
interface CardProps {
  variant: "primary" | "popular" | "simple";
  id?: number;
  title?: string;
  poster: string;
  isLoading?: boolean;
  onClick?: () => void;
}

interface CardFavoriteMovieProps {
  id?: number;
  title?: string;
  rating?: number;
  poster?: string;
  detailsMovie?: string;
  isLoading?: boolean;
  onClick?: () => void;
}

export const CardFAQ: React.FC<CardFaq> = ({
  title,
  response,
  isOpen,
  onClick,
}) => {
  return (
    <div className="card__faq">
      <div className="faq__header">
        <span className="qst__faq">{title}</span>
        <div className="action-faq">{isOpen ? <FaPlus /> : <FaTimes />}</div>
      </div>
      <p className="response__faq">{response}</p>
    </div>
  );
};

export const CardAbout: React.FC<CardAbout> = ({ title, icons, overview }) => {
  return (
    <div className="card__about">
      <div className="icons__box">{icons}</div>
      <span className="title">{title}</span>
      <p className="overview">{overview}</p>
    </div>
  );
};

export const CardCategorie: React.FC<CardCategoryMovie> = ({
  variant,
  id,
  title,
  onClick,
}) => {
  if (variant === "primary") {
    return (
      <div className={`card_categorie  categorie_card_primary `}>{title}</div>
    );
  } else {
    return (
      <Link
        href={`/movies/categorie/${id}`}
        className={`card_categorie categorie_card_simple`}
      >
        {title}
      </Link>
    );
  }
};
export const CardMovieFavorite: React.FC<CardFavoriteMovieProps> = ({
  id,
  title,
  poster,
  rating,
  detailsMovie,
  isLoading,
  onClick,
}) => {
  const skeletonLoadingClass = isLoading ? "card-movie-skeleton-loading" : "";
  const ratingCountIcons = (rating: number): React.ReactNode => {
    let containerRating: React.ReactNode[] = [];
    for (let index = 0; index < rating; index++) {
      containerRating.push(<MdStarRate key={index} className="icons-start" />);
    }
    return containerRating;
  };
  return (
    <div className={`card_movie_favorite ${skeletonLoadingClass}`}>
      {isLoading ? (
        <div className="skeleton-loading"></div>
      ) : (
        <>
          <div className="content__poster">
            {poster && (
              <Image
                src={poster}
                alt={`poster movie ${title}`}
                className="img-fluid poster-movie"
                width={100}
                height={100}
              />
            )}
          </div>
          <div className="content__details">
            <span className="movie__title">{title}</span>
            <div className="rating__count">{ratingCountIcons(rating || 0)}</div>
            <p className="detail">{detailsMovie}</p>
            <div className="controll__btn">
              <ButtonLink variant="primary" href={`/movie/${id}`}>
                <BsInfoCircleFill />
              </ButtonLink>
              <Button variant="danger">
                <MdDelete />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export const CardMovie: React.FC<CardProps> = ({
  variant,
  id,
  title,
  poster,
  isLoading,
  onClick,
}) => {
  const skeletonLoadingClass = isLoading ? variant + "-skeleton-loading" : "";
  switch (variant) {
    case "primary":
      return (
        <div className={`card_movie_primary ${skeletonLoadingClass}`}>
          {isLoading ? (
            <div className="skeleton-loading"></div>
          ) : (
            <>
              <Image
                src={poster}
                alt={`poster movie ${title}`}
                className="img-fluid poster-movie"
                width={100}
                height={100}
              />
              <div className="overview__container">
                <div className="content">
                  <span className="movie__title">{title}</span>
                  <ButtonLink variant="primary" href={`/movie/${id}`}>
                    Voir
                  </ButtonLink>
                </div>
              </div>
            </>
          )}
        </div>
      );

    case "popular":
      return (
        <div
          className={`card_movie_popular ${skeletonLoadingClass}`}
          onClick={(e) => {
            //console.log(e);
            onClick;
          }}
        >
          {isLoading ? (
            <div className="skeleton-loading"></div>
          ) : (
            <Image
              src={poster}
              alt={`poster movie ${title}`}
              className="img-fluid poster-movie"
              width={100}
              height={100}
            />
          )}
        </div>
      );

    case "simple":
      return (
        <div className={`card_movie_simple ${skeletonLoadingClass}`}>
          {isLoading ? (
            <div className="skeleton-loading"></div>
          ) : (
            <Image
              src={poster}
              alt={`poster movie ${title}`}
              className="img-fluid poster-movie"
              width={100}
              height={100}
            />
          )}
        </div>
      );
  }
};
