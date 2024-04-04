import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = async ({ params }: { params: Record<string, string> }) => {
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
    const prisma = new PrismaClient();
    const oneCategorie = await prisma.movie_categories.findUnique({
      where: {
        category_id: parseInt(id),
      },
    });

    if (oneCategorie !== null) {
      return NextResponse.json(oneCategorie, {
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
