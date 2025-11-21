import { LuckyNumbersT } from '../lucky-number';

export type PaymentStatusT = 'SUCCESS' | 'PENDING' | 'FAILED';

export type PurchaseT = {
  luckyNumber: LuckyNumbersT[];
  id: string;
  createdAt: Date;
  userId: string;
  luckyNumberId: string;
  razorpayId: string;
  paymentId: string | null;
  amount: number;
  drawId: string;
  orderId: string;
  status: PaymentStatusT;
  currency?: string;
  method?: string;
  transactionId: string;
  number: number;
};
