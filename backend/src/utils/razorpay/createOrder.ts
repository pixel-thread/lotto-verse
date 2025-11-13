import { env } from "@/src/env";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET!,
});

type CreateOrderType = {
  amount: number;
  currency?: string;
};

export async function createRazorPayOrder({
  amount,
  currency = "INR",
}: CreateOrderType) {
  const options = {
    amount: amount * 100, // in paise
    currency,
    receipt: `receipt_${Date.now()}`, // optional
  };

  const order = await razorpay.orders.create(options);

  return order;
}
