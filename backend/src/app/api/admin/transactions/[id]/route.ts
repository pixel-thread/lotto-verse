import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { SuccessResponse } from "@/src/utils/next-response";
import { NextRequest } from "next/server";

export const mockTransactionDetail = {
  id: "tx_1001",
  amount: 250,
  status: "SUCCESS",
  paymentMethod: "razorpay",
  createdAt: "2025-01-10T14:20:00.000Z",
  updatedAt: "2025-01-10T14:25:00.000Z",
  name: "John Carter",
  userId: "user_001",
  imageUrl: "https://i.pravatar.cc/300?img=12",
  purchaseId: "purchase_5001",
  number: 42,
  drawId: "draw_2023_07",
  month: "2023-07",
  entryFee: 250,
};
export async function GET(req: NextRequest) {
  try {
    return SuccessResponse({
      data: mockTransactionDetail,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
