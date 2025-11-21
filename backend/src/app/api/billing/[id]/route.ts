import { clerk } from "@/src/lib/clerk";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";
import { getUniqueDraw } from "@/src/services/draw/getUniqueDraw";
import { getUniqueLuckyNumber } from "@/src/services/lucky-number/getUniqueLuckyNumber";
import { getUniquePurchase } from "@/src/services/purchase/getUniquePurchase";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { requireAuth } from "@/src/utils/middleware/requiredAuth";
import { MOCK_BILLING_DETAIL } from "@/src/utils/mocked";
import { ErrorResponse, SuccessResponse } from "@/src/utils/next-response";
import { NextRequest } from "next/server";

export type BillingDetailT = {
  // Purchase Information
  purchase: {
    id: string;
    createdAt: Date;
    userId: string;
    drawId: string;
    status: string;
    amount: number;
  };

  // Payment Information
  payment: {
    paymentId: string | null;
    razorpayId: string;
    transactionId: string | null;
    method: string;
    status: string;
    currency: string;
    amount: number;
    fee: number;
    tax: number;
    paidAt: Date;
  };

  // User Information
  user: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
  };

  // Draw Information
  draw: Prisma.DrawGetPayload<{ include: { prize: true } }> | null;

  // Lucky Numbers
  luckyNumbers:
    | Prisma.LuckyNumberGetPayload<{ include: { purchase: true } }>[]
    | null;

  // Winner Information (if applicable)
  winner?: {
    id: string;
    name: string;
    winningNumber: number;
    prizeAmount: number;
    declaredAt: Date;
  } | null;
};
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth(req);
    const id = (await params).id;
    const purchase = await getUniquePurchase({ where: { id: id } });

    if (!purchase) {
      return ErrorResponse({
        status: 400,
        message: "Billing not found",
      });
    }
    const draw = await getUniqueDraw({ where: { id: purchase.drawId } });

    const luckyNumber = await getUniqueLuckyNumber({
      where: { id: purchase.luckyNumberId },
    });

    const clerkUser = await clerk.users.getUser(user.clerkId);

    const data: BillingDetailT = {
      purchase: {
        id: purchase?.id,
        createdAt: purchase?.createdAt,
        userId: purchase?.userId,
        drawId: purchase?.drawId,
        status: purchase?.status,
        amount: purchase?.amount,
      },

      payment: {
        paymentId: purchase?.paymentId,
        razorpayId: purchase?.razorpayId,
        transactionId: purchase?.transactionId,
        method: "ONLINE",
        status: purchase.status,
        currency: "INR",
        amount: purchase.amount,
        fee: 0,
        tax: 0,
        paidAt: purchase.createdAt,
      },
      user: {
        id: user.id,
        name: clerkUser?.firstName + " " + clerkUser?.lastName,
        email:
          clerkUser?.primaryEmailAddress?.emailAddress ||
          clerkUser?.emailAddresses[0]?.emailAddress,
        phone: clerkUser?.primaryPhoneNumber?.phoneNumber || null,
      },
      draw: draw,
      luckyNumbers: luckyNumber ? [luckyNumber] : null,
      winner: null,
    };

    return SuccessResponse({
      message: "Successfully fetched draw",
      data: data,
      status: 200,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
