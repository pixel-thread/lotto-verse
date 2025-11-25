import { clerk } from "@/src/lib/clerk";
import { getUniqueUser } from "@/src/services/user/getUserByClerkId";
import { revokedUserSessions } from "@/src/services/user/revokedUserSessions";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { logger } from "@/src/utils/logger";
import { requireSuperAdmin } from "@/src/utils/middleware/requireSuperAdmin";
import { ErrorResponse, SuccessResponse } from "@/src/utils/next-response";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireSuperAdmin(req);
    const id = (await params).id;
    const user = await getUniqueUser({ where: { id } });
    if (!user) {
      return ErrorResponse({
        status: 404,
        message: "User not found",
      });
    }

    const clerkUser = await clerk.users.getUser(user?.clerkId);

    if (!clerkUser) {
      return ErrorResponse({
        status: 404,
        message: "User not found",
      });
    }

    let locked;

    if (clerkUser.locked) {
      locked = await clerk.users.unlockUser(clerkUser.id);
    } else {
      locked = await clerk.users.lockUser(clerkUser.id);
      try {
        revokedUserSessions({ id: clerkUser.id, reason: "locked" });
      } catch (error) {
        throw error;
      }
    }

    return SuccessResponse({
      data: user,
      message: `User ${locked.locked ? "locked" : "unlocked"} successfully`,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
