import { sendPushNotifications } from "@/src/lib/expo";
import { createPushTicket } from "@/src/services/push/createPushTicket";
import { getDevices } from "@/src/services/push/getDevices";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { SuccessResponse } from "@/src/utils/next-response";
import { sendPushSchema } from "@/src/utils/validation/push";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = sendPushSchema.parse(await req.json());
    const { userId, message, title } = body;

    // Fetch all devices or specific user devices
    const devices = userId
      ? await getDevices({ where: { userId } })
      : await getDevices();

    const tokens = devices.map((d) => d.token);

    // Send notifications through Expo
    const tickets = await sendPushNotifications(tokens, {
      title,
      body: message,
    });

    // Store each ticket individually
    for (let i = 0; i < tickets.length; i++) {
      const ticket = tickets[i];
      await createPushTicket({
        data: {
          ticketId: ticket.id,
          userId: userId,
          pushToken: tokens[i],
          payload: ticket.data,
          status: ticket.status,
          errorCode: ticket.errorCode,
          errorMessage: ticket.errorMessage,
          processedAt: ticket.processedAt,
        },
      });
    }

    return SuccessResponse({
      data: tickets,
      message: "Successfully sent push notifications",
    });
  } catch (err) {
    return handleApiErrors(err);
  }
}
