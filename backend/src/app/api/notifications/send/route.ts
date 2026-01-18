import { prisma } from "@/src/lib/db/prisma";
import { AppPushNotificationT } from "@/src/types/notifications";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { SuccessResponse } from "@/src/utils/next-response";
import { sendPushNotifications } from "@/src/utils/notification/sendPushNotifications";
import type { NextApiRequest, NextApiResponse } from "next";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const userId = "51927df5-391f-4cf0-bf23-4e3e805b1c7a";
  const message = "This is a test notification";
  const title = "Test Notification";

  if (!message) return res.status(400).json({ error: "message required" });

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
