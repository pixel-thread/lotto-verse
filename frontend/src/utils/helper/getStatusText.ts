export function getStatusText(status: string) {
  return status === 'SUCCESS'
    ? 'Payment Successful'
    : status === 'FAILED'
      ? 'Payment Failed'
      : 'Payment Pending';
}
