import { NextRequest } from "next/server";
import { UnauthorizedError } from "../errors/unAuthError";
import { verifyToken } from "@clerk/backend";
import { clerk } from "@/src/lib/clerk";
import { getUniqueUser } from "@/src/services/user/getUserByClerkId";
import { createUser } from "@/src/services/user/createUser";
import { logger } from "../logger";
import { revokedUserSessions } from "@/src/services/user/revokedUserSessions";

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
      logger.error(err.message, err);
      throw new UnauthorizedError("Unauthorized");
    }
    throw err;
  }

  if (!claims.sub) {
    logger.error("Claims not found", claims);
    throw new UnauthorizedError("Unauthorized");
  }

  // Try to find user in your backend
  const user = await getUniqueUser({ where: { clerkId: claims.sub } });

  if (!user) {
    // When user is not found, create a new user
    logger.info("User not found, creating a new user", {
      sub: claims.sub,
    });

    const user = await createUser({ id: claims.sub });

    if (user) {
      logger.info("User created", { id: user.id });
      return user;
    }
    // Just in case if user is not found after creation revoke the session
    if (claims.sid) {
      logger.info("Revoke session", { sid: claims.sid });
      try {
        await revokedUserSessions({ id: claims.sub });
      } catch (error) {
        throw error;
      }
    }

    throw new UnauthorizedError("Unauthorized");
  }

  return user;
}
