import { CustomHeader } from '@/src/components/common/CustomHeader';
import CreateUpdateScreen from '@/src/components/screen/admin/update/CreateUpdateScreen';

export default function page() {
  return (
    <>
      <CustomHeader back={true} />
      <CreateUpdateScreen />
    </>
  );
}
