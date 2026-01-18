export type AppPushNotificationT = {
  /** Display */
  title: string;
  body: string;

  /** App routing & logic */
  data?: {
    type: "billing" | "profile" | "notifications" | "draw" | "home";
    entityId: string;
    screen?: string;

    /**
     * Optional image reference for client-side usage
     * (NOT rendered by iOS notifications via Expo Push)
     */
    imageUrl?: string;

    /** Extensible payload */
    metadata?: Record<string, string | number | boolean>;
  };

  /** Delivery control */
  ttl?: number; // seconds
  priority?: "default" | "high";
  expiration?: number;

  /** UX */
  sound?: "default" | null;
  badge?: number;
  subtitle?: string;

  /** Platform-specific (Expo-supported) */
  channelId?: string; // Android
  categoryId?: string; // iOS (actions only)

  /**
   * Android-only rich notification image
   * ✔ Supported by Expo Push
   * ✖ Ignored on iOS
   */
  image?: string;
};
