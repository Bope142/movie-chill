"use client";
import axios from "axios";
import { useQuery } from "react-query";

const getPopularMovie = async (page: number) => {
  try {
    const { data } = await axios.get(`/api/movies/popular?page=${page}`);
    return data;
  } catch (error) {
    console.error("Error while fetching popular movies", error);
    throw error;
  }
};

export const useGetPopularMovie = (page: number) => {
  return useQuery({
    queryKey: ["popular-movie", page],

    queryFn: () => getPopularMovie(page),
  });
};

const getRecentMovie = async (year: number, page: number) => {
  try {
    const { data } = await axios.get(
      `/api/movies/recents?year=${year}&page=${page}`
    );
    return data;
  } catch (error) {
    console.error("Error while fetching recents movies", error);
    throw error;
  }
};

export const useGetRecentMovie = (year: number, page: number) => {
  return useQuery({
    queryKey: ["recent-movie", year, page],

    queryFn: () => getRecentMovie(year, page),
  });
};

const getTrendingMovie = async (page: number) => {
  try {
    const { data } = await axios.get(`/api/movies/trending?page=${page}`);
    return data;
  } catch (error) {
    console.error("Error while fetching playing movies", error);
    throw error;
  }
};

export const useGetTrendingMovie = (page: number) => {
  return useQuery({
    queryKey: ["popular-movie", page],

    queryFn: () => getTrendingMovie(page),
  });
};

const getMovieBasedOnCategorie = async (idCategorie: number, page: number) => {
  try {
    const { data } = await axios.get(
      `/api/movies/genre/${idCategorie}?page=${page}`
    );
    return data;
  } catch (error) {
    console.error("Error while fetching playing movies", error);
    throw error;
  }
};

export const useGetMovieBasedOnCategorie = (
  idCategorie: number,
  page: number
) => {
  return useQuery({
    queryKey: [`movie-by-categorie`, idCategorie, page],

    queryFn: () => getMovieBasedOnCategorie(idCategorie, page),
  });
};

const getUpcomingMovie = async (page: number) => {
  try {
    const { data } = await axios.get(`/api/movies/trending?page=${page}`);
    return data;
  } catch (error) {
    console.error("Error while fetching playing movies", error);
    throw error;
  }
};

export const useGetUpcomingMovie = (page: number) => {
  return useQuery({
    queryKey: ["upcoming-movie", page],

    queryFn: () => getUpcomingMovie(page),
  });
};

const getTrendingMovieTv = async (timeWindow: string, page: number) => {
  try {
    const { data } = await axios.get(
      `/api/movies/tv/trending?time_window=${timeWindow}&page=${page}`
    );
    return data;
  } catch (error) {
    console.error("Error while fetching playing movies", error);
    throw error;
  }
};

export const useGetTrendingMovieTv = (timeWindow: string, page: number) => {
  return useQuery({
    queryKey: ["trending-movie-tv", timeWindow, page],

    queryFn: () => getTrendingMovieTv(timeWindow, page),
  });
};

const getDetailMovie = async (id: number) => {
  try {
    const { data } = await axios.get(`/api/movies/${id}`);
    return data;
  } catch (error) {
    console.error("Error while fetching playing movies", error);
    throw error;
  }
};

export const useGetDetailMovie = (id: number) => {
  return useQuery({
    queryKey: ["detail-movie", id],

    queryFn: () => getDetailMovie(id),
  });
};

const getDetailMovieTv = async (id: number) => {
  try {
    const { data } = await axios.get(`/api/movies/tv/${id}`);
    return data;
  } catch (error) {
    console.error("Error while fetching tv movies", error);
    throw error;
  }
};

export const useGetDetailMovieTv = (id: number) => {
  return useQuery({
    queryKey: ["detail-movie-tv", id],

    queryFn: () => getDetailMovieTv(id),
  });
};

const getFavoritesMovies = async (max: number, skip: number) => {
  try {
    const { data } = await axios.get(
      `/api/users/movies/favorite?max=${max}&skip=${skip}`
    );
    return data.favoriteMovies;
  } catch (error) {
    console.error("Error while fetching popular movies", error);
    throw error;
  }
};

export const useGetFavoritesMovie = (max: number, skip: number) => {
  return useQuery({
    queryKey: ["favorites-movies", max],

    queryFn: () => getFavoritesMovies(max, skip),
  });
};
