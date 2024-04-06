import { NextResponse, NextRequest } from "next/server";
import { validateRequestApi } from "@/lib/auth/vaildateRequest";
import { getUser, verifyEmail } from "@/lib/db/user";

export const GET = async (req: NextRequest, { params }: any) => {
  try {
    const session = await validateRequestApi(req);
    if (session.user !== null) {
      const { code } = params;
      if (code !== undefined) {
        if (typeof code !== "string" || code.length !== 8) {
          return NextResponse.json(
            {
              message:
                "Code invalide. Veuillez saisir un code de vérification à 8 caractères.",
              code: 400,
            },
            {
              status: 200,
            }
          );
        }

        const user = await getUser(session.user.email);
        if (user !== null) {
          const verifyUser = await verifyEmail(
            user.user_id,
            session.user.email,
            code
          );
          if (verifyUser.success) {
            return NextResponse.json(
              {
                message: "Votre adresse e-mail a été vérifiée avec succès !",
                code: 200,
              },
              {
                status: 200,
              }
            );
          }
          return NextResponse.json(
            { message: verifyUser.error, code: 400 },
            {
              status: 200,
            }
          );
        }
        return NextResponse.json(
          { message: "user not found" },
          {
            status: 404,
          }
        );
      }
      return NextResponse.json(
        { message: "Params missing" },
        {
          status: 403,
        }
      );
    }
    return NextResponse.json(
      { message: "Unauthorized." },
      {
        status: 403,
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
