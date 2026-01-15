import { BillingDetailScreen } from '@/src/components/screen/Billing/BillingDetailPage';
import { useLocalSearchParams } from 'expo-router';

export default function Billing() {
  const { id } = useLocalSearchParams();
  return <BillingDetailScreen id={id.toString()} />;
}
