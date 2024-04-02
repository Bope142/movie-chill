import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { validateRequestApi } from "@/lib/auth/vaildateRequest";
import { getUser, onboardingProfil, updateProfilUser } from "@/lib/db/user";
import { NextRequest, NextResponse } from "next/server";

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

    const { urlProfil, categoriesMovie } = await req.json();
    console.log(urlProfil, categoriesMovie);
    if (!urlProfil || !categoriesMovie)
      return NextResponse.json(
        { message: " urlProfil and categoriesMovie is required" },
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
    const newInfos = await onboardingProfil(
      userAccount.user_id,
      email,
      urlProfil,
      categoriesMovie
    );

    return NextResponse.json(
      { message: "profil updated with success" },
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
