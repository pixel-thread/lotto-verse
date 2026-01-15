import AdminTransactionDetail from '@/src/components/screen/admin/transactions/TransactionDetails';
import { CustomHeader } from '@/src/components/common/CustomHeader';
import { useLocalSearchParams } from 'expo-router';

export default function TransactionPage() {
  const { id } = useLocalSearchParams();
  return (
    <>
      <CustomHeader back={true} />
      <AdminTransactionDetail id={id.toString()} />
    </>
  );
}
