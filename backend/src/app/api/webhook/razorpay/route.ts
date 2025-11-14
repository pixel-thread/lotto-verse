import { env } from "@/src/env";
import { updatePurchase } from "@/src/services/purchase/updatePurchase";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import crypto from "crypto";
import { NextResponse } from "next/server";
import getRawBody from "raw-body";
import { logger } from "@/src/utils/logger";

export async function POST(req: Request) {
  try {
    // Get raw request body for signature verification
    // @ts-ignore
    const rawBody = await getRawBody(req);

    // Read signature from headers
    const signature = req.headers.get("x-razorpay-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Compute expected signature HMAC SHA256
    const secret = env.RAZORPAY_WEBHOOK_SECRET;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      // @ts-ignore
      .update(rawBody)
      .digest("hex");

    // Compare signatures securely
    if (
      !crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature),
      )
    ) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Parse JSON event from raw body
    const event = JSON.parse(rawBody.toString());

    // Handle event types
    switch (event.event) {
      case "payment.captured":
        // Update purchase status to SUCCESS
        await updatePurchase({
          where: { razorpayId: event.payload.payment.entity.id },
          data: { status: "SUCCESS" },
        });
        break;

      case "payment.failed":
        // Update purchase status to FAILED
        await updatePurchase({
          where: { razorpayId: event.payload.payment.entity.id },
          data: { status: "FAILED" },
        });
        break;

      default:
        // For other events you can decide default action or ignore
        await updatePurchase({
          where: { razorpayId: event.payload.payment.entity.id },
          data: { status: "FAILED" },
        });
    }

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    logger.error({ "Error processing Razorpay webhook:": error });
    return handleApiErrors(error);
  }
}
