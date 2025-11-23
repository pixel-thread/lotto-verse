import AdminWinnersScreen from '@/src/components/admin/winner';
import { CustomHeader } from '@/src/components/common/CustomHeader';

export default function page() {
  return (
    <>
      <CustomHeader back={true} />
      <AdminWinnersScreen />
    </>
  );
}
