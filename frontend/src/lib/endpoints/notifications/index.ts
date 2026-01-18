import { EndpointT } from '@/src/types/endpoints';

type NotificationsEndpoints = 'GET_NOTIFICATIONS' | 'POST_REGISTER_DEVICE_TOKEN';

export const NOTIFICATIONS_ENDPOINTS: EndpointT<NotificationsEndpoints> = {
  GET_NOTIFICATIONS: '/notifications',
  POST_REGISTER_DEVICE_TOKEN: '/notifications/token',
};
