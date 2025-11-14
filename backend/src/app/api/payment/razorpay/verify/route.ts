import { getUniqueDraw } from "@/src/services/draw/getUniqueDraw";
import { getUniqueLuckyNumber } from "@/src/services/lucky-number/getUniqueLuckyNumber";
import { updateLuckyNumber } from "@/src/services/lucky-number/updateLuckyNumber";
import { getPurchaseByLuckyNumber } from "@/src/services/purchase/getPurchaseByLuckyNumber";
import { getUniquePurchase } from "@/src/services/purchase/getUniquePurchase";
import { updatePurchase } from "@/src/services/purchase/updatePurchase";
import { createTransaction } from "@/src/services/transaction/createTransaction";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { requireAuth } from "@/src/utils/middleware/requiredAuth";
import { ErrorResponse, SuccessResponse } from "@/src/utils/next-response";
import { verifyRazorPaySignature } from "@/src/utils/razorpay/verifyRazorpay";
import { NextRequest } from "next/server";
import z from "zod";

const schema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  luckyNumberId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    const body = schema.parse(await req.json());

    if (!user) return ErrorResponse({ error: "User not found", status: 404 });

    const luckyNumber = await getUniqueLuckyNumber({
      where: { id: body.luckyNumberId },
    });

    if (!luckyNumber)
      return ErrorResponse({ error: "Lucky number not found", status: 404 });

    const isDrawExist = await getUniqueDraw({
      where: { id: luckyNumber.drawId },
    });

    if (!isDrawExist) {
      return ErrorResponse({ error: "Draw not found", status: 404 });
    }

    const isLuckyNumberAlreadyPurchase = await getPurchaseByLuckyNumber({
      where: {
        luckyNumberId: body.luckyNumberId,
        drawId: isDrawExist.id,
        status: "SUCCESS",
      },
    });

    if (isLuckyNumberAlreadyPurchase.some((val) => val.status === "SUCCESS")) {
      return ErrorResponse({ error: "Lucky number already paid", status: 400 });
    }

    // 4. Verify Razorpay signature
    const isVerified = verifyRazorPaySignature({
      orderId: body.razorpay_order_id,
      paymentId: body.razorpay_payment_id,
      razorpaySignature: body.razorpay_signature,
    });

    // 5. FAILURE:
    if (!isVerified) {
      await updatePurchase({
        where: { razorpayId: body.razorpay_order_id },
        data: { status: "FAILED" },
      });

      return ErrorResponse({
        message: "Payment verification failed",
        status: 400,
        error: isVerified,
      });
    }
    const successPurchase = await getUniquePurchase({
      where: { razorpayId: body.razorpay_order_id },
    });

    await updatePurchase({
      where: { razorpayId: body.razorpay_order_id },
      data: { razorpayPaymentId: body.razorpay_payment_id },
    });

    // await updateLuckyNumber({
    //   where: { id: luckyNumber.id },
    //   data: { isPurchased: true },
    // });

    // await createTransaction({
    //   data: {
    //     user: { connect: { id: user.id } },
    //     purchase: { connect: { id: orderUpdate.id } }, // Link transaction to purchase
    //     amount: orderUpdate.amount,
    //     status: "SUCCESS",
    //     paymentMethod: "RAZORPAY",
    //   },
    // });

    // 7. Return success
    return SuccessResponse({
      status: 200,
      message: "Payment verified successfully",
      data: successPurchase,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
