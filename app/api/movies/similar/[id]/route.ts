import { TypeMovieDetails } from "@/types/movie";
import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Record<string, string> }
) => {
  try {
    if (params !== undefined) {
      const { id } = params;
      console.log(id);
      if (!id)
        return NextResponse.json(
          {
            error: "parameters not specified for GET request ",
          },
          {
            status: 403,
          }
        );

      const response = await axios.get(
        `${process.env.BASE_URL_API}movie/${id}/similar?api_key=${process.env.API_KEY}&language=fr&page=1`
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
    } else {
      return NextResponse.json(
        {
          error: "parameters not specified for GET request ",
        },
        {
          status: 403,
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
