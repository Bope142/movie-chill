import { TypeMovieDetails } from "@/types/movie";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const page = url.searchParams.get("page");
    if (!page)
      return NextResponse.json(
        {
          error: "parameters page not specified for GET request ",
        },
        {
          status: 403,
        }
      );

    const response = await axios.get(
      `${process.env.BASE_URL_API}movie/upcoming?api_key=${process.env.API_KEY}&language=fr&page=${page}`
    );

    if (response.status === 200) {
      const filteredMovies = response.data.results.filter(
        (movie: TypeMovieDetails) =>
          movie.overview !== "" &&
          movie.poster_path !== null &&
          movie.title !== null &&
          movie.title !== ""
      );
      return NextResponse.json(filteredMovies, {
        status: 200,
      });
    } else {
      return NextResponse.json(
        {
          error: "Failed to fetch data from the API",
        },
        {
          status: response.status,
        }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "Something went wrong !",
      },
      {
        status: 500,
      }
    );
  }
};
