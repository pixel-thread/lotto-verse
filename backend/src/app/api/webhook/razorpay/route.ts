// import { env } from "@/src/env";
// import { updatePurchase } from "@/src/services/purchase/updatePurchase";
// import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
// import crypto from "crypto";
// import { NextRequest, NextResponse } from "next/server";
// import getRawBody from "raw-body";

import { logger } from "@/src/utils/logger";
import { SuccessResponse } from "@/src/utils/next-response";

// export async function POST(req: Request, res: NextResponse) {
//   const secret = env.RAZORPAY_WEBHOOK_SECRET;

//   try {
//     const rawBody = await getRawBody(req);

//     const signature = req.headers["x-razorpay-signature"];

//     const expectedSignature = crypto
//       .createHmac("sha256", secret)
//       .update(rawBody)
//       .digest("hex");

//     if (signature !== expectedSignature) {
//       return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
//     }

//     const event = JSON.parse(rawBody);

//     // Handle different event types from Razorpay
//     switch (event.event) {
//       case "payment.captured":
//         // Payment success - update DB accordingly
//         await updatePurchase({
//           where: {
//             razorpayId: event.payload.payment.entity.id,
//           },
//           data: { status: "SUCCESS" },
//         });
//         // await updatePaymentStatus(event.payload.payment.entity.id, "success");
//         break;
//       case "payment.failed":
//         // Payment failed - update DB accordingly
//         // await updatePaymentStatus(event.payload.payment.entity.id, "failed");

//         await updatePurchase({
//           where: {
//             razorpayId: event.payload.payment.entity.id,
//           },
//           data: { status: "FAILED" },
//         });
//         break;
//       // Add more event cases as needed
//       default:
//         await updatePurchase({
//           where: {
//             razorpayId: event.payload.payment.entity.id,
//           },
//           data: { status: "FAILED" },
//         });
//     }

//     return NextResponse.json({ status: "ok" }, { status: 200 });
//   } catch (error) {
//     console.error("Error processing webhook:", error);
//     return handleApiErrors(error);
//   }
// }

export async function POST(req: Request) {
  console.log("webhook", req);
  return SuccessResponse({
    message: "Successfully fetched webhook",
    data: "webhook",
    status: 200,
  });
}
