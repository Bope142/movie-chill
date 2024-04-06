import { TypeMovieDetails } from "@/types/movie";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Record<string, string> }
) => {
  try {
    if (params === undefined)
      return NextResponse.json(
        {
          error: "parameters not specified for GET request ",
        },
        {
          status: 403,
        }
      );
    const { id } = params;
    const url = new URL(req.url);
    const page = url.searchParams.get("page");

    const response = await axios.get(
      `${process.env.BASE_URL_API}discover/movie?with_genres=${id}?&sort_by=vote_average.desc&vote_count.gte=10&api_key=${process.env.API_KEY}&language=fr&page=${page}`
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
