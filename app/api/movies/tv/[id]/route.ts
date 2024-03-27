import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Record<string, string> }
) => {
  try {
    const { id } = params;
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
      `${process.env.BASE_URL_API}tv/${id}?&api_key=${process.env.API_KEY}&language=fr`
    );

    if (response.status === 200) {
      const getSimilarMovie = await axios.get(
        `${process.env.BASE_URL_API}tv/${id}/similar?api_key=${process.env.API_KEY}&language=fr&page=1`
      );
      if (getSimilarMovie.status === 200) {
        return NextResponse.json(
          {
            movie: response.data,
            similar: getSimilarMovie.data.results,
          },
          {
            status: 200,
          }
        );
      } else {
        return NextResponse.json(
          {
            movie: response.data,
            similar: [],
          },
          {
            status: 200,
          }
        );
      }
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
