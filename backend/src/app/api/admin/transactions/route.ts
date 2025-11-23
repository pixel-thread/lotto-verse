import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { SuccessResponse } from "@/src/utils/next-response";
import { NextRequest } from "next/server";

export const mockTransactionsList = [
  {
    id: "tx_1001",
    amount: 250,
    status: "SUCCESS",
    paymentMethod: "razorpay",
    createdAt: "2025-01-10T14:20:00.000Z",
    userId: "user_001",
    name: "John Carter",
    imageUrl: null,
  },
  {
    id: "tx_1002",
    amount: 120,
    status: "PENDING",
    paymentMethod: "razorpay",
    createdAt: "2025-01-10T13:10:00.000Z",
    imageUrl: "https://i.pravatar.cc/300?img=12",
    userId: "user_002",
    name: "Priya Sharma",
  },
  {
    id: "tx_1003",
    amount: 500,
    status: "FAILED",
    paymentMethod: "razorpay",
    createdAt: "2025-01-09T18:40:00.000Z",
    userId: "user_003",
    name: "Michael Adams",
    imageUrl: null,
  },
  {
    id: "tx_1004",
    amount: 320,
    status: "SUCCESS",
    paymentMethod: "razorpay",
    createdAt: "2025-01-08T09:00:00.000Z",
    userId: "user_004",
    name: "Aisha Khan",
    imageUrl: "https://i.pravatar.cc/300?img=47",
  },
];

export async function GET(req: NextRequest) {
  try {
    return SuccessResponse({
      data: mockTransactionsList,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
