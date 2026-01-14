import { getUniqueDraw } from "@/src/services/draw/getUniqueDraw";
import { getUniqueLuckyNumber } from "@/src/services/lucky-number/getUniqueLuckyNumber";
import { createPurchaseAtomic } from "@/src/services/purchase/createPurchase";
import { getPurchaseByLuckyNumber } from "@/src/services/purchase/getPurchaseByLuckyNumber";
import { getUserPurchase } from "@/src/services/user/getUserPurchase";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { requireAuth } from "@/src/utils/middleware/requiredAuth";
import { ErrorResponse, SuccessResponse } from "@/src/utils/next-response";
import { createRazorPayOrder } from "@/src/utils/razorpay/createOrder";
import { razorPayOptions } from "@/src/utils/razorpay/razorpayOption";
import { createPaymentSchema } from "@/src/utils/validation/payment";
import { NextRequest } from "next/server";

export const isPaymentOpen = (declareAt: Date): boolean => {
  const now = new Date();

  // 4 PM IST on declareAt date (2hrs before 6 PM IST cron)
  const cutoffIST = new Date(declareAt.getTime());
  const cutoffISTStr = cutoffIST.toLocaleString("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }); // "2025-12-17 16:00"

  const nowISTStr = now.toLocaleString("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return nowISTStr < cutoffISTStr;
};

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    const body = createPaymentSchema.parse(await req.json());

    if (!user) {
      return ErrorResponse({ error: "User not found", status: 404 });
    }

    const isLuckyNumberExist = await getUniqueLuckyNumber({
      where: { id: body.luckyNumberId },
    });

    if (!isLuckyNumberExist) {
      return ErrorResponse({ error: "Lucky Numebr not found", status: 404 });
    }

    const isDrawExist = await getUniqueDraw({
      where: { id: isLuckyNumberExist.drawId },
    });

    if (!isDrawExist) {
      return ErrorResponse({ error: "Draw not found", status: 404 });
    }

    if (!isDrawExist.declareAt) {
      return ErrorResponse({
        error: "Draw declaration time not set",
        status: 400,
      });
    }

    if (!isPaymentOpen(isDrawExist.declareAt)) {
      return ErrorResponse({
        error: "Payments closed at 4 PM IST",
        status: 400,
      });
    }

    const isPaymentClose =
      isDrawExist?.isWinnerDecleared || isDrawExist.status === "INACTIVE";

    if (isPaymentClose) {
      return ErrorResponse({
        error: "Draw is closed unable to purchase",
        status: 400,
      });
    }

    const isLuckyNumberPurchase = await getPurchaseByLuckyNumber({
      where: {
        luckyNumberId: body.luckyNumberId,
        status: "SUCCESS",
        drawId: isDrawExist.id,
      },
    });

    if (isLuckyNumberPurchase.some((val) => val.status === "SUCCESS")) {
      return ErrorResponse({
        message: "This Number already purchase by someone",
        status: 400,
      });
    }

    const hasUserPurchaseInThisDraw = await getUserPurchase({
      where: {
        userId: user.id,
        drawId: isDrawExist.id,
      },
    });

    if (hasUserPurchaseInThisDraw.some((val) => val.status === "SUCCESS")) {
      return ErrorResponse({
        message: "You have already made a purchase in this draw",
        status: 400,
      });
    }

    const price = isDrawExist.entryFee ? isDrawExist.entryFee : 100;

    if (!price) {
      return ErrorResponse({ error: "Enter price not found", status: 404 });
    }

    const order = await createRazorPayOrder({ amount: price });

    if (!order) {
      return ErrorResponse({ error: "Payment not created", status: 500 });
    }

    const createdOrder = await createPurchaseAtomic({
      data: {
        amount: price,
        razorpayId: order.id,
        luckyNumberId: isLuckyNumberExist.id,
        drawId: isLuckyNumberExist.drawId,
        userId: user.id,
      },
    });

    const data = await razorPayOptions({
      userId: user.clerkId,
      order: createdOrder,
      desc: `Pay for ${isLuckyNumberExist.number}`,
      notes: {
        drawId: isLuckyNumberExist.drawId,
        drawMonth: isDrawExist.month,
      },
    });

    return SuccessResponse({
      data,
      message: "Payment created successfully",
      status: 201,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
