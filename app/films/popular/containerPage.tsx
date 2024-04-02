/* eslint-disable react/no-unescaped-entities */
"use client";
import { CardMovie } from "@/components/card/card";
import "./style.scss";
import { TVShow, TypeMovieDetails } from "@/types/movie";
import { Button } from "@/components/button/button";
import { PageContent } from "@/components/container/container";
import LoaderPage from "@/components/loader/loader";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useMutation } from "react-query";
import axios from "axios";
import { useGetOneCaregorie } from "@/hooks/useCategory";
import { useGetPopularMovie } from "@/hooks/useMovie";
import { useSession } from "next-auth/react";
import useAuthRedirect from "@/hooks/useAuthRedirect";

const Banner = () => {
  return (
    <section className="section__page banner__page" id="banner">
      <p>
        <span>Découvrez</span> les films les plus <span>populaires</span> du
        moment ! Plongez-vous dans une <span>sélection</span> captivante de{" "}
        <span>films</span> qui ont conquis le cœur du <span>public</span>.
      </p>
    </section>
  );
};

const ContainerMovie = () => {
  type movieType = TypeMovieDetails[];
  const {
    data: dataFirstPage,
    isLoading: loadingFirstPage,
    isError,
  } = useGetPopularMovie(1);
  const [page, setPage] = useState<number>(2);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [movieList, setMovieList] = useState<movieType>([]);
  const { mutate: getMovieList, isLoading: loaded } = useMutation(
    (pageNumber: number) => axios.get(`/api/movies/popular?page=${pageNumber}`),
    {
      onSuccess: async (response) => {
        const newData = response.data.filter((newItem: TVShow) => {
          // Check if item ID is already present in current state
          return !movieList.some(
            (item: TypeMovieDetails) => item.id === newItem.id
          );
        });
        setMovieList((prevData) => [...prevData, ...newData]);
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
    getMovieList(page);
  };
  useEffect(() => {
    if (loadingFirstPage === false && dataFirstPage !== null) {
      setMovieList(dataFirstPage);
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
        {movieList.map(
          (movie) =>
            movie.poster_path !== null && (
              <CardMovie
                key={movie.id}
                variant="default"
                poster={movie.poster_path}
                title={movie.original_title}
                id={movie.id}
              />
            )
        )}
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
            <ContainerMovie />
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