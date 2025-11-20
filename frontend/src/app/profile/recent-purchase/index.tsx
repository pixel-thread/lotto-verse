import { CustomHeader } from '@/src/components/common/CustomHeader';
import { RecentPurchases } from '@/src/components/screen/profile/RecentPurchase';

export default function page() {
  return (
    <>
      <CustomHeader back={true} />
      <RecentPurchases />
    </>
  );
}
