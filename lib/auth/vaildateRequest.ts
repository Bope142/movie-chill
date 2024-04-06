import { NextRequest } from "next/server";
import { Session, getServerSession } from "next-auth";

export const validateRequestApi = async (
  req: NextRequest
): Promise<{ user: any; session: Session } | { user: null; session: null }> => {
  const session = await getServerSession();
  if (!session) {
    return { user: null, session: null };
  }

  return { user: session.user, session };
};
