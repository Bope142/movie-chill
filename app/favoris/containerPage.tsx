/* eslint-disable react/no-unescaped-entities */
"use client";
import "./style.scss";
import { fakeDataPopularMovie } from "@/data/fakeData.PopularMovie";
import { TypeMovieOverview } from "@/types/movie";
import { Button } from "@/components/button/button";
import { PageContent } from "@/components/container/container";
import LoaderPage from "@/components/loader/loader";
import { Suspense } from "react";
import { CardMovieFavorite } from "@/components/card/card";
import { useSession } from "next-auth/react";
import useAuthRedirect from "@/hooks/useAuthRedirect";

const Banner = () => {
  return (
    <section className="section__page banner__page" id="banner">
      <p>
        les <span>films</span> que vous avez <span>marqués</span> comme{" "}
        <span>favoris</span>.
      </p>
    </section>
  );
};

const ContainerFavoriteMovie = () => {
  const data: Array<TypeMovieOverview> = fakeDataPopularMovie;
  return (
    <section
      className="section__page container__padding"
      id="content__favorite__movie"
    >
      <main className="content-list">
        {data.map((movie, index) => (
          <CardMovieFavorite
            key={index}
            poster={movie.poster}
            title={movie.title}
            id={movie.id}
            rating={movie.ratingCount}
            detailsMovie="2024 | English,French"
          />
        ))}
        {data.map((movie, index) => (
          <CardMovieFavorite
            key={index}
            poster={movie.poster}
            title={movie.title}
            id={movie.id}
            rating={movie.ratingCount}
            detailsMovie="2024 | English,French"
          />
        ))}
        {data.map((movie, index) => (
          <CardMovieFavorite
            key={index}
            poster={movie.poster}
            title={movie.title}
            id={movie.id}
            rating={movie.ratingCount}
            detailsMovie="2024 | English,French"
          />
        ))}
      </main>
      <Button variant="primary">Voir plus</Button>
    </section>
  );
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
      <main className="container__page">
        <Suspense fallback={<LoaderPage />}>
          <PageContent name={session.user?.name} image={session.user?.image}>
            <Banner />
            <ContainerFavoriteMovie />
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
