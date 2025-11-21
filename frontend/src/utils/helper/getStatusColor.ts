import { PaymentStatusT } from '@/src/types/purchase';

export const getStatusColor = (status: PaymentStatusT) => {
  switch (status) {
    case 'SUCCESS':
      return 'green';
    case 'PENDING':
      return 'orange';
    case 'FAILED':
      return 'red';
    default:
      return 'gray';
  }
};
