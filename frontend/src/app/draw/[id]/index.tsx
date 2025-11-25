import { CustomHeader } from '@/src/components/common/CustomHeader';
import { DrawDetailScreen } from '@/src/components/screen/draw/DrawDetailScreen';
import { useLocalSearchParams } from 'expo-router';

export default function page() {
  const { id } = useLocalSearchParams();
  return (
    <>
      <CustomHeader back />
      <DrawDetailScreen id={id.toString()} />
    </>
  );
}
