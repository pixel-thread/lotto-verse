import { CustomHeader } from '@/src/components/common/CustomHeader';
import { DrawScreen } from '@/src/components/screen/draw';
import { Stack } from 'expo-router';

export default function page() {
  return (
    <>
      <Stack.Screen options={{ headerShown: true, header: () => <CustomHeader back={false} /> }} />
      <DrawScreen />
    </>
  );
}
