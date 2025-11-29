import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useCallback, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import http from '@/src/utils/http';
import { toast } from 'sonner-native';
import { useAuth } from '@/src/hooks/auth/useAuth';

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') return null;

    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;

    // On Android you may need to set an FCM token in app.json when building
    return token;
  } catch (err) {
    console.error('Push token error', err);
    return null;
  }
}

type DataType = {
  userId?: string;
  token: string;
  platform: string;
};

type PushProps = {
  children: React.ReactNode;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const PushProvider = ({ children }: PushProps) => {
  const { user } = useAuth();

  const { mutate } = useMutation({
    mutationFn: async (data: DataType) => http.post('/push/register', data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        return data;
      }
      toast.success(data.message);
      return data;
    },
  });

  const onRegisterToken = useCallback(async () => {
    const token = await registerForPushNotificationsAsync();
    if (token) {
      const data = {
        userId: user?.id,
        token: token,
        platform: Platform.OS,
      };
      mutate(data);
    }
  }, [user]);

  useEffect(() => {
    onRegisterToken();
  }, []);

  // listen for responses
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      // logic when notification is received
    });
    return () => subscription.remove();
  }, []);

  return <>{children}</>;
};
