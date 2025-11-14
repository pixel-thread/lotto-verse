import { getUniqueDraw } from "@/src/services/draw/getUniqueDraw";
import { getUniqueLuckyNumber } from "@/src/services/lucky-number/getUniqueLuckyNumber";
import { createPurchaseAtomic } from "@/src/services/purchase/createPurchase";
import { getPurchaseByLuckyNumber } from "@/src/services/purchase/getPurchaseByLuckyNumber";
import { getUserPurchase } from "@/src/services/user/getUserPurchase";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { logger } from "@/src/utils/logger";
import { requireAuth } from "@/src/utils/middleware/requiredAuth";
import { ErrorResponse, SuccessResponse } from "@/src/utils/next-response";
import { createRazorPayOrder } from "@/src/utils/razorpay/createOrder";
import { razorPayOptions } from "@/src/utils/razorpay/razorpayOption";
import { createPaymentSchema } from "@/src/utils/validation/payment";
import { NextRequest } from "next/server";

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
      return ErrorResponse({ error: "Lucky Numeber not found", status: 404 });
    }

    const isDrawExist = await getUniqueDraw({
      where: { id: isLuckyNumberExist.drawId },
    });

    if (!isDrawExist) {
      return ErrorResponse({ error: "Draw not found", status: 404 });
    }

    const isPaymentClose =
      isDrawExist?.isWinnerDecleared || !isDrawExist.isActive;

    if (isPaymentClose) {
      return ErrorResponse({ error: "Draw is closed", status: 400 });
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
    });

    return SuccessResponse({
      data,
      message: "Payment created successfully",
      status: 201,
    });
  } catch (error) {
    logger.log(error);
    return handleApiErrors(error);
  }
}
