import { CustomHeader } from '@/src/components/common/CustomHeader';
import { CreatePurchase } from '@/src/components/screen/purchase/CreatePurchase';

export default function page() {
  return (
    <>
      <CustomHeader back />
      <CreatePurchase />
    </>
  );
}
