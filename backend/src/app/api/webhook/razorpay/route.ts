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
    console.log("web hook trigger");
    // @ts-ignore
    const rawBody = await getRawBody(req);

    // Read signature from headers
    const signature = req.headers.get("x-razorpay-signature");
    console.log("1");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Compute expected signature HMAC SHA256
    const secret = env.RAZORPAY_WEBHOOK_SECRET;
    console.log("2");
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      // @ts-ignore
      .update(rawBody)
      .digest("hex");

    console.log("3");
    // Compare signatures securely
    if (
      !crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature),
      )
    ) {
      console.log("4");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Parse JSON event from raw body
    const event = JSON.parse(rawBody.toString());

    console.log("5");
    // Handle event types
    switch (event.event) {
      case "payment.captured":
        // Update purchase status to SUCCESS
        console.log("payment.captured");
        await updatePurchase({
          where: { razorpayId: event.payload.payment.entity.id },
          data: { status: "SUCCESS" },
        });
        break;

      case "payment.failed":
        // Update purchase status to FAILED
        console.log("payment.failed");
        await updatePurchase({
          where: { razorpayId: event.payload.payment.entity.id },
          data: { status: "FAILED" },
        });
        break;

      default:
        // For other events you can decide default action or ignore
        console.log("default.failed");
        await updatePurchase({
          where: { razorpayId: event.payload.payment.entity.id },
          data: { status: "FAILED" },
        });
    }

    console.log("6");
    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    logger.error({ "Error processing Razorpay webhook:": error });
    return handleApiErrors(error);
  }
}
