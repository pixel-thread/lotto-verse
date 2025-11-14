import { env } from "@/src/env";
import { updatePurchase } from "@/src/services/purchase/updatePurchase";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { logger } from "@/src/utils/logger";

export const config = {
  api: {
    bodyParser: false, // IMPORTANT for raw body
  },
};

export async function POST(req: Request) {
  try {
    console.log("Webhook triggered");

    // 1. Read raw body as text
    const rawBody = await req.text();

    // 2. Validate signature
    const signature = req.headers.get("x-razorpay-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const expected = crypto
      .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");

    if (
      !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
    ) {
      console.log("Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // 3. Parse event JSON
    const event = JSON.parse(rawBody);

    console.log("Event:", event.event);

    // 4. Handle webhook types
    switch (event.event) {
      case "payment.captured":
        console.log("payment.captured");
        await updatePurchase({
          where: { razorpayId: event.payload.payment.entity.id },
          data: { status: "SUCCESS" },
        });
        break;

      case "payment.failed":
        console.log("payment.failed");
        await updatePurchase({
          where: { razorpayId: event.payload.payment.entity.id },
          data: { status: "FAILED" },
        });
        break;

      default:
        console.log("Unhandled event");
        break;
    }

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    logger.error({ webhookError: error });
    return handleApiErrors(error);
  }
}
