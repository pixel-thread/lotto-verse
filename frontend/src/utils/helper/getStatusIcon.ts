import { PaymentStatusT } from '@/src/types/purchase';

export const getStatusIcon = (status: PaymentStatusT) => {
  switch (status) {
    case 'SUCCESS':
      return 'checkmark-circle';
    case 'PENDING':
      return 'time';
    case 'FAILED':
      return 'close-circle';
    default:
      return 'help-circle';
  }
};
