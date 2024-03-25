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
import { useState } from "react";
import { TypeGenreMMovies } from "@/types/categorie";
import { dataGenreMovie } from "@/data/genreMovie";
import LoaderPage from "@/components/loader/loader";
import { Suspense } from "react";
import { useGetPopularMovie } from "@/hooks/useMovie";
const BannerHomePage = () => {
  return (
    <section
      className="section_page"
      id="banner_home"
      style={{
        background: `url("/images/cover/wallpaperflare.com_wallpaper.jpg") center/cover fixed`,
      }}
    >
      <div className="random__movie_container">
        <p className="movie-title">MADAME WEB</p>
        <div className="detail">2024 | LANGUE : English</div>
        <p className="overview">
          « Pendant ce temps, dans un autre univers... » Dans une variation du
          genre classique, Madame Web raconte les origines de l'une des plus
          énigmatiques héroïnes des bandes dessinées Marvel. Le suspense met en
          vedette Dakota Johnson dans le rôle de Cassandra Webb, une
          ambulancière de Manhattan ayant des dons de voyance. Contrainte de
          faire face à des révélations sur son passé, elle
        </p>
        <ButtonLink variant="primary" href="/movie/545">
          Voir Maintenant <FaPlay />
        </ButtonLink>
      </div>
      <div className="container__similar_movie">
        <TitleSection variant="title-small" title="FILM SIMILAIRE" />
        <ContainerScroll>
          <CardMovie
            variant="primary"
            poster="/images/cover/d0I7s9ysy5EEomq5Grvnxriak3v.jpg"
            title="Madame Web"
            id={52}
          />
          <CardMovie
            variant="primary"
            poster="/images/cover/gTANNf43FKKxN5bEGNGIhBF9Wg2.jpg"
            title="Madame Web"
            id={52}
          />
          <CardMovie
            variant="primary"
            poster="/images/cover/pwGmXVKUgKN13psUjlhC9zBcq1o.jpg"
            title="Madame Web"
            id={52}
          />
          <CardMovie
            variant="primary"
            poster="/images/cover/zTYdMdMeMxkPxzLtbkP44HThIAW.jpg"
            title="Madame Web"
            id={52}
          />
        </ContainerScroll>
      </div>
    </section>
  );
};

interface PropsMovieComponent {
  movie?: TypeMovieDetails;
  isLoading: boolean;
}

interface PropsMovieComponent2 {
  movie: TypeMovieOverview;
}

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
        <ButtonLink variant="secondary" href="/movies/12">
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
                  key={index}
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
  const data: Array<TypeMovieOverview> = fakeDataPopularMovie;
  return (
    <section className="section__page" id="film__recentes">
      <TitleSection
        variant="title-large"
        title="FILMS RECENTS"
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
