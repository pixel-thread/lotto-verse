import { CustomHeader } from '@/src/components/common/CustomHeader';
import { Stack } from 'expo-router';

export default function layout() {
  return (
    <>
      <CustomHeader back />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
