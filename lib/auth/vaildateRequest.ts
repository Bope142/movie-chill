import { NextRequest } from "next/server";
import { getSession } from "next-auth/react";
import { Session, getServerSession } from "next-auth";
import { NextApiRequest } from "next";

export const validateRequestApi = async (
  req: NextRequest
): Promise<{ user: any; session: Session } | { user: null; session: null }> => {
  const session = await getServerSession(req);
  if (!session) {
    return { user: null, session: null };
  }

  return { user: session.user, session };
};
