"use client";
import axios from "axios";
import { useQuery } from "react-query";

const getAllCategories = async () => {
  try {
    const { data } = await axios.get(`/api/categories`);
    console.log("ff");
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
