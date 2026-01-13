import { CustomHeader } from '@/src/components/common/CustomHeader';
import { HomeScreen } from '@/src/components/screen/home';
import { Stack } from 'expo-router';

export default function page() {
  return (
    <>
      <Stack.Screen options={{ headerShown: true, header: () => <CustomHeader back={false} /> }} />
      <HomeScreen />
    </>
  );
}
