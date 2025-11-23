import AdminTransactionsScreen from '@/src/components/admin/transactions';
import { CustomHeader } from '@/src/components/common/CustomHeader';

export default function page() {
  return (
    <>
      <CustomHeader back={true} />
      <AdminTransactionsScreen />
    </>
  );
}
