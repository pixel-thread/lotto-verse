import { NextRequest } from "next/server";
import { UnauthorizedError } from "../errors/unAuthError";
import { verifyToken } from "@clerk/backend";
import { clerk } from "@/src/lib/clerk";
import { getUniqueUser } from "@/src/services/user/getUserByClerkId";
import { createUser } from "@/src/services/user/createUser";

export async function requireAuth(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    throw new UnauthorizedError("Unauthorized");
  }
  // Parse the Clerk session JWT and get claims
  let claims;

  try {
    claims = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
  } catch (err: any) {
    if (err.reason === "token-expired") {
      throw new UnauthorizedError("Unauthorized");
    }
    throw err;
  }

  if (!claims.sub) {
    throw new UnauthorizedError("Unauthorized");
  }

  // Try to find user in your backend
  const user = await getUniqueUser({ where: { clerkId: claims.sub } });

  if (!user) {
    // When user is not found, create a new user
    const user = await createUser({ id: claims.sub });

    if (user) {
      return user;
    }
    // Just in case if user is not found after creation revoke the session
    if (claims.sid) {
      await clerk.sessions.revokeSession(claims.sid);
    }
    throw new UnauthorizedError("Unauthorized");
  }

  return user;
}
