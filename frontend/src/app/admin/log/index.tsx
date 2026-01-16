import { CustomHeader } from '@/src/components/common/CustomHeader';
import { AdminLogScreen } from '@/src/components/screen/admin/log';

export default function page() {
  return (
    <>
      <CustomHeader back={true} />
      <AdminLogScreen />
    </>
  );
}
