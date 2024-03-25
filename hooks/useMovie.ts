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
