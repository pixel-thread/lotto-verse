import { CheckoutPage } from '@/src/components/screen/checkout';
import { Redirect } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';

export default function page() {
  const searchParams = useSearchParams();
  const id = searchParams.get('numberId');

  if (!id) {
    return <Redirect href="/" />;
  }

  return <CheckoutPage id={id} />;
}
