import React, { useRef, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useLastNotificationResponse } from 'expo-notifications';
import { NotificationService } from '@/src/services/notifications';
import { logger } from '@/src/utils/logger';
import { useAuth } from '@/src/hooks/auth/useAuth';
import { handleNotificationNavigation } from '@/src/services/notifications/handleNotificationNavigation';

type NotificationProviderProps = {
  children: React.ReactNode;
};

NotificationService.initialize();

export const ExpoNotificationProvider = ({ children }: NotificationProviderProps) => {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const lastNotificationResponse = useLastNotificationResponse();

  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  // Register device token
  useEffect(() => {
    (async () => {
      const token = await NotificationService.getDeviceToken();
      // only register device token if user is signed in
      if (token && user?.id) {
        NotificationService.registerDeviceToken(token, user.id);
      }
    })();
  }, [user?.id]);

  // Foreground receive
  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      logger.log('received notification', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const rawData = response.notification.request.content.data;

      logger.log('notification tapped', rawData);

      handleNotificationNavigation(rawData, {
        isAuthenticated,
      });
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [isAuthenticated]);

  // ✅ Cold start & resumed from background (NON-DEPRECATED)
  useEffect(() => {
    if (!lastNotificationResponse) return;

    const rawData = lastNotificationResponse.notification.request.content.data;

    logger.log('last notification response', rawData);

    handleNotificationNavigation(rawData, {
      isAuthenticated,
    });
  }, [lastNotificationResponse, isAuthenticated]);

  return <>{children}</>;
};
