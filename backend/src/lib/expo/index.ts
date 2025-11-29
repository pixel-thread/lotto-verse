import { logger } from "@/src/utils/logger";
import Expo from "expo-server-sdk";

const expo = new Expo();

export async function sendPushNotifications(
  tokens: string[],
  payload: { title?: string; body: string; data?: any },
) {
  const messages = tokens
    .filter((token) => Expo.isExpoPushToken(token))
    .map((token) => ({
      to: token,
      sound: "default",
      title: payload.title,
      body: payload.body,
      data: payload.data ?? {},
    }));

  const chunks = expo.chunkPushNotifications(messages);
  const tickets: any[] = [];

  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      logger.error("expo send error", error);
    }
  }

  return tickets;
}

export async function getReceipts(ids: string[]) {
  try {
    const receiptIdChunks = expo.chunkPushNotificationReceiptIds(ids);
    const receipts: any[] = [];
    for (const chunk of receiptIdChunks) {
      const receipt = await expo.getPushNotificationReceiptsAsync(chunk);
      receipts.push(receipt);
    }
    return receipts;
  } catch (err) {
    console.error("receipt error", err);
    return null;
  }
}
