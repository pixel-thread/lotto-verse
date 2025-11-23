import { EndpointT } from '@/src/types/endpoints';

type WinnerEndpoints = 'GET_ALL_WINNER' | 'PUT_MARK_PAID';

export const ADMIN_WINNER_ENDPOINTS: EndpointT<WinnerEndpoints> = {
  GET_ALL_WINNER: '/admin/winners',
  PUT_MARK_PAID: '/admin/winner/:id/mark-paid',
};
