import { validateRequestApi } from "@/lib/auth/vaildateRequest";
import { getUser, isMovieFavorited } from "@/lib/db/user";
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
    const isFavorite = await isMovieFavorited(
      parseInt(id),
      userAccount.user_id
    );

    return NextResponse.json(
      { isFavorite },
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
