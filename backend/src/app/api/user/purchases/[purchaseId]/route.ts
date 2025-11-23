import { getUniquePurchase } from "@/src/services/purchase/getUniquePurchase";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { requireAuth } from "@/src/utils/middleware/requiredAuth";
import { ErrorResponse, SuccessResponse } from "@/src/utils/next-response";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ purchaseId: string }> },
) {
  try {
    const user = await requireAuth(req);

    const purchaseId = (await params).purchaseId;

    if (!user) {
      return ErrorResponse({
        status: 400,
        message: "User not found",
      });
    }

    const purchase = await getUniquePurchase({ where: { id: purchaseId } });

    if (!purchase) {
      return ErrorResponse({
        status: 404,
        message: "Purchase not found",
      });
    }
    const data = {
      id: purchase?.id,
      amount: purchase?.amount,
      purchaseAt: purchase?.createdAt,
      status: purchase?.status,
      transactionId: purchase?.transactionId,
      paymentId: purchase?.paymentId,
      orderId: purchase?.razorpayId,
      currency: "INR",
      method: "RAZORPAY",
      luckyNumbers: purchase?.luckyNumber,
      luckyNumberId: purchase?.luckyNumberId,
    };

    return SuccessResponse({
      message: "Successfully fetched User Purchases",
      data: data,
      status: 200,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
