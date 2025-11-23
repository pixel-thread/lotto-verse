import AdminUsersScreen from '@/src/components/admin/users';
import { CustomHeader } from '@/src/components/common/CustomHeader';

export default function page() {
  return (
    <>
      <CustomHeader back={true} />
      <AdminUsersScreen />
    </>
  );
}
