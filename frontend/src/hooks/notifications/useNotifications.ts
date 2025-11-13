import { NOTIFICATIONS_ENDPOINTS } from '@/src/lib/endpoints/notifications';
import http from '@/src/utils/http';
import { useQuery } from '@tanstack/react-query';

type NotificationType = 'DRAW' | 'REWARD' | 'IMPORTANT' | 'ALL';

type NotificationT = {
  id: string;
  message: string;
  title: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
};

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => http.get<NotificationT[]>(NOTIFICATIONS_ENDPOINTS.GET_NOTIFICATIONS),
    select: (data) => data.data,
  });
}
