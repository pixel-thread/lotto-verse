import AdminWinnersScreen from '@/src/components/screen/admin/winner';
import { CustomHeader } from '@/src/components/common/CustomHeader';

export default function page() {
  return (
    <>
      <CustomHeader back={true} />
      <AdminWinnersScreen />
    </>
  );
}
