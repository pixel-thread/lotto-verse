import crypto from "crypto";

type Props = {
  orderId: string;
  paymentId: string;
  razorpaySignature: string;
};
export function verifyRazorPaySignature({
  orderId,
  paymentId,
  razorpaySignature,
}: Props) {
  const body = orderId + "|" + paymentId;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body.toString())
    .digest("hex");

  return expectedSignature === razorpaySignature;
}
