import { getAllOrUserNotification } from "@/src/services/notification/getAllOrUserNotification";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { requireAuth } from "@/src/utils/middleware/requiredAuth";
import { SuccessResponse } from "@/src/utils/next-response";
import { NextRequest } from "next/server";

const dummyNotifications = [
  {
    id: "1",
    title: "Winner Declared!",
    message: "The November Draw winner has been announced. Check it out!",
    type: "DRAW",
    date: "2025-11-12T14:00:00Z",
    isRead: false,
  },
  {
    id: "2",
    title: "New Reward Added 🎁",
    message: "You’ve earned a 10% discount for your next draw entry.",
    type: "REWARD",
    date: "2025-11-10T09:30:00Z",
    isRead: true,
  },
  {
    id: "3",
    title: "System Update",
    message: "We’ve improved our lucky draw process for faster results.",
    type: "IMPORTANT",
    date: "2025-11-08T18:45:00Z",
    isRead: true,
  },
  {
    id: "4",
    title: "Draw Reminder",
    message: "Don’t forget to join this month’s draw before it closes!",
    type: "DRAW",
    date: "2025-11-05T12:00:00Z",
    isRead: false,
  },
];
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    const notifications = await getAllOrUserNotification({
      where: {
        OR: [
          {
            userId: user.id,
          },
          {
            userId: null,
          },
        ],
      },
    });

    return SuccessResponse({
      message: "Successfully fetched notifications",
      data: notifications,
      status: 200,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
