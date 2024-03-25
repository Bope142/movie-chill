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
