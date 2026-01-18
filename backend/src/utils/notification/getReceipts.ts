import { expo } from "@/src/lib/expo";
import { logger } from "../logger";

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
    logger.error("Notification receipt error", err);
    return null;
  }
}
