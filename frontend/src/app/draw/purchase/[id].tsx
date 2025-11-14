import { PaymentVerificationScreen } from '@/src/components/screen/checkout/PaymentVerification';
import { useLocalSearchParams } from 'expo-router';

export default function page() {
  const { id } = useLocalSearchParams();
  return <PaymentVerificationScreen id={id.toString()} />;
}
