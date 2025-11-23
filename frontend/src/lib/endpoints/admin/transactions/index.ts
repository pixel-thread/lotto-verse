import { EndpointT } from '@/src/types/endpoints';

type TransactionsEndpoints = 'GET_ALL_TRANSACTONS' | 'GET_TRANSACTION_BY_ID';

export const ADMIN_TRANSACTION_ENDPOINTS: EndpointT<TransactionsEndpoints> = {
  GET_ALL_TRANSACTONS: '/admin/transactions',
  GET_TRANSACTION_BY_ID: '/admin/transactions/:id',
};
