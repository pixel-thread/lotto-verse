import { CustomHeader } from '@/src/components/common/CustomHeader';
import { CheckoutPage } from '@/src/components/screen/checkout';
import { Redirect } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';

export default function page() {
  const searchParams = useSearchParams();
  const id = searchParams.get('numberId');

  if (!id) {
    return <Redirect href="/" />;
  }

  return (
    <>
      <CustomHeader back={true} />
      <CheckoutPage id={id.toString()} />
    </>
  );
}
