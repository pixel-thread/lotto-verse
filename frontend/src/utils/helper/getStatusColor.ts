export const getStatusColor = (status: string) => {
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
