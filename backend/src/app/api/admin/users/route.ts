import { clerk } from "@/src/lib/clerk";
import { getUsers } from "@/src/services/user/getUsers";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { requireSuperAdmin } from "@/src/utils/middleware/requireSuperAdmin";
import { SuccessResponse } from "@/src/utils/next-response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await requireSuperAdmin(req);
    const users = await getUsers();

    const data = await Promise.all(
      users.map(async (user) => {
        const clerkUser = await clerk.users.getUser(user.clerkId);
        return {
          id: user.id,
          name: clerkUser.username || clerkUser.firstName || clerkUser.lastName,
          imageUrl: clerkUser.imageUrl,
          email: clerkUser.primaryEmailAddress?.emailAddress,
          phone: clerkUser.primaryPhoneNumber?.phoneNumber,
          clerkId: user.clerkId,
          isBanned: clerkUser.banned,
          isLocked: clerkUser.locked,
          createdAt: user.createdAt,
        };
      }),
    );

    return SuccessResponse({
      data: data,
      message: "Success fetching users",
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
