import { clerk } from "@/src/lib/clerk";
import { getUniqueLuckyNumber } from "@/src/services/lucky-number/getUniqueLuckyNumber";
import { getUniqueTransaction } from "@/src/services/transaction/getUniqueTransaction";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { requireSuperAdmin } from "@/src/utils/middleware/requireSuperAdmin";
import { ErrorResponse, SuccessResponse } from "@/src/utils/next-response";
import { NextRequest } from "next/server";

// const mockTransactionDetail = {
//   id: "tx_1001",
//   amount: 250,
//   status: "SUCCESS",
//   paymentMethod: "razorpay",
//   createdAt: "2025-01-10T14:20:00.000Z",
//   updatedAt: "2025-01-10T14:25:00.000Z",
//   name: "John Carter",
//   userId: "user_001",
//   imageUrl: "https://i.pravatar.cc/300?img=12",
//   purchaseId: "purchase_5001",
//   number: 42,
//   drawId: "draw_2023_07",
//   month: "2023-07",
//   entryFee: 250,
// };

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireSuperAdmin(req);
    const id = (await params).id;
    const transaction = await getUniqueTransaction({ where: { id: id } });
    if (!transaction) {
      return ErrorResponse({
        status: 400,
        message: "Transaction not found",
      });
    }
    const user = await clerk.users.getUser(transaction.user.clerkId);

    const luckNumber = await getUniqueLuckyNumber({
      where: {
        id: transaction?.purchase?.luckyNumberId,
      },
    });

    const data = {
      id: transaction.id,
      transactionId: `TSX-${transaction.id}`,
      amount: transaction.amount,
      status: transaction.status,
      paymentMethod: transaction.paymentMethod,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      name: user.username || user.firstName,
      userId: transaction.userId,
      imageUrl: user.imageUrl,
      purchaseId: transaction.purchaseId,
      number: luckNumber?.number || null,
      drawId: transaction.purchase?.drawId,
      month: transaction.purchase?.draw?.month,
      entryFee: transaction?.purchase?.draw?.entryFee,
    };

    return SuccessResponse({
      data: data,
      message: "Success fetching transaction",
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
