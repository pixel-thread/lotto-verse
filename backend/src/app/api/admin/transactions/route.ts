import { clerk } from "@/src/lib/clerk";
import { getTransactions } from "@/src/services/transaction/getTransactions";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { requireAdmin } from "@/src/utils/middleware/requireAdmin";
import { SuccessResponse } from "@/src/utils/next-response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const transactions = await getTransactions();

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
