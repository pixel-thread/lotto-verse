import { expo, isExpoPushToken } from "@/src/lib/expo";
import { logger } from "../logger";
import { AppPushNotificationT } from "@/src/types/notifications";

type Props = {
  tokens: string[];
  payload?: Partial<AppPushNotificationT>; // Optional payload
};

// ✅ BETTER DEFAULTS (reliable across platforms)
const defaultPayload: AppPushNotificationT = {
  title: "🔔 Lotto Verse Alert",
  subtitle: "New Notification",
  body: "New notification received",
  data: {
    type: "home",
    entityId: "",
    imageUrl: "https://lotto-verse.vercel.app/assets/images/og.webp", // Android
    screen: "Draw",
  },
  ttl: 3600,
  priority: "high" as const,
  expiration: 0,
  sound: "default",
  badge: 1,
  channelId: "default", // Android
  categoryId: "default",
  image: "https://lotto-verse.vercel.app/assets/images/og.webp", // Android
};

export async function sendPushNotifications({ tokens, payload }: Props) {
  const messages = tokens.filter(isExpoPushToken).map((token) => {
    const message: any = {
      to: token,

      // Basic
      title: payload?.title || defaultPayload.title,
      body: payload?.body || defaultPayload.body,
      subtitle: payload?.subtitle || defaultPayload.subtitle,
      data: payload?.data || defaultPayload.data,
      sound: payload?.sound || defaultPayload.sound,
      priority: payload?.priority || defaultPayload.priority,
      channelId: payload?.channelId || defaultPayload.channelId,

      // ✅ IMAGE (THIS WAS MISSING)
      image: payload?.image || defaultPayload.image, // Android
    };

    return message;
  });

  const chunks = expo.chunkPushNotifications(messages);
  const tickets: any[] = [];

  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
      logger.info("Push sent successfully", { chunkCount: chunk.length });
    } catch (error) {
      logger.error("expo send error", error);
    }
  }

  return { tickets };
}
