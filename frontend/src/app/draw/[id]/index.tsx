import { DrawDetailScreen } from '@/src/components/screen/draw/DrawDetailScreen';
import { useLocalSearchParams } from 'expo-router';

export default function page() {
  const { id } = useLocalSearchParams();
  return <DrawDetailScreen id={id.toString()} />;
}
