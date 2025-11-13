
import { EndpointT } from '@/src/types/endpoints';

type PaymentEndpoints = 'POST_CREATE_PAYMENT'|"POST_VERYFY_PAYMENT";

export const PAYMENT_ENDPOINTS: EndpointT<PaymentEndpoints> = {
  POST_CREATE_PAYMENT:'/payment/razorpay',
  POST_VERYFY_PAYMENT:'/payment/razorpay/verify'
};
