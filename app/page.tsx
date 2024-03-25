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
import { TypeMovieOverview, TypeMovieDetails } from "@/types/movie";
import { fakeDataPopularMovie } from "@/data/fakeData.PopularMovie";
import { useEffect, useState } from "react";
import { TypeGenreMMovies } from "@/types/categorie";
import { dataGenreMovie } from "@/data/genreMovie";
import LoaderPage from "@/components/loader/loader";
import { Suspense } from "react";
import { useGetPopularMovie, useGetRecentMovie } from "@/hooks/useMovie";
import { useMutation } from "react-query";
import axios from "axios";

interface PropsMovieComponent {
  movie?: TypeMovieDetails;
  isLoading: boolean;
}

interface PropsMovieComponent2 {
  movie: TypeMovieOverview;
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
    if (!isLoading && data !== null) {
      const randomIndex: number = Math.floor(Math.random() * data.length - 1);
      const randomMovieId: number = data[randomIndex].id;
      getSemilarMovie(randomMovieId);
      setCurrentPopularMovie(data[randomIndex]);
      setLoadeingSimilarMovie(false);
    }
  }, [isLoading, data, getSemilarMovie]);

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
          href={`/movies/${currentPopularMovie && currentPopularMovie.id}`}
        >
          Voir Maintenant <FaPlay />
        </ButtonLink>
      </div>
      <div className="container__similar_movie">
        <TitleSection variant="title-small" title="FILM SIMILAIRE" />
        <ContainerScroll>
          {similarMovie.slice(0, 10).map((movie) => (
            <CardMovie
              key={movie.id}
              variant="primary"
              poster={movie.poster_path}
              title={movie.title}
              id={movie.id}
            />
          ))}
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
        <ButtonLink variant="secondary" href={`/movies/${movie?.id}`}>
          Plus d'infos
        </ButtonLink>
      </div>
    </section>
  );
  return displayContainer;
};

const PopularMoviesSection = () => {
  const { data: moviesPopular, isLoading, isError } = useGetPopularMovie(1);
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
          linkMore="/movies/popular"
        />
        <ContainerScroll>
          {isLoading
            ? loadingCardMovies
            : moviesPopular.map((movie: TypeMovieDetails, index: number) => (
                <CardMovie
                  key={movie.id}
                  variant="popular"
                  poster={movie.poster_path}
                  onClick={() => handleCardClick(index)}
                  isSelected={index === selectedMovieIndex}
                />
              ))}
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
  const { data: recentMovie, isLoading, isError } = useGetRecentMovie(year, 1);

  const loadingCardMovies = Array.from({ length: 10 }).map((_, index) => (
    <CardMovie variant="primary" key={index} isLoading={true} />
  ));
  return (
    <section className="section__page" id="film__recentes">
      <TitleSection
        variant="title-large"
        title="FILMS RECENTS"
        linkMore="/movies/recents"
      />
      <ContainerScroll>
        {isLoading
          ? loadingCardMovies
          : recentMovie
              .slice(0, 20)
              .map((movie: TypeMovieDetails) => (
                <CardMovie
                  key={movie.id}
                  variant="primary"
                  poster={movie.poster_path}
                  title={movie.title}
                  id={movie.id}
                />
              ))}
      </ContainerScroll>
    </section>
  );
};
const SectionCategoryMovies = () => {
  const data: Array<TypeGenreMMovies> = dataGenreMovie;
  return (
    <section className="section__page" id="genre__films">
      <TitleSection variant="title-large" title="GENRE DES FILMS" />
      <div className="container__category">
        {data.map((genre, index) => (
          <CardCategorie
            key={index}
            variant="simple"
            title={genre.name}
            id={genre.id}
          />
        ))}
      </div>
    </section>
  );
};

const ContainerMoviePlaying: React.FC<PropsMovieComponent2> = ({ movie }) => {
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
      id="content__movie_trending"
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

const PlayingMoviesSection = () => {
  const [selectedMovieIndex, setSelectedMovieIndex] = useState<number>(2);
  const data: Array<TypeMovieOverview> = fakeDataPopularMovie;
  const handleCardClick = (index: number) => {
    setSelectedMovieIndex(index);
  };
  return (
    <>
      <div className="title__content">
        <TitleSection
          variant="title-large"
          title="EN TENDANCE"
          linkMore="/movies/popular"
        />
      </div>
      <ContainerMoviePlaying movie={data[selectedMovieIndex]} />
      <section className="section__page trending__movie" id="trending__movie">
        <ContainerScroll>
          {data.map((movie, index) => (
            <CardMovie
              key={index}
              variant="simple"
              poster={movie.poster}
              onClick={() => handleCardClick(index)}
              isSelected={index === selectedMovieIndex}
            />
          ))}
        </ContainerScroll>
      </section>
    </>
  );
};

const ContainerRandomMovieOne = () => {
  const data: Array<TypeMovieOverview> = fakeDataPopularMovie;
  return (
    <section className="section__page" id="random_one">
      <TitleSection
        variant="title-large"
        title="FILMS ACTIONS"
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

const ContainerRandomMovieTwo = () => {
  const data: Array<TypeMovieOverview> = fakeDataPopularMovie;
  return (
    <section className="section__page" id="random_two">
      <TitleSection
        variant="title-large"
        title="FILMS HORREUR"
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

const ContainerMovieUpcoming: React.FC<PropsMovieComponent2> = ({ movie }) => {
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
      id="content__movie_upcoming"
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

const UpcomingMoviesSection = () => {
  const [selectedMovieIndex, setSelectedMovieIndex] = useState<number>(2);
  const data: Array<TypeMovieOverview> = fakeDataPopularMovie;
  const handleCardClick = (index: number) => {
    setSelectedMovieIndex(index);
  };
  return (
    <>
      <div className="title__content">
        <TitleSection
          variant="title-large"
          title="FILM AVENIR"
          linkMore="/movies/popular"
        />
      </div>
      <ContainerMovieUpcoming movie={data[selectedMovieIndex]} />
      <section className="section__page trending__movie" id="upcoming__movie">
        <ContainerScroll>
          {data.map((movie, index) => (
            <CardMovie
              key={index}
              variant="simple"
              poster={movie.poster}
              onClick={() => handleCardClick(index)}
              isSelected={index === selectedMovieIndex}
            />
          ))}
        </ContainerScroll>
      </section>
    </>
  );
};

const ContainerTvMoivies = () => {
  const data: Array<TypeMovieOverview> = fakeDataPopularMovie;
  return (
    <section className="section__page" id="tv__movies">
      <TitleSection
        variant="title-large"
        title="TV LIVES"
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
        <ContainerRandomMovieOne />
        <ContainerRandomMovieTwo />
        <UpcomingMoviesSection />
        <ContainerTvMoivies />
        <ContainerFavoritesMoivies />
        <Footer />
      </Suspense>
    </main>
  );
}
