import { UnauthorizedError } from "@/src/utils/errors/unAuthError";
import { requireAuth } from "./requiredAuth";
import { NextRequest } from "next/server";

export async function requireSuperAdmin(req: NextRequest) {
  const user = await requireAuth(req);
  if (!user) {
    throw new UnauthorizedError("Unauthorized");
  }

  if (user.role !== "SUPER_ADMIN") {
    throw new UnauthorizedError("Permission Denied");
  }

  return user;
}
