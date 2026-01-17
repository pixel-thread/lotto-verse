import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { logger } from '@/src/utils/logger';
import http from '@/src/utils/http';
import { NOTIFICATIONS_ENDPOINTS } from '@/src/lib/endpoints/notifications';

export class NotificationService {
  static async getDeviceToken(): Promise<string | null> {
    // Must use physical device for push notifications
    if (!Device.isDevice) {
      logger.warn('Must use physical device for push notifications');
      return null;
    }

    // Check permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      logger.warn('Failed to get push token for push notification!');
      return null;
    }

    try {
      const tokenResponse = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId, // Add your projectId
      });
      return tokenResponse.data;
    } catch (error) {
      logger.error('Error getting push token:', error);
      return null;
    }
  }

  static async registerDeviceToken(token: string, userId?: string): Promise<void> {
    // Send token to your backend

    try {
      const payload = !!userId
        ? { token, userId, platform: Device.osName?.toUpperCase() }
        : { token, platform: Device.osName?.toUpperCase() };
      await http.post(NOTIFICATIONS_ENDPOINTS.POST_REGISTER_DEVICE_TOKEN, payload);
    } catch (error) {
      logger.error('Failed to register device token:', error);
    }
  }

  static async initialize(): Promise<void> {
    // Set notification handler
  }
}
