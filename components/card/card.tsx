import React from "react";
import "./style.scss";
import Image from "next/image";
import { ButtonLink } from "../button/button";

interface CardProps {
  variant: "primary" | "popular" | "simple";
  id?: number;
  title?: string;
  poster: string;
  isLoading?: boolean;
  onClick?: () => void;
}

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
