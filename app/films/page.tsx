/* eslint-disable react/no-unescaped-entities */
import {
  ContainerScroll,
  HeaderContainer,
} from "@/components/container/container";
import "./style.scss";
import LoaderPage from "@/components/loader/loader";
import { Suspense } from "react";
import Footer from "@/components/footer/footer";
import { Button, ButtonLink } from "@/components/button/button";
import { FaPlay } from "react-icons/fa";
import { MdStarRate } from "react-icons/md";
import { TypeMovieOverview } from "@/types/movie";
import { fakeDataPopularMovie } from "@/data/fakeData.PopularMovie";
import { CardMovie } from "@/components/card/card";
import { TitleSection } from "@/components/titleSection/titleSection";
interface PropsMovieComponent {
  movie: TypeMovieOverview;
}

const BannerPage: React.FC<PropsMovieComponent> = ({ movie }) => {
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
      id="banner__movie"
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

const ContainerAllMovies = () => {
  const data: Array<TypeMovieOverview> = fakeDataPopularMovie;
  return (
    <section className="section__page" id="container__all_movie">
      {data.map((movie, index) => (
        <CardMovie
          key={index}
          variant="primary"
          poster={movie.poster}
          title={movie.title}
          id={movie.id}
        />
      ))}
    </section>
  );
};

const ContainerActionMoivies = () => {
  const data: Array<TypeMovieOverview> = fakeDataPopularMovie;
  return (
    <section className="section__page sections__movies">
      <TitleSection
        variant="title-large"
        title="FILMS D'ACTIONS"
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

const ContainerDrameMoivies = () => {
  const data: Array<TypeMovieOverview> = fakeDataPopularMovie;
  return (
    <section className="section__page sections__movies">
      <TitleSection
        variant="title-large"
        title="FILMS DRAMES"
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

const ContainerMusicMoivies = () => {
  const data: Array<TypeMovieOverview> = fakeDataPopularMovie;
  return (
    <section className="section__page sections__movies">
      <TitleSection
        variant="title-large"
        title="FILMS MUSIC"
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
export default function FilmPage() {
  return (
    <main className="container__page" id="filmPage">
      <Suspense fallback={<LoaderPage />}>
        <HeaderContainer />
        <BannerPage movie={fakeDataPopularMovie[0]} />
        <ContainerActionMoivies />
        <ContainerDrameMoivies />
        <ContainerMusicMoivies />
        <Footer />
      </Suspense>
    </main>
  );
}
