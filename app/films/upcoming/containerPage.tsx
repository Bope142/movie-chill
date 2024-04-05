/* eslint-disable react/no-unescaped-entities */
"use client";
import { CardMovie } from "@/components/card/card";
import "./style.scss";
import { TVShow, TypeMovieDetails } from "@/types/movie";
import { Button } from "@/components/button/button";
import { PageContent } from "@/components/container/container";
import LoaderPage from "@/components/loader/loader";
import { Suspense, useEffect, useState } from "react";
import { useMutation } from "react-query";
import axios from "axios";
import { useGetUpcomingMovie } from "@/hooks/useMovie";
import { useSession } from "next-auth/react";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Banner = () => {
  return (
    <section className="section__page banner__page" id="banner">
      <p>
        Préparez-vous pour l'avenir du <span>cinéma</span> ! Explorez les{" "}
        <span>films à venir</span> et soyez parmi les premiers à découvrir les
        prochaines <span>grandes aventures</span>, les histoires captivantes et
        les performances <span>éblouissantes</span>.
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
  } = useGetUpcomingMovie(1);
  const [page, setPage] = useState<number>(2);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [movieList, setMovieList] = useState<movieType>([]);
  const { mutate: getMovieList, isLoading: loaded } = useMutation(
    (pageNumber: number) =>
      axios.get(`/api/movies/trending?page=${pageNumber}`),
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
        toast.error(
          "Oups ! Nous avons rencontré un problème lors du chargement. Veuillez réessayer ultérieurement."
        );
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
  ) : !isError ? (
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
  ) : (
    <section
      className="section__page container__padding"
      id="content__movie_tv"
    >
      <main className="content">{loadingCardMovies}</main>
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
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
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
