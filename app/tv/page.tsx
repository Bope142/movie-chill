/* eslint-disable react/no-unescaped-entities */
"use client";
import { CardMovie } from "@/components/card/card";
import "./style.scss";
import { fakeDataPopularMovie } from "@/data/fakeData.PopularMovie";
import { TVShow, TypeMovieOverview } from "@/types/movie";
import { Button } from "@/components/button/button";
import { PageContent } from "@/components/container/container";
import LoaderPage from "@/components/loader/loader";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useGetTrendingMovieTv } from "@/hooks/useMovie";
import { useMutation } from "react-query";
import axios from "axios";

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
  type movieTvTrendingTv = TVShow[];
  const randomTimeWindow = useMemo(() => {
    const randomNumber = Math.random();
    return randomNumber < 0.5 ? "day" : "week";
  }, []);
  const {
    data: dataFirstPage,
    isLoading: loadingFirstPage,
    isError,
  } = useGetTrendingMovieTv(randomTimeWindow, 1);
  const [page, setPage] = useState<number>(2);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [movieTrendingTv, setMovieTrendingTv] = useState<movieTvTrendingTv>([]);
  const { mutate: getTrendingMovieTv, isLoading: loaded } = useMutation(
    (pageNumber: number) =>
      axios.get(
        `/api/movies/tv/trending?time_window=${randomTimeWindow}&page=${pageNumber}`
      ),
    {
      onSuccess: async (response) => {
        const newData = response.data.filter((newItem: TVShow) => {
          // Check if item ID is already present in current state
          return !movieTrendingTv.some(
            (item: TVShow) => item.id === newItem.id
          );
        });
        setMovieTrendingTv((prevData) => [...prevData, ...newData]);
        setLoadingData(false);
      },
      onError: async (error) => {
        console.log(error);
      },
    }
  );
  const handlerLoadMoreMovie = () => {
    setLoadingData(true);
    setPage((prevPage) => prevPage + 1); // Increment page number
    getTrendingMovieTv(page);
  };
  useEffect(() => {
    if (loadingFirstPage === false && dataFirstPage !== null) {
      setMovieTrendingTv(dataFirstPage);
      setLoadingData(false);
    }
  }, [loadingFirstPage, dataFirstPage]);

  const loadingCardMovies = Array.from({ length: 20 }).map((_, index) => (
    <CardMovie variant="default" key={index} isLoading={true} />
  ));

  const displayedComponent = loadingFirstPage ? (
    <section
      className="section__page container__padding"
      id="content__movie_tv"
    >
      <main className="content">{loadingCardMovies}</main>
    </section>
  ) : (
    <section
      className="section__page container__padding"
      id="content__movie_tv"
    >
      <main className="content">
        {movieTrendingTv.map((movie, index) => (
          <CardMovie
            key={index}
            variant="default"
            poster={movie.poster_path}
            title={movie.original_name}
            id={movie.id}
          />
        ))}
      </main>
      <Button
        variant="primary"
        isLoading={loadingData}
        onClick={handlerLoadMoreMovie}
      >
        Voir plus
      </Button>
    </section>
  );
  return displayedComponent;
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
