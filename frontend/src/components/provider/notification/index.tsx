import { NotificationService } from '@/src/services/notifications';
import React, { useRef, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { logger } from '@/src/utils/logger';
import { useAuth } from '@/src/hooks/auth/useAuth';

type NotificationProviderProps = {
  children: React.ReactNode;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const ExpoNotificationProvider = ({ children }: NotificationProviderProps) => {
  const { user } = useAuth();
  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  useEffect(() => {
    (async () => {
      const token = await NotificationService.getDeviceToken();

      if (token) {
        // Send token to your backend. Replace userId with your auth user id.
        NotificationService.registerDeviceToken(token, user?.id);
      }
    })();

    // Listener for incoming notifications when app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      logger.log('received notification', notification);
    });

    // Listener for when a user interacts with a notification (taps it)
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      logger.log('notification response', response);
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return <>{children}</>;
};
