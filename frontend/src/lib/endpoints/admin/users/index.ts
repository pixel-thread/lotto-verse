import { EndpointT } from '@/src/types/endpoints';

type UserEnpoints = 'POST_LOCK_USER' | 'POST_BAN_USER' | 'GET_USERS';

export const ADMIN_USER_ENDPOINTS: EndpointT<UserEnpoints> = {
  POST_LOCK_USER: '/admin/users/:id/lock-user',
  POST_BAN_USER: '/admin/users/:id/ban-user',
  GET_USERS: '/admin/users',
};
