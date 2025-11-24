import AdminDrawsScreen from '@/src/components/admin/draws';
import { CustomHeader } from '@/src/components/common/CustomHeader';

export default function page() {
  return (
    <>
      <CustomHeader back={true} />
      <AdminDrawsScreen />
    </>
  );
}
