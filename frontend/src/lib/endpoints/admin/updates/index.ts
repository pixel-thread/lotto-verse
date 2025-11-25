import { EndpointT } from '@/src/types/endpoints';

type UpdateEnpoints = 'GET_UPDATES' | 'POST_CREATE_UPDATE' | 'DELETE_UPDATE_BY_ID';

export const ADMIN_UPDATE_ENDPOINTS: EndpointT<UpdateEnpoints> = {
  GET_UPDATES: '/admin/update',
  POST_CREATE_UPDATE: '/admin/update',
  DELETE_UPDATE_BY_ID: '/admin/draw/:id',
};
