import { validateRequestApi } from "@/lib/auth/vaildateRequest";
import db from "@/lib/db/db";
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

    const categories = await db.movie_categories.findMany({});
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

    const categoriesWithFavoriteFlag = categories.map((category) => {
      const isFavorite = favoriteMovie.some(
        (favorite) => favorite.category_id === category.category_id
      );
      return { ...category, isFavorite };
    });
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
