import { CheckoutPage } from '@/src/components/screen/checkout';
import { useSearchParams } from 'expo-router/build/hooks';

export default function page() {
  const searchParams = useSearchParams();
  const number = searchParams.get('number');
  const id = searchParams.get('id');
  return <CheckoutPage selectedNumber={number} id={id} />;
}
