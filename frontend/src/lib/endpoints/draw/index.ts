import { EndpointT } from '@/src/types/endpoints';

type DrawEndpoints =
  | 'GET_ACTIVE_DRAW'
  | 'GET_ACTIVE_DRAW_NUMBERS'
  | 'GET_ACTIVE_DRAW_USERS'
  | 'GET_DRAW_BY_ID';

export const DRAW_ENDPOINTS: EndpointT<DrawEndpoints> = {
  GET_ACTIVE_DRAW: '/draw/current',
  GET_ACTIVE_DRAW_NUMBERS: '/draw/current/lucky-numbers?page=:page',
  GET_ACTIVE_DRAW_USERS: '/draw/current/users',
  GET_DRAW_BY_ID: '/draw/:id',
};
