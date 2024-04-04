import { NextResponse, NextRequest } from "next/server";
import { validateRequestApi } from "@/lib/auth/vaildateRequest";
import { getUser, resendVerificationEmail } from "@/lib/db/user";

export const GET = async (req: NextRequest) => {
  try {
    const session = await validateRequestApi(req);
    if (session.user !== null) {
      const user = await getUser(session.user.email);
      if (user !== null) {
        const sendNewVerficationCode = await resendVerificationEmail(
          user.user_id,
          session.user.email
        );
        if (sendNewVerficationCode.success) {
          return NextResponse.json(
            { message: "Verification code resent successfully.", code: 200 },
            {
              status: 200,
            }
          );
        }
        return NextResponse.json(
          { message: sendNewVerficationCode.error, code: 400 },
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
      { message: "Unauthorized." },
      {
        status: 403,
      }
    );
  } catch (error) {
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
