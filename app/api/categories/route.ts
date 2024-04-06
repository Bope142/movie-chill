import db from "@/lib/db/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const categories = await db.movie_categories.findMany({});

    if (categories !== null) {
      return NextResponse.json(categories, {
        status: 200,
      });
    } else {
      return NextResponse.json(
        {
          error: "Failed to fetch data from the API",
        },
        {
          status: 200,
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
