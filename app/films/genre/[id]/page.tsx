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
type propsBanner = {
  titleCategory: string;
};
const Banner = ({ titleCategory }: propsBanner) => {
  return (
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
  const { mutate: getMovies, isLoading: loaded } = useMutation(
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
export default function MoviePopular({
  params,
}: {
  params: Record<string, string>;
}) {
  const id = parseInt(params.id);
  const { data: categoriesMovie, isLoading } = useGetOneCaregorie(id);

  return (
    <main className="container__page">
      <Suspense fallback={<LoaderPage />}>
        <PageContent>
          <Banner
            titleCategory={
              categoriesMovie ? categoriesMovie.category_name : "d"
            }
          />
          <ContainerMovie
            idCategorie={categoriesMovie ? categoriesMovie.idMovieDb : 0}
          />
        </PageContent>
      </Suspense>
    </main>
  );
}
