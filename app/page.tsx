/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client";
import "./index.style.scss";
import Footer from "@/components/footer/footer";
import { Button, ButtonLink } from "@/components/button/button";
import { FaPlay } from "react-icons/fa";
import { TitleSection } from "@/components/titleSection/titleSection";
import {
  ContainerScroll,
  HeaderContainer,
} from "@/components/container/container";
import { CardCategorie, CardMovie } from "@/components/card/card";
import { MdStarRate } from "react-icons/md";
import { TypeMovieOverview, TypeMovieDetails, TVShow } from "@/types/movie";
import { fakeDataPopularMovie } from "@/data/fakeData.PopularMovie";
import { useEffect, useState, useMemo } from "react";
import { TypeMovieCategory } from "@/types/categorie";
import LoaderPage from "@/components/loader/loader";
import { Suspense } from "react";
import {
  useGetPopularMovie,
  useGetRecentMovie,
  useGetTrendingMovie,
  useGetTrendingMovieTv,
  useGetUpcomingMovie,
} from "@/hooks/useMovie";
import { useMutation } from "react-query";
import axios from "axios";
import { useGettAllCategories } from "@/hooks/useCategory";

interface PropsMovieComponent {
  movie?: TypeMovieDetails;
  isLoading: boolean;
}

interface PropsMovieRandom {
  categorieMovie?: TypeMovieCategory;
  isLoading: boolean;
}

const BannerHomePage = () => {
  type SimilarMovies = TypeMovieDetails[];
  const { data, isLoading, isError } = useGetPopularMovie(1);
  const [loadeingSimilarMovie, setLoadeingSimilarMovie] =
    useState<boolean>(true);
  const [similarMovie, setSimilarMovie] = useState<SimilarMovies>([]);
  const [currentPopularMovie, setCurrentPopularMovie] =
    useState<TypeMovieDetails | null>(null);
  const { mutate: getSemilarMovie, isLoading: loaded } = useMutation(
    (id: number) => axios.get(`/api/movies/similar/${id}`),
    {
      onSuccess: async (response) => {
        setSimilarMovie(response.data);
      },
      onError: async (error) => {
        console.log(error);
      },
    }
  );

  useEffect(() => {
    if (!isLoading && data !== null && isError === false) {
      console.log(data);
      //TODO : fix this error on first load
      const randomIndex: number = Math.floor(Math.random() * data.length - 1);
      const randomMovieId: number = data[1].id;
      getSemilarMovie(randomMovieId);
      setCurrentPopularMovie(data[randomIndex]);
      setLoadeingSimilarMovie(false);
    }
  }, [isLoading]);

  const displayContainer = loadeingSimilarMovie ? (
    <section
      className="banner-loading section__page loading__container"
      id="content__movie_popular"
    >
      <div className="skeleton-loading"></div>
    </section>
  ) : (
    <section
      className="section_page"
      id="banner_home"
      style={{
        background: `url("https://image.tmdb.org/t/p/original${
          currentPopularMovie && currentPopularMovie.poster_path
        }") center/cover fixed`,
      }}
    >
      <div className="random__movie_container">
        <p className="movie-title">
          {currentPopularMovie && currentPopularMovie.title}
        </p>
        <div className="detail">
          {currentPopularMovie && currentPopularMovie.release_date} | LANGUE :{" "}
          {currentPopularMovie && currentPopularMovie.original_language}
        </div>
        <p className="overview">
          {currentPopularMovie && currentPopularMovie.overview}
        </p>
        <ButtonLink
          variant="primary"
          href={`/films/${currentPopularMovie && currentPopularMovie.id}`}
        >
          Voir Maintenant <FaPlay />
        </ButtonLink>
      </div>
      <div className="container__similar_movie">
        <TitleSection variant="title-small" title="FILM SIMILAIRE" />
        <ContainerScroll>
          {similarMovie
            .slice(0, 10)
            .map(
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
      </div>
    </section>
  );
  return displayContainer;
};

const ContainerCurrentPopularMovie: React.FC<PropsMovieComponent> = ({
  movie,
  isLoading,
}) => {
  const ratingCountIcons = (rating: any): React.ReactNode => {
    let containerRating: React.ReactNode[] = [];
    if (rating !== undefined) {
      for (let index = 0; index < rating; index++) {
        containerRating.push(
          <MdStarRate key={index} className="icons-start" />
        );
      }
      return containerRating;
    }
  };
  const displayContainer = isLoading ? (
    <section
      className="section__page loading__container"
      id="content__movie_popular"
    >
      <div className="skeleton-loading"></div>
    </section>
  ) : (
    <section
      className="section__page"
      id="content__movie_popular"
      style={{
        background: `url("https://image.tmdb.org/t/p/original${
          movie && movie.poster_path
        }") center/cover fixed`,
      }}
    >
      <h1>{movie && movie.title}</h1>
      <div className="details__movie">
        <div className="rating">
          {movie &&
            ratingCountIcons(
              Math.round(Math.max(0, Math.min(5, movie.vote_average)))
            )}
        </div>
        <p className="rate_prct">{movie && movie.vote_count.toFixed(1)}</p>{" "}
        <p className="years">{movie && movie.release_date}</p>
      </div>
      <p className="overview">{movie && movie.overview}</p>
      <div className="controll-action-button">
        <Button variant="primary">
          Voir le trailer <FaPlay />
        </Button>
        <ButtonLink variant="secondary" href={`/films/${movie?.id}`}>
          Plus d'infos
        </ButtonLink>
      </div>
    </section>
  );
  return displayContainer;
};

const PopularMoviesSection = () => {
  const randomPageNumber = useMemo(() => Math.floor(Math.random() * 4) + 1, []);
  const {
    data: moviesPopular,
    isLoading,
    isError,
  } = useGetPopularMovie(randomPageNumber);
  const [selectedMovieIndex, setSelectedMovieIndex] = useState<number>(0);

  const handleCardClick = (index: number) => {
    setSelectedMovieIndex(index);
  };
  const loadingCardMovies = Array.from({ length: 10 }).map((_, index) => (
    <CardMovie variant="popular" key={index} isLoading={true} />
  ));

  return (
    <>
      <section className="section__page" id="popular__movie">
        <TitleSection
          variant="title-large"
          title="FILM POPULAIRE"
          linkMore="/films/popular"
        />
        <ContainerScroll>
          {isLoading
            ? loadingCardMovies
            : moviesPopular.map(
                (movie: TypeMovieDetails, index: number) =>
                  movie.poster_path !== null && (
                    <CardMovie
                      key={movie.id}
                      variant="popular"
                      poster={movie.poster_path}
                      onClick={() => handleCardClick(index)}
                      isSelected={index === selectedMovieIndex}
                    />
                  )
              )}
        </ContainerScroll>
      </section>
      <ContainerCurrentPopularMovie
        movie={isLoading === false && moviesPopular[selectedMovieIndex]}
        isLoading={isLoading}
      />
    </>
  );
};

const ContainerFilmsRecent = () => {
  const date = new Date();
  let year = date.getFullYear();

  const randomPage = Math.floor(Math.random() * 3) + 1;
  const {
    data: recentMovie,
    isLoading,
    isError,
  } = useGetRecentMovie(year, randomPage);

  const loadingCardMovies = Array.from({ length: 10 }).map((_, index) => (
    <CardMovie variant="primary" key={index} isLoading={true} />
  ));
  return (
    <section className="section__page" id="film__recentes">
      <TitleSection variant="title-large" title="FILMS RECENTS" />
      <ContainerScroll>
        {isLoading
          ? loadingCardMovies
          : recentMovie
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
                    />
                  )
              )}
      </ContainerScroll>
    </section>
  );
};
const SectionCategoryMovies = () => {
  const { data: categoriesMovie, isLoading } = useGettAllCategories();

  return (
    <section className="section__page" id="genre__films">
      <TitleSection variant="title-large" title="GENRE DES FILMS" />
      <div className="container__category">
        {isLoading === false &&
          categoriesMovie.map((genre: TypeMovieCategory) => (
            <CardCategorie
              key={genre.category_id}
              variant="simple"
              title={genre.category_name}
              id={genre.category_id}
            />
          ))}
      </div>
    </section>
  );
};

const ContainerMoviePlaying: React.FC<PropsMovieComponent> = ({
  movie,
  isLoading,
}) => {
  const ratingCountIcons = (rating: any): React.ReactNode => {
    let containerRating: React.ReactNode[] = [];
    if (rating !== undefined) {
      for (let index = 0; index < rating; index++) {
        containerRating.push(
          <MdStarRate key={index} className="icons-start" />
        );
      }
      return containerRating;
    }
  };
  const displayContainer = isLoading ? (
    <section
      className="section__page loading__container"
      id="content__movie_trending"
    >
      <div className="skeleton-loading"></div>
    </section>
  ) : (
    <section
      className="section__page"
      id="content__movie_trending"
      style={{
        background: `url("https://image.tmdb.org/t/p/original${
          movie && movie.poster_path
        }") center/cover fixed`,
      }}
    >
      <h1>{movie && movie.title}</h1>
      <div className="details__movie">
        <div className="rating">
          {movie &&
            ratingCountIcons(
              Math.round(Math.max(0, Math.min(5, movie.vote_average)))
            )}
        </div>
        <p className="rate_prct">{movie && movie.vote_count.toFixed(1)}</p>{" "}
        <p className="years">{movie && movie.release_date}</p>
      </div>
      <p className="overview">{movie && movie.overview}</p>
      <div className="controll-action-button">
        <Button variant="primary">
          Voir le trailer <FaPlay />
        </Button>
        <ButtonLink variant="secondary" href={`/films/${movie?.id}`}>
          Plus d'infos
        </ButtonLink>
      </div>
    </section>
  );
  return displayContainer;
};

const PlayingMoviesSection = () => {
  const randomPageNumber = useMemo(() => Math.floor(Math.random() * 4) + 1, []);
  const {
    data: moviesTrending,
    isLoading,
    isError,
  } = useGetTrendingMovie(randomPageNumber);
  const [selectedMovieIndex, setSelectedMovieIndex] = useState<number>(0);

  const handleCardClick = (index: number) => {
    setSelectedMovieIndex(index);
  };
  const loadingCardMovies = Array.from({ length: 10 }).map((_, index) => (
    <CardMovie variant="simple" key={index} isLoading={true} />
  ));

  return (
    <>
      <div className="title__content">
        <TitleSection
          variant="title-large"
          title="EN TENDANCE"
          linkMore="/films/trending"
        />
      </div>
      <ContainerMoviePlaying
        movie={isLoading === false && moviesTrending[selectedMovieIndex]}
        isLoading={isLoading}
      />
      <section className="section__page" id="trending__movie">
        <ContainerScroll>
          {isLoading
            ? loadingCardMovies
            : moviesTrending.map(
                (movie: TypeMovieDetails, index: number) =>
                  movie.poster_path !== null && (
                    <CardMovie
                      key={movie.id}
                      variant="simple"
                      poster={movie.poster_path}
                      onClick={() => handleCardClick(index)}
                      isSelected={index === selectedMovieIndex}
                    />
                  )
              )}
        </ContainerScroll>
      </section>
    </>
  );
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

const ContainerMoviesRandom = () => {
  type categoriesMovieType = TypeMovieCategory[];
  const [randomCategorie, setRandomCategorie] = useState<categoriesMovieType>(
    []
  );
  const { data: categoriesMovie, isLoading } = useGettAllCategories();
  function getRandomCategories(data: TypeMovieCategory[]): TypeMovieCategory[] {
    const shuffledCategories = data.sort(() => Math.random() - 0.5);
    return shuffledCategories.slice(0, 2);
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
      </>
    )
  );
  return displayContainer;
};

const ContainerMovieUpcoming: React.FC<PropsMovieComponent> = ({
  movie,
  isLoading,
}) => {
  const ratingCountIcons = (rating: any): React.ReactNode => {
    let containerRating: React.ReactNode[] = [];
    if (rating !== undefined) {
      for (let index = 0; index < rating; index++) {
        containerRating.push(
          <MdStarRate key={index} className="icons-start" />
        );
      }
      return containerRating;
    }
  };
  const displayContainer = isLoading ? (
    <section
      className="section__page loading__container"
      id="content__movie_trending"
    >
      <div className="skeleton-loading"></div>
    </section>
  ) : (
    <section
      className="section__page"
      id="content__movie_trending"
      style={{
        background: `url("https://image.tmdb.org/t/p/original${
          movie && movie.poster_path
        }") center/cover fixed`,
      }}
    >
      <h1>{movie && movie.title}</h1>
      <div className="details__movie">
        <div className="rating">
          {movie &&
            ratingCountIcons(
              Math.round(Math.max(0, Math.min(5, movie.vote_average)))
            )}
        </div>
        <p className="rate_prct">{movie && movie.vote_count.toFixed(1)}</p>{" "}
        <p className="years">{movie && movie.release_date}</p>
      </div>
      <p className="overview">{movie && movie.overview}</p>
      <div className="controll-action-button">
        <Button variant="primary">
          Voir le trailer <FaPlay />
        </Button>
        <ButtonLink variant="secondary" href={`/films/${movie?.id}`}>
          Plus d'infos
        </ButtonLink>
      </div>
    </section>
  );
  return displayContainer;
};

const UpcomingMoviesSection = () => {
  const randomParam = useMemo(() => Math.floor(Math.random() * 5) + 1, []);
  const {
    data: moviesUpcoming,
    isLoading,
    isError,
  } = useGetUpcomingMovie(randomParam);

  const [selectedMovieIndex, setSelectedMovieIndex] = useState<number>(0);

  const handleCardClick = (index: number) => {
    setSelectedMovieIndex(index);
  };
  const loadingCardMovies = Array.from({ length: 10 }).map((_, index) => (
    <CardMovie variant="simple" key={index} isLoading={true} />
  ));

  return (
    <>
      <div className="title__content">
        <TitleSection
          variant="title-large"
          title="FILM AVENIR"
          linkMore="/films/upcoming"
        />
      </div>
      <ContainerMovieUpcoming
        movie={isLoading === false && moviesUpcoming[selectedMovieIndex]}
        isLoading={isLoading}
      />
      <section className="section__page" id="upcoming__movie">
        <ContainerScroll>
          {isLoading
            ? loadingCardMovies
            : moviesUpcoming.map(
                (movie: TypeMovieDetails, index: number) =>
                  movie.poster_path !== null && (
                    <CardMovie
                      key={movie.id}
                      variant="simple"
                      poster={movie.poster_path}
                      onClick={() => handleCardClick(index)}
                      isSelected={index === selectedMovieIndex}
                    />
                  )
              )}
        </ContainerScroll>
      </section>
    </>
  );
};

const ContainerTvMoivies = () => {
  const randomPageNumber = useMemo(() => Math.floor(Math.random() * 3) + 1, []);
  const randomTimeWindow = useMemo(() => {
    const randomNumber = Math.random();
    return randomNumber < 0.5 ? "day" : "week";
  }, []);

  const {
    data: trendigMovieTv,
    isLoading,
    isError,
  } = useGetTrendingMovieTv(randomTimeWindow, randomPageNumber);
  const loadingCardMovies = Array.from({ length: 10 }).map((_, index) => (
    <CardMovie variant="primary" key={index} isLoading={true} />
  ));
  return (
    <section className="section__page" id="tv__movies">
      <TitleSection
        variant="title-large"
        title="EN TENDANCE TV"
        linkMore="/films/tv/trending"
      />
      <ContainerScroll>
        {isLoading
          ? loadingCardMovies
          : trendigMovieTv
              .slice(0, 20)
              .map(
                (tvShow: TVShow) =>
                  tvShow.poster_path !== null && (
                    <CardMovie
                      key={tvShow.id}
                      variant="primary"
                      poster={tvShow.poster_path}
                      title={tvShow.name}
                      id={tvShow.id}
                      forTv={true}
                    />
                  )
              )}
      </ContainerScroll>
    </section>
  );
};

const ContainerFavoritesMoivies = () => {
  const data: Array<TypeMovieOverview> = fakeDataPopularMovie;
  return (
    <section className="section__page" id="favorites__movies">
      <TitleSection
        variant="title-large"
        title="VOS FAVORIS"
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
      <Suspense fallback={<LoaderPage />}>
        <HeaderContainer />
        <BannerHomePage />
        <PopularMoviesSection />
        <ContainerFilmsRecent />
        <SectionCategoryMovies />
        <PlayingMoviesSection />
        <ContainerMoviesRandom />
        <UpcomingMoviesSection />
        <ContainerTvMoivies />
        {/* <ContainerFavoritesMoivies /> */}
        <Footer />
      </Suspense>
    </main>
  );
}
