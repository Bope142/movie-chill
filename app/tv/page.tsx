/* eslint-disable react/no-unescaped-entities */
import { CardMovie } from "@/components/card/card";
import "./style.scss";
import { fakeDataPopularMovie } from "@/data/fakeData.PopularMovie";
import { TypeMovieOverview } from "@/types/movie";
import { Button } from "@/components/button/button";
import { PageContent } from "@/components/container/container";
import LoaderPage from "@/components/loader/loader";
import { Suspense } from "react";

const Banner = () => {
  return (
    <section className="section__page banner__page" id="banner">
      <p>
        <span>Explorez</span> un monde vaste de <span>divertissement</span>,
        d'intrigues et de <span>personnages</span> captivants avec notre
        sélection éclectique de <span>séries télévisées</span>.
      </p>
    </section>
  );
};
const ContainerMovieTV = () => {
  const data: Array<TypeMovieOverview> = fakeDataPopularMovie;
  return (
    <section
      className="section__page container__padding"
      id="content__movie_tv"
    >
      <main className="content">
        {data.map((movie, index) => (
          <CardMovie
            key={index}
            variant="default"
            poster={movie.poster}
            title={movie.title}
            id={movie.id}
          />
        ))}
        {data.map((movie, index) => (
          <CardMovie
            key={index}
            variant="default"
            poster={movie.poster}
            title={movie.title}
            id={movie.id}
          />
        ))}
        {data.map((movie, index) => (
          <CardMovie
            key={index}
            variant="default"
            poster={movie.poster}
            title={movie.title}
            id={movie.id}
          />
        ))}
        {data.map((movie, index) => (
          <CardMovie
            key={index}
            variant="default"
            poster={movie.poster}
            title={movie.title}
            id={movie.id}
          />
        ))}
        {data.map((movie, index) => (
          <CardMovie
            key={index}
            variant="default"
            poster={movie.poster}
            title={movie.title}
            id={movie.id}
          />
        ))}
        {data.map((movie, index) => (
          <CardMovie
            key={index}
            variant="default"
            poster={movie.poster}
            title={movie.title}
            id={movie.id}
          />
        ))}
        {data.map((movie, index) => (
          <CardMovie
            key={index}
            variant="default"
            poster={movie.poster}
            title={movie.title}
            id={movie.id}
          />
        ))}
      </main>
      <Button variant="primary">Voir plus</Button>
    </section>
  );
};
export default function TVPage() {
  return (
    <main className="container__page">
      <Suspense fallback={<LoaderPage />}>
        <PageContent>
          <Banner />
          <ContainerMovieTV />
        </PageContent>
      </Suspense>
    </main>
  );
}
