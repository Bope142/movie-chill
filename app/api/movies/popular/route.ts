import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const page = url.searchParams.get("page");

    const popularMoviesResponse = await axios.get(
      `${process.env.BASE_URL_API}discover/movie?sort_by=popularity.desc&api_key=${process.env.API_KEY}&language=fr&page=${page}`
    );

    if (popularMoviesResponse.status === 200) {
      console.log(popularMoviesResponse.data);
      return NextResponse.json(popularMoviesResponse.data.results, {
        status: 200,
      });
    } else {
      return NextResponse.json(
        {
          error: "Failed to fetch data from the API",
        },
        {
          status: popularMoviesResponse.status,
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
