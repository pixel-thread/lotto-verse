import { PaymentStatusT } from '@/src/types/purchase';

export function getStatusText(status: PaymentStatusT) {
  return status === 'SUCCESS'
    ? 'Payment Successful'
    : status === 'FAILED'
      ? 'Payment Failed'
      : 'Payment Pending';
}
