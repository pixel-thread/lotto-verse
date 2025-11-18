import { UnauthorizedError } from "@/src/utils/errors/unAuthError";
import { requireAuth } from "./requiredAuth";
import { NextRequest } from "next/server";
import { logger } from "../logger";

export async function requireSuperAdmin(req: NextRequest) {
  const user = await requireAuth(req);
  if (!user) {
    throw new UnauthorizedError("Unauthorized");
  }

  if (user.role !== "SUPER_ADMIN") {
    logger.error("User does not have the Required permission", {
      userId: user.id,
    });
    throw new UnauthorizedError("Permission Denied");
  }

  return user;
}
