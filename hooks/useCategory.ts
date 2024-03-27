"use client";
import axios from "axios";
import { useQuery } from "react-query";

const getAllCategories = async () => {
  try {
    const { data } = await axios.get(`/api/categories`);
    return data;
  } catch (error) {
    console.error("Error while fetching categorie movies", error);
    throw error;
  }
};

export const useGettAllCategories = () => {
  return useQuery({
    queryKey: ["all-categories"],

    queryFn: getAllCategories,
  });
};

const getOneCategorie = async (id: number) => {
  try {
    const { data } = await axios.get(`/api/categories/${id}`);
    return data;
  } catch (error) {
    console.error("Error while fetching categorie movies", error);
    throw error;
  }
};

export const useGetOneCaregorie = (id: number) => {
  return useQuery({
    queryKey: ["one-categories", id],

    queryFn: () => getOneCategorie(id),
  });
};
