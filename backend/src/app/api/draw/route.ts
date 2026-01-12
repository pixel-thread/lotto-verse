import { clerk } from "@/src/lib/clerk";
import { getAllDraw } from "@/src/services/draw/getAllDraw";
import { getUniqueUser } from "@/src/services/user/getUserByClerkId";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { logger } from "@/src/utils/logger";
import { requireAuth } from "@/src/utils/middleware/requiredAuth";
import { SuccessResponse } from "@/src/utils/next-response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);

    const draws = await getAllDraw({
      where: {
        status: { not: "DELETED" },
        winner: { isNot: null },
        createdAt: { lte: new Date() },
      },
    });

    // Process data with proper Clerk user fetching
    const data = await Promise.all(
      draws.map(async (draw) => {
        const dbUserId = draw.winner?.userId;
        const dbUser = await getUniqueUser({ where: { id: dbUserId } });

        if (!dbUser?.clerkId) {
          return {
            ...draw,
            winner: {
              name: "Unknown User",
              email: null,
              imageUrl: null,
            },
          };
        }

        try {
          const clerkUser = await clerk.users.getUser(dbUser.clerkId);
          return {
            ...draw,
            winner: {
              name: clerkUser.username || clerkUser.firstName || "Anonymous",
              email: clerkUser.emailAddresses[0]?.emailAddress || null,
              imageUrl: clerkUser.imageUrl || null,
            },
          };
        } catch (clerkError) {
          logger.error(
            `Failed to fetch Clerk user ${dbUser.clerkId}:`,
            clerkError,
          );
          return {
            ...draw,
            winner: {
              name: "Unknown User",
              email: null,
              imageUrl: null,
            },
          };
        }
      }),
    );

    return SuccessResponse({
      message: "Successfully fetched all draws",
      data,
      status: 200,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
