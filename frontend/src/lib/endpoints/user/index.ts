import { EndpointT } from '@/src/types/endpoints';

type UserEndpoints = 'GET_USER';

export const USER_ENDPOINTS: EndpointT<UserEndpoints> = {
  GET_USER: '/user',
};
