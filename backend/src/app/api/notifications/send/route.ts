import { prisma } from "@/src/lib/db/prisma";
import { AppPushNotificationT } from "@/src/types/notifications";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { ErrorResponse, SuccessResponse } from "@/src/utils/next-response";
import { sendPushNotifications } from "@/src/utils/notification/sendPushNotifications";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const userId = "51927df5-391f-4cf0-bf23-4e3e805b1c7a";
  const message = "This is a test notification";
  const title = "Test Notification";

  if (!message) return ErrorResponse({ error: "message required" });

  try {
    const devices = userId
      ? await prisma.notificationToken.findMany({ where: { userId } })
      : await prisma.notificationToken.findMany();

    const tokens = devices.map((d) => d.token);

    const payload: AppPushNotificationT = {
      title,
      subtitle: "Test Notification",
      body: message,
    };

    const result = await sendPushNotifications({
      tokens: tokens,
      payload,
    });

    return SuccessResponse({
      data: result,
    });
  } catch (err) {
    return handleApiErrors(err);
  }
}
