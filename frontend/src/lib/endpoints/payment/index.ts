import { EndpointT } from '@/src/types/endpoints';

type PaymentEndpoints = 'POST_CREATE_PAYMENT' | 'POST_VERYFY_PAYMENT' | 'GET_USER_PAYMENT';

export const PAYMENT_ENDPOINTS: EndpointT<PaymentEndpoints> = {
  POST_CREATE_PAYMENT: '/payment/razorpay',
  POST_VERYFY_PAYMENT: '/payment/razorpay/verify',
  GET_USER_PAYMENT: '/user/purchases/:id',
};
