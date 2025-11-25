import AdminEditDrawScreen from '@/src/components/screen/admin/draws/EditDrawScreen';
import { useLocalSearchParams } from 'expo-router';

export default function page() {
  const { id } = useLocalSearchParams();
  return <AdminEditDrawScreen id={id.toString()} />;
}
