import { useAuth } from '@clerk/clerk-expo';
import { Stack, usePathname, useRouter } from 'expo-router';
import { LoadingScreen } from './LoadingScreen';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'tamagui';
import { cn } from '@/src/lib/utils';

export const AuthRedirect = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (isSignedIn && pathName === '/auth') router.replace('/');
  }, [isSignedIn, pathName]);

  useEffect(() => {
    if (!isSignedIn && pathName !== '/auth') router.replace('/auth');
  }, [isSignedIn, pathName]);

  // BUG: Clerk does not load after login in android
  // if (!isLoaded) return <LoadingScreen />;

  return (
    <View flex={1}>
      <SafeAreaView className={cn('flex-1')}>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaView>
    </View>
  );
};
