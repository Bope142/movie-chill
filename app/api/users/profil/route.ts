import { PrismaClient } from "@prisma/client";
import { validateRequestApi } from "@/lib/auth/vaildateRequest";
import {
  addFavoriteGenreMovieUser,
  getFavoritesGenreMovieUser,
  getUser,
  updatePictureUser,
} from "@/lib/db/user";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const { user } = await validateRequestApi(req);
    if (user === null)
      return NextResponse.json(
        {
          message: "User is not authenticated",
        },
        {
          status: 401,
        }
      );

    const { email } = user;
    const userAccount = await getUser(email);
    if (!userAccount)
      return NextResponse.json(
        { message: "User not found" },
        {
          status: 200,
        }
      );

    const prisma = new PrismaClient();
    const categories = await prisma.movie_categories.findMany({});
    if (!categories)
      return NextResponse.json(
        {
          error: "Failed to fetch data from the API",
        },
        {
          status: 200,
        }
      );

    const favoriteMovie = await getFavoritesGenreMovieUser(userAccount.user_id);

    // Mapping categories to add isFavorite flag
    const categoriesWithFavoriteFlag = categories.map((category) => {
      const isFavorite = favoriteMovie.some(
        (favorite) => favorite.category_id === category.category_id
      );
      return { ...category, isFavorite };
    });
    console.log(new Date().getTime());
    return NextResponse.json(
      { categories: categoriesWithFavoriteFlag },
      {
        status: 200,
      }
    );
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

export const POST = async (req: NextRequest) => {
  try {
    const { user } = await validateRequestApi(req);
    if (user === null)
      return NextResponse.json(
        {
          message: "User is not authenticated",
        },
        {
          status: 401,
        }
      );

    const { categoriesMovie } = await req.json();
    console.log(categoriesMovie);
    if (!categoriesMovie)
      return NextResponse.json(
        { message: " categoriesMovie is required" },
        {
          status: 403,
        }
      );

    const { email } = user;
    const userAccount = await getUser(email);
    if (!userAccount)
      return NextResponse.json(
        { message: "User not found" },
        {
          status: 200,
        }
      );
    const newFavoriteGenreMovie = await addFavoriteGenreMovieUser(
      userAccount.user_id,
      categoriesMovie
    );

    return NextResponse.json(
      { message: "profil updated with success", newFavoriteGenreMovie },
      {
        status: 200,
      }
    );
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

export const PUT = async (req: NextRequest) => {
  try {
    const { user } = await validateRequestApi(req);
    if (user === null)
      return NextResponse.json(
        {
          message: "User is not authenticated",
        },
        {
          status: 401,
        }
      );

    const { urlProfil } = await req.json();
    console.log(urlProfil);
    if (!urlProfil)
      return NextResponse.json(
        { message: " urlProfil is required" },
        {
          status: 403,
        }
      );

    const { email } = user;
    const userAccount = await getUser(email);
    if (!userAccount)
      return NextResponse.json(
        { message: "User not found" },
        {
          status: 200,
        }
      );
    const newProfilUser = await updatePictureUser(
      userAccount.user_id,
      email,
      urlProfil
    );

    return NextResponse.json(
      { message: "profil updated with success", newProfilUser },
      {
        status: 200,
      }
    );
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
