import { validateRequestApi } from "@/lib/auth/vaildateRequest";
import {
  addMovieAsFavorite,
  getFavoritesMovieUser,
  getUser,
  removeMovieFromFavorites,
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
    const url = new URL(req.url);
    const max = url.searchParams.get("max");
    const skip = url.searchParams.get("skip");
    if (max === undefined || skip === undefined)
      return NextResponse.json(
        { message: " max and skip are required" },
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
    const favoriteMovies = await getFavoritesMovieUser(
      userAccount.user_id,
      parseInt(skip!),
      parseInt(max!)
    );

    return NextResponse.json(
      { message: "profil updated with success", favoriteMovies },
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

    const data = await req.json();
    console.log(data);
    if (!data)
      return NextResponse.json(
        { message: " data is required" },
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
    data.user_id = userAccount.user_id;
    const newFavorite = await addMovieAsFavorite(data);

    return NextResponse.json(
      { message: "movie added to favorite list", newFavorite },
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

export const DELETE = async (req: NextRequest) => {
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
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (id === undefined)
      return NextResponse.json(
        { message: " movie id  is required" },
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
    const deletedMovies = await removeMovieFromFavorites(
      parseInt(id!),
      userAccount.user_id
    );

    return NextResponse.json(
      { message: "movie deleted with success", deletedMovies },
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
