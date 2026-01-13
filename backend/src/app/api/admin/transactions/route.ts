import { clerk } from "@/src/lib/clerk";
import { getActiveDraw } from "@/src/services/draw/getActiveDraw";
import { getUniqueDraw } from "@/src/services/draw/getUniqueDraw";
import { getPurchase } from "@/src/services/purchase/getPurchase";
import { getTransactions } from "@/src/services/transaction/getTransactions";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { requireAdmin } from "@/src/utils/middleware/requireAdmin";
import { SuccessResponse } from "@/src/utils/next-response";
import { NextRequest } from "next/server";
import z from "zod";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const activeDraw = await getActiveDraw();

    const allPurchases = await getPurchase({
      where: { drawId: activeDraw?.id },
    });

    if (!allPurchases) {
      return SuccessResponse({
        message: "No purchases found",
        data: [],
      });
    }

    const transactions = await getTransactions({
      where: {
        purchaseId: {
          in: allPurchases.map((purchase) => purchase.id),
        },
      },
    });

    const data = await Promise.all(
      transactions.map(async (transaction) => {
        const clerkUser = await clerk.users.getUser(transaction.user.clerkId);
        return {
          id: transaction.id,
          transactionId: `TSX-${transaction.id}`,
          amount: transaction.amount,
          status: transaction.status,
          paymentMethod: transaction.paymentMethod,
          createdAt: transaction.createdAt,
          userId: transaction.userId,
          name: clerkUser.username || clerkUser.firstName,
          imageUrl: clerkUser.imageUrl,
        };
      }),
    );

    return SuccessResponse({
      data: data,
      message: "Success fetching transactions",
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}

const schema = z.object({ drawId: z.string() });

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    const body = schema.parse(await req.json());
    const draw = await getUniqueDraw({ where: { id: body.drawId } });

    const allPurchases = await getPurchase({
      where: { drawId: draw?.id },
    });

    if (!allPurchases) {
      return SuccessResponse({
        message: "No purchases found",
        data: [],
      });
    }

    const transactions = await getTransactions({
      where: {
        purchaseId: { in: allPurchases.map((purchase) => purchase.id) },
      },
    });

    const data = await Promise.all(
      transactions.map(async (transaction) => {
        const clerkUser = await clerk.users.getUser(transaction.user.clerkId);
        return {
          id: transaction.id,
          transactionId: transaction.id,
          amount: transaction.amount,
          status: transaction.status,
          paymentMethod: transaction.paymentMethod,
          createdAt: transaction.createdAt,
          userId: transaction.userId,
          name: clerkUser.username || clerkUser.firstName,
          imageUrl: clerkUser.imageUrl,
        };
      }),
    );

    return SuccessResponse({
      data: data,
      message: "Success fetching transactions",
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
