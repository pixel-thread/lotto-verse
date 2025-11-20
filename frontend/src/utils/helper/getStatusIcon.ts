export const getStatusIcon = (status: string) => {
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
