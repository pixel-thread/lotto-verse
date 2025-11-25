import { clerk } from "@/src/lib/clerk";
import { getUniqueUser } from "@/src/services/user/getUserByClerkId";
import { revokedUserSessions } from "@/src/services/user/revokedUserSessions";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
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

    let banned;

    if (clerkUser.banned) {
      banned = await clerk.users.unbanUser(clerkUser.id);
    } else {
      banned = await clerk.users.banUser(clerkUser.id);
      try {
        revokedUserSessions({ id: clerkUser.id, reason: "banned" });
      } catch (error) {
        throw error;
      }
    }

    return SuccessResponse({
      data: user,
      message: `User ${banned.banned ? "banned" : "unbanned"} successfully`,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
