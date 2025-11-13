import { EndpointT } from '@/src/types/endpoints';

type NotificationsEndpoints = 'GET_NOTIFICATIONS';

export const NOTIFICATIONS_ENDPOINTS: EndpointT<NotificationsEndpoints> = {
  GET_NOTIFICATIONS: '/notifications',
};
