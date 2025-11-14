import { NextRequest } from "next/server";
import z from "zod";
import { verifyRazorPaySignature } from "@/src/utils/razorpay/verifyRazorpay";
import { requireAuth } from "@/src/utils/middleware/requiredAuth";
import { ErrorResponse, SuccessResponse } from "@/src/utils/next-response";
import { getUniquePurchase } from "@/src/services/purchase/getUniquePurchase";

const schema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    if (!user) return ErrorResponse({ error: "Unauthorized", status: 401 });

    const body = schema.parse(await req.json());

    const isVerified = verifyRazorPaySignature({
      orderId: body.razorpay_order_id,
      paymentId: body.razorpay_payment_id,
      razorpaySignature: body.razorpay_signature,
    });

    const purchase = await getUniquePurchase({
      where: { razorpayId: body.razorpay_order_id },
    });

    const data = { id: purchase?.id };

    if (!isVerified) {
      return SuccessResponse({
        status: 400,
        message: "Signature verification failed",
        data: data,
      });
    }

    return SuccessResponse({
      status: 200,
      message: "Signature verified successfully",
      data: data,
    });
  } catch (error) {
    return ErrorResponse({ status: 500, error: "Verification failure" });
  }
}
