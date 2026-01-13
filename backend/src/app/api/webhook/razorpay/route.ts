import { env } from "@/src/env";
import { updatePurchase } from "@/src/services/purchase/updatePurchase";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { logger } from "@/src/utils/logger";

export async function POST(req: Request) {
  try {
    logger.log("Webhook triggered", {});
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
      logger.log("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // 3. Parse event JSON
    const event = JSON.parse(rawBody);

    logger.log("Event:", event.event);

    logger.info("payment.captured", {
      paymentId: event.payload.payment.entity.id,
      status: event.payload.payment.entity.status,
    });
    // 4. Handle webhook types
    switch (event.event) {
      case "payment.captured":
        logger.info("payment.captured", {
          paymentId: event.payload.payment.entity.id,
          status: event.payload.payment.entity.status,
        });
        await updatePurchase({
          where: { razorpayId: event.payload.payment.entity.order_id },
          data: {
            status: "SUCCESS",
            paymentId: event.payload.payment.entity.id,
          },
        });
        break;

      case "payment.failed":
        console.log("payment.failed");
        await updatePurchase({
          where: { razorpayId: event.payload.payment.entity.order_id },
          data: {
            status: "FAILED",
            paymentId: event.payload.payment.entity.id,
          },
        });
        break;

      default:
        await updatePurchase({
          where: { razorpayId: event.payload.payment.entity.order_id },
          data: {
            status: "PENDING",
            paymentId: event.payload.payment.entity.id,
          },
        });
        break;
    }

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    logger.error({ webhookError: error });
    return handleApiErrors(error);
  }
}
