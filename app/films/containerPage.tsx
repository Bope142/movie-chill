/* eslint-disable react/no-unescaped-entities */
"use client";
import { ContainerScroll, PageContent } from "@/components/container/container";
import "./style.scss";
import LoaderPage from "@/components/loader/loader";
import { Suspense } from "react";
import { Button, ButtonLink } from "@/components/button/button";
import { FaPlay } from "react-icons/fa";
import { MdStarRate } from "react-icons/md";
import { TypeMovieDetails } from "@/types/movie";
import { CardMovie } from "@/components/card/card";
import { TitleSection } from "@/components/titleSection/titleSection";
import { useGetPopularMovie } from "@/hooks/useMovie";
import { useEffect, useState, useMemo } from "react";
import { useMutation } from "react-query";
import axios from "axios";
import { useGettAllCategories } from "@/hooks/useCategory";
import { TypeMovieCategory } from "@/types/categorie";
import { useSession } from "next-auth/react";
import useAuthRedirect from "@/hooks/useAuthRedirect";

interface PropsMovieRandom {
  categorieMovie?: TypeMovieCategory;
  isLoading: boolean;
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
        <ButtonLink variant="secondary" href={`/films/${randomMovie?.id}`}>
          Plus d'infos
        </ButtonLink>
      </div>
    </section>
  );
  return displayContainer;
};

const ContainerRandomMovieOne: React.FC<PropsMovieRandom> = ({
  categorieMovie,
  isLoading,
}) => {
  type MovieType = TypeMovieDetails[];
  const [loadingMovie, setLoadingMovie] = useState<boolean>(true);
  const [Movies, setMovies] = useState<MovieType>([]);

  const { mutate: getMovies, isLoading: loaded } = useMutation(
    (id: number) => axios.get(`/api/movies/genre/${id}?page=${1}`),
    {
      onSuccess: async (response) => {
        setMovies(response.data);
        setLoadingMovie(false);
      },
      onError: async (error) => {
        console.log(error);
      },
    }
  );
  const loadingCardMovies = Array.from({ length: 10 }).map((_, index) => (
    <CardMovie variant="primary" key={index} isLoading={true} />
  ));
  useEffect(() => {
    if (!isLoading && categorieMovie) {
      getMovies(categorieMovie?.idMovieDb);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, categorieMovie]);

  const displayContainer = isLoading ? (
    <section
      className="section__page loading__container container__padding"
      id="random_one"
    >
      <div className="skeleton-loading"></div>
    </section>
  ) : loadingMovie ? (
    <section className="section__page" id="random_one">
      <TitleSection
        variant="title-large"
        title={`FILMS ${categorieMovie?.category_name.toUpperCase()}`}
        linkMore={`/films/genre/${categorieMovie?.category_id}`}
      />
      <ContainerScroll>{loadingCardMovies}</ContainerScroll>
    </section>
  ) : (
    <section className="section__page" id="random_one">
      <TitleSection
        variant="title-large"
        title={`FILMS ${categorieMovie?.category_name.toUpperCase()}`}
        linkMore={`/films/genre/${categorieMovie?.category_id}`}
      />
      <ContainerScroll>
        {Movies &&
          Movies.map(
            (movie) =>
              movie.poster_path !== null && (
                <CardMovie
                  key={movie.id}
                  variant="primary"
                  poster={movie.poster_path}
                  title={movie.title}
                  id={movie.id}
                />
              )
          )}
      </ContainerScroll>
    </section>
  );
  return displayContainer;
};

const ContainerRandomMovieTwo: React.FC<PropsMovieRandom> = ({
  categorieMovie,
  isLoading,
}) => {
  type MovieType = TypeMovieDetails[];
  const [loadingMovie, setLoadingMovie] = useState<boolean>(true);
  const [Movies, setMovies] = useState<MovieType>([]);

  const { mutate: getMovies, isLoading: loaded } = useMutation(
    (id: number) => axios.get(`/api/movies/genre/${id}?page=${1}`),
    {
      onSuccess: async (response) => {
        setMovies(response.data);
        setLoadingMovie(false);
      },
      onError: async (error) => {
        console.log(error);
      },
    }
  );
  const loadingCardMovies = Array.from({ length: 10 }).map((_, index) => (
    <CardMovie variant="primary" key={index} isLoading={true} />
  ));
  useEffect(() => {
    if (!isLoading && categorieMovie) {
      getMovies(categorieMovie?.idMovieDb);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, categorieMovie]);

  const displayContainer = isLoading ? (
    <section
      className="section__page loading__container container__padding"
      id="random_one"
    >
      <div className="skeleton-loading"></div>
    </section>
  ) : loadingMovie ? (
    <section className="section__page" id="random_one">
      <TitleSection
        variant="title-large"
        title={`FILMS ${categorieMovie?.category_name.toUpperCase()}`}
        linkMore={`/films/genre/${categorieMovie?.category_id}`}
      />
      <ContainerScroll>{loadingCardMovies}</ContainerScroll>
    </section>
  ) : (
    <section className="section__page" id="random_one">
      <TitleSection
        variant="title-large"
        title={`FILMS ${categorieMovie?.category_name.toUpperCase()}`}
        linkMore={`/films/genre/${categorieMovie?.category_id}`}
      />
      <ContainerScroll>
        {Movies &&
          Movies.map(
            (movie) =>
              movie.poster_path !== null && (
                <CardMovie
                  key={movie.id}
                  variant="primary"
                  poster={movie.poster_path}
                  title={movie.title}
                  id={movie.id}
                />
              )
          )}
      </ContainerScroll>
    </section>
  );
  return displayContainer;
};

const ContainerRandomMovieThree: React.FC<PropsMovieRandom> = ({
  categorieMovie,
  isLoading,
}) => {
  type MovieType = TypeMovieDetails[];
  const [loadingMovie, setLoadingMovie] = useState<boolean>(true);
  const [Movies, setMovies] = useState<MovieType>([]);

  const { mutate: getMovies, isLoading: loaded } = useMutation(
    (id: number) => axios.get(`/api/movies/genre/${id}?page=${1}`),
    {
      onSuccess: async (response) => {
        setMovies(response.data);
        setLoadingMovie(false);
      },
      onError: async (error) => {
        console.log(error);
      },
    }
  );
  const loadingCardMovies = Array.from({ length: 10 }).map((_, index) => (
    <CardMovie variant="primary" key={index} isLoading={true} />
  ));
  useEffect(() => {
    if (!isLoading && categorieMovie) {
      getMovies(categorieMovie?.idMovieDb);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, categorieMovie]);

  const displayContainer = isLoading ? (
    <section
      className="section__page loading__container container__padding"
      id="random_one"
    >
      <div className="skeleton-loading"></div>
    </section>
  ) : loadingMovie ? (
    <section className="section__page" id="random_one">
      <TitleSection
        variant="title-large"
        title={`FILMS ${categorieMovie?.category_name.toUpperCase()}`}
        linkMore={`/films/genre/${categorieMovie?.category_id}`}
      />
      <ContainerScroll>{loadingCardMovies}</ContainerScroll>
    </section>
  ) : (
    <section className="section__page" id="random_one">
      <TitleSection
        variant="title-large"
        title={`FILMS ${categorieMovie?.category_name.toUpperCase()}`}
        linkMore={`/films/genre/${categorieMovie?.category_id}`}
      />
      <ContainerScroll>
        {Movies &&
          Movies.map(
            (movie) =>
              movie.poster_path !== null && (
                <CardMovie
                  key={movie.id}
                  variant="primary"
                  poster={movie.poster_path}
                  title={movie.title}
                  id={movie.id}
                />
              )
          )}
      </ContainerScroll>
    </section>
  );
  return displayContainer;
};

const ContainerRandomMovieFour: React.FC<PropsMovieRandom> = ({
  categorieMovie,
  isLoading,
}) => {
  type MovieType = TypeMovieDetails[];
  const [loadingMovie, setLoadingMovie] = useState<boolean>(true);
  const [Movies, setMovies] = useState<MovieType>([]);

  const { mutate: getMovies, isLoading: loaded } = useMutation(
    (id: number) => axios.get(`/api/movies/genre/${id}?page=${1}`),
    {
      onSuccess: async (response) => {
        setMovies(response.data);
        setLoadingMovie(false);
      },
      onError: async (error) => {
        console.log(error);
      },
    }
  );
  const loadingCardMovies = Array.from({ length: 10 }).map((_, index) => (
    <CardMovie variant="primary" key={index} isLoading={true} />
  ));
  useEffect(() => {
    if (!isLoading && categorieMovie) {
      getMovies(categorieMovie?.idMovieDb);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, categorieMovie]);

  const displayContainer = isLoading ? (
    <section
      className="section__page loading__container container__padding"
      id="random_one"
    >
      <div className="skeleton-loading"></div>
    </section>
  ) : loadingMovie ? (
    <section className="section__page" id="random_one">
      <TitleSection
        variant="title-large"
        title={`FILMS ${categorieMovie?.category_name.toUpperCase()}`}
        linkMore={`/films/genre/${categorieMovie?.category_id}`}
      />
      <ContainerScroll>{loadingCardMovies}</ContainerScroll>
    </section>
  ) : (
    <section className="section__page" id="random_one">
      <TitleSection
        variant="title-large"
        title={`FILMS ${categorieMovie?.category_name.toUpperCase()}`}
        linkMore={`/films/genre/${categorieMovie?.category_id}`}
      />
      <ContainerScroll>
        {Movies &&
          Movies.map(
            (movie) =>
              movie.poster_path !== null && (
                <CardMovie
                  key={movie.id}
                  variant="primary"
                  poster={movie.poster_path}
                  title={movie.title}
                  id={movie.id}
                />
              )
          )}
      </ContainerScroll>
    </section>
  );
  return displayContainer;
};

const ContainerRandomMovieFive: React.FC<PropsMovieRandom> = ({
  categorieMovie,
  isLoading,
}) => {
  type MovieType = TypeMovieDetails[];
  const [loadingMovie, setLoadingMovie] = useState<boolean>(true);
  const [Movies, setMovies] = useState<MovieType>([]);

  const { mutate: getMovies, isLoading: loaded } = useMutation(
    (id: number) => axios.get(`/api/movies/genre/${id}?page=${1}`),
    {
      onSuccess: async (response) => {
        setMovies(response.data);
        setLoadingMovie(false);
      },
      onError: async (error) => {
        console.log(error);
      },
    }
  );
  const loadingCardMovies = Array.from({ length: 10 }).map((_, index) => (
    <CardMovie variant="primary" key={index} isLoading={true} />
  ));
  useEffect(() => {
    if (!isLoading && categorieMovie) {
      getMovies(categorieMovie?.idMovieDb);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, categorieMovie]);

  const displayContainer = isLoading ? (
    <section
      className="section__page loading__container container__padding"
      id="random_one"
    >
      <div className="skeleton-loading"></div>
    </section>
  ) : loadingMovie ? (
    <section className="section__page " id="random_one">
      <TitleSection
        variant="title-large"
        title={`FILMS ${categorieMovie?.category_name.toUpperCase()}`}
        linkMore={`/films/genre/${categorieMovie?.category_id}`}
      />
      <ContainerScroll>{loadingCardMovies}</ContainerScroll>
    </section>
  ) : (
    <section className="section__page" id="random_one">
      <TitleSection
        variant="title-large"
        title={`FILMS ${categorieMovie?.category_name.toUpperCase()}`}
        linkMore={`/films/genre/${categorieMovie?.category_id}`}
      />
      <ContainerScroll>
        {Movies &&
          Movies.map(
            (movie) =>
              movie.poster_path !== null && (
                <CardMovie
                  key={movie.id}
                  variant="primary"
                  poster={movie.poster_path}
                  title={movie.title}
                  id={movie.id}
                />
              )
          )}
      </ContainerScroll>
    </section>
  );
  return displayContainer;
};
const ContainerMoviesRandom = () => {
  type categoriesMovieType = TypeMovieCategory[];
  const [randomCategorie, setRandomCategorie] = useState<categoriesMovieType>(
    []
  );
  const { data: categoriesMovie, isLoading } = useGettAllCategories();
  function getRandomCategories(data: TypeMovieCategory[]): TypeMovieCategory[] {
    const shuffledCategories = data.sort(() => Math.random() - 0.5);
    return shuffledCategories.slice(0, 5);
  }

  useEffect(() => {
    if (!isLoading) {
      setRandomCategorie(getRandomCategories(categoriesMovie));
    }
  }, [isLoading, categoriesMovie]);

  const displayContainer = isLoading ? (
    <>
      <ContainerRandomMovieOne isLoading={true} />
      <ContainerRandomMovieTwo isLoading={true} />
      <ContainerRandomMovieThree isLoading={true} />
      <ContainerRandomMovieFour isLoading={true} />
      <ContainerRandomMovieFive isLoading={true} />
    </>
  ) : (
    randomCategorie.length !== 0 && (
      <>
        <ContainerRandomMovieOne
          isLoading={false}
          categorieMovie={randomCategorie[0]}
        />
        <ContainerRandomMovieTwo
          isLoading={false}
          categorieMovie={randomCategorie[1]}
        />
        <ContainerRandomMovieThree
          isLoading={false}
          categorieMovie={randomCategorie[2]}
        />
        <ContainerRandomMovieFour
          isLoading={false}
          categorieMovie={randomCategorie[3]}
        />
        <ContainerRandomMovieFive
          isLoading={false}
          categorieMovie={randomCategorie[4]}
        />
      </>
    )
  );
  return displayContainer;
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
      <main className="container__page" id="filmPage">
        <Suspense fallback={<LoaderPage />}>
          <PageContent name={session.user?.name} image={session.user?.image}>
            <BannerPage />
            <ContainerMoviesRandom />
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
