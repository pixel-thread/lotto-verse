import { CheckoutPage } from '@/src/components/screen/checkout';
import { Redirect } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';

export default function page() {
  const searchParams = useSearchParams();
  const number = searchParams.get('number');
  const id = searchParams.get('id');

  if (!id || !number) {
    return <Redirect href="/" />;
  }

  return <CheckoutPage selectedNumber={number} id={id} />;
}
