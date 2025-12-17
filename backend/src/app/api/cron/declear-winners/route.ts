import { pickAndDeclareRandomWinner } from "@/src/services/draw/declearDrawWinner";
import { getActiveDraw } from "@/src/services/draw/getActiveDraw";
import { getDrawWinner } from "@/src/services/draw/getDrawWinner";
import { getDrawPurchase } from "@/src/services/purchase/getDrawPurchase";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { logger } from "@/src/utils/logger";
import { ErrorResponse, SuccessResponse } from "@/src/utils/next-response";
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
    const authHeader = req.headers.get("authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      logger.info("Unauthorized cron request", { authHeader });
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    const activeDraw = await getActiveDraw();

    if (!activeDraw) {
      return new Response("No active draw", {
        status: 400,
      });
    }

    if (!activeDraw.declareAt) {
      return ErrorResponse({
        status: 400,
        message: "Draw declaration time not set",
      });
    }

    if (!isWinnerDeclarationOpen(activeDraw.declareAt)) {
      return ErrorResponse({
        status: 400,
        message: "Draw declaration time not reached (IST)",
      });
    }

    const isSomePurchaseExist = await getDrawPurchase({
      where: { drawId: activeDraw.id },
    });

    if (!isSomePurchaseExist) {
      return ErrorResponse({
        status: 400,
        message: "No purchases found for this draw",
      });
    }

    if (activeDraw.status === "DELETED") {
      return ErrorResponse({
        status: 400,
        message: "Draw is deleted",
      });
    }

    if (activeDraw.status === "INACTIVE") {
      return ErrorResponse({
        status: 400,
        message: "Draw is inactive",
      });
    }

    const isWinnerExist = await getDrawWinner({ id: activeDraw.id });

    if (isWinnerExist) {
      return ErrorResponse({
        status: 400,
        message: "Winner is already Declared",
      });
    }

    await pickAndDeclareRandomWinner({ drawId: activeDraw.id });

    return SuccessResponse({
      message: "Successfully Decleared winner",
      status: 200,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
