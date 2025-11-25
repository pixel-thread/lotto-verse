import AdminTransactionsScreen from '@/src/components/screen/admin/transactions';
import { CustomHeader } from '@/src/components/common/CustomHeader';

export default function page() {
  return (
    <>
      <CustomHeader back={true} />
      <AdminTransactionsScreen />
    </>
  );
}
