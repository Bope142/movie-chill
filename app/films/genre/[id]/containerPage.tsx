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
import { useSession } from "next-auth/react";
import useAuthRedirect from "@/hooks/useAuthRedirect";

type propsBanner = {
  titleCategory: string;
  isLoading: boolean;
};
const Banner = ({ titleCategory, isLoading }: propsBanner) => {
  return isLoading ? (
    <section
      className="banner-loading section__page loading__container"
      id="content__movie_popular"
    >
      <div className="skeleton-loading"></div>
    </section>
  ) : (
    <section className="section__page banner__page" id="banner">
      <p>
        <span>Explorez</span> un monde vaste de <span>divertissement</span>,
        d'intrigues et de <span>personnages</span> captivants avec notre
        sélection éclectique de <span>films {titleCategory}</span>.
      </p>
    </section>
  );
};
type propsContainer = {
  idCategorie: number;
};
const ContainerMovie = ({ idCategorie }: propsContainer) => {
  type MovieType = TypeMovieDetails[];
  const [page, setPage] = useState<number>(2);
  const [loadingFirstPage, setLoadingFirstPage] = useState<boolean>(true);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [movieList, setMovieList] = useState<MovieType>([]);
  const {
    mutate: getMovies,
    isLoading: loaded,
    isError,
  } = useMutation(
    (pageNumber: number) =>
      axios.get(`/api/movies/genre/${idCategorie}?page=${pageNumber}`),
    {
      onSuccess: async (response) => {
        const newData = response.data.filter((newItem: TVShow) => {
          // Check if item ID is already present in current state
          return !movieList.some(
            (item: TypeMovieDetails) => item.id === newItem.id
          );
        });
        setMovieList((prevData) => [...prevData, ...newData]);
        if (loadingFirstPage) {
          setLoadingFirstPage(false);
        } else {
          setLoadingData(false);
        }
      },
      onError: async (error) => {
        console.log(error);
      },
    }
  );
  const handlerLoadMoreMovie = () => {
    setLoadingData(true);
    setPage((prevPage) => prevPage + 1); // Increment page number
    getMovies(page);
  };
  useEffect(() => {
    if (idCategorie !== 0) {
      getMovies(1);
      setLoadingData(false);
    } else {
      setLoadingData(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idCategorie]);

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
type propsContainerPage = {
  idCategorie: number;
};
const Container = ({ idCategorie }: propsContainerPage) => {
  const {
    data: categoriesMovie,
    isLoading,
    isError,
  } = useGetOneCaregorie(idCategorie);
  return (
    <>
      <Banner
        titleCategory={categoriesMovie ? categoriesMovie.category_name : ""}
        isLoading={isError === false ? isLoading : true}
      />
      <ContainerMovie
        idCategorie={
          categoriesMovie && isError === false ? categoriesMovie.idMovieDb : 0
        }
      />
    </>
  );
};
export const ContainerPage = ({ idCategorie }: propsContainerPage) => {
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
            <Container idCategorie={idCategorie} />
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
