import { router } from 'expo-router';

let lastNavigationKey: string | null = null;

export function handleNotificationNavigation(
  rawData: any,
  options?: {
    isAuthenticated?: boolean;
    onUnauthenticated?: () => void;
    trackEvent?: (name: string, data?: any) => void;
  }
) {
  if (!rawData) return;

  const data = typeof rawData.dataString === 'string' ? JSON.parse(rawData.dataString) : rawData;

  if (!data?.type) return;

  const navigationKey = `${data.type}:${data.entityId ?? 'none'}`;

  if (navigationKey === lastNavigationKey) return;

  lastNavigationKey = navigationKey;

  options?.trackEvent?.('notification_opened', data);

  if (options?.isAuthenticated === false) {
    options?.onUnauthenticated?.();
    return;
  }

  // ✅ Modern, non-deprecated
  setTimeout(() => {
    switch (data.type) {
      case 'draw':
        router.push(`/draw/${data.entityId}`);
        break;

      case 'notifications':
        router.push(`/notifications`);
        break;

      default:
        router.push('/');
    }
  }, 50);
}
