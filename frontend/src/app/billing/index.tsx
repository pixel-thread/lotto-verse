import { CustomHeader } from '@/src/components/common/CustomHeader';
import { Billing } from '@/src/components/screen/Billing/Billing';

export default function page() {
  return (
    <>
      <CustomHeader back={true} />
      <Billing />
    </>
  );
}
