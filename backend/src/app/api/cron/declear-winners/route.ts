import { pickAndDeclareRandomWinner } from "@/src/services/draw/declearDrawWinner";
import { getActiveDraw } from "@/src/services/draw/getActiveDraw";
import { getDrawWinner } from "@/src/services/draw/getDrawWinner";
import { getNotificationTokens } from "@/src/services/notification/getNotificationToken";
import { getDrawPurchase } from "@/src/services/purchase/getDrawPurchase";
import { AppPushNotificationT } from "@/src/types/notifications";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { logger } from "@/src/utils/logger";
import { ErrorResponse, SuccessResponse } from "@/src/utils/next-response";
import { sendPushNotifications } from "@/src/utils/notification/sendPushNotifications";
import { NextRequest } from "next/server";

export const isWinnerDeclarationOpen = (declareAt: Date): boolean => {
  const now = new Date();

  // Same date check in IST
  const nowISTDate = now.toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });
  const declareDateIST = declareAt.toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

  return nowISTDate === declareDateIST;
};

export async function GET(req: NextRequest) {
  try {
    logger.info("Received cron request", {
      Step: 1,
    });
    const authHeader = req.headers.get("authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      logger.error("Unauthorized cron request", { authHeader });
      return ErrorResponse({
        message: "Unauthorized cron request",
        status: 401,
      });
    }

    logger.info("Authorized cron request", {
      Step: 2,
    });

    const activeDraw = await getActiveDraw();

    if (!activeDraw) {
      return new Response("No active draw", {
        status: 400,
      });
    }

    logger.info("Active draw found", {
      step: 3,
    });

    if (!activeDraw.declareAt) {
      logger.error("Draw declaration time not set");
      return ErrorResponse({
        status: 400,
        message: "Draw declaration time not set",
      });
    }

    if (!isWinnerDeclarationOpen(activeDraw.declareAt)) {
      logger.info("Draw declaration time not reached (IST)");
      return ErrorResponse({
        status: 400,
        message: "Draw declaration time not reached (IST)",
      });
    }

    logger.info("Draw declaration time reached", {
      step: 4,
    });

    const isSomePurchaseExist = await getDrawPurchase({
      where: { drawId: activeDraw.id },
    });

    if (!isSomePurchaseExist) {
      logger.info("No purchases found for this draw");
      return ErrorResponse({
        status: 400,
        message: "No purchases found for this draw",
      });
    }

    if (activeDraw.status === "DELETED") {
      logger.info("Draw is deleted");
      return ErrorResponse({
        status: 400,
        message: "Draw is deleted",
      });
    }

    if (activeDraw.status === "INACTIVE") {
      logger.info("Draw is inactive");
      return ErrorResponse({
        status: 400,
        message: "Draw is inactive",
      });
    }
    logger.info("Getting Draw Winner", {
      step: 5,
    });

    const isWinnerExist = await getDrawWinner({ id: activeDraw.id });

    if (isWinnerExist) {
      logger.info("Winner is already Declared");
      return ErrorResponse({
        status: 400,
        message: "Winner is already Declared",
      });
    }

    logger.info("Declaring Winner", {
      step: 6,
    });

    await pickAndDeclareRandomWinner({ drawId: activeDraw.id });

    const userTokens = await getNotificationTokens();

    const tokens = userTokens.map((token) => token.token);

    const payload: AppPushNotificationT = {
      title: "Winner Declared",
      body: `${activeDraw.month}. Checkout the winner of today's draw`,
      subtitle: "Winner Declared",
      data: {
        type: "draw",
        entityId: activeDraw.id,
        screen: "draw",
      },
    };

    await sendPushNotifications({
      tokens,
      payload,
    });

    logger.info("Winner Declared", {
      step: 7,
    });

    return SuccessResponse({
      message: "Successfully Decleared winner",
      status: 200,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
