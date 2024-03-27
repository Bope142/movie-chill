import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const year = url.searchParams.get("year");
    const page = url.searchParams.get("page");
    if (!page || !year)
      return NextResponse.json(
        {
          error: "parameters year, page not specified for GET request ",
        },
        {
          status: 403,
        }
      );

    const response = await axios.get(
      `${process.env.BASE_URL_API}discover/movie?primary_release_year=${year}&api_key=${process.env.API_KEY}&language=fr&page=${page}`
    );

    if (response.status === 200) {
      return NextResponse.json(response.data.results, {
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
