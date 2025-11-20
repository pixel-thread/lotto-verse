import { EndpointT } from '@/src/types/endpoints';

type UserEndpoints = 'GET_USER' | 'GET_RECENT_PURCHASES';

export const USER_ENDPOINTS: EndpointT<UserEndpoints> = {
  GET_USER: '/user',
  GET_RECENT_PURCHASES: '/user/purchases/recent',
};
