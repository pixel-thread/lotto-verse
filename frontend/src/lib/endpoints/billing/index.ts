import { EndpointT } from '@/src/types/endpoints';

type BillingEndpoinst = 'GET_BILLING_DETAIL';

export const BILLING_ENDPOINTS: EndpointT<BillingEndpoinst> = {
  GET_BILLING_DETAIL: '/billing/:id',
};
