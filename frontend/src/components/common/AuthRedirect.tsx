import { useAuth } from '@clerk/clerk-expo';
import { Stack, usePathname, useRouter } from 'expo-router';
import { LoadingScreen } from './LoadingScreen';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'tamagui';
import { cn } from '@/src/lib/utils';
import { useFonts } from 'expo-font';
import { MaxWidthContainer } from './MaxWidthContainer';

export const AuthRedirect = () => {
  const [loaded] = useFonts({
    jetBrainMono: require('@assets/fonts/JetBrainsMono-Regular.ttf'),
  });

  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (isSignedIn && pathName === '/auth') router.replace('/');
  }, [isSignedIn, pathName]);

  useEffect(() => {
    if (!isSignedIn && pathName !== '/auth') router.replace('/auth');
  }, [isSignedIn, pathName]);

  if (!isLoaded || !loaded) return <LoadingScreen />;

  return (
    <View flex={1} style={{ fontFamily: 'Inter' }}>
      <SafeAreaView className={cn('flex-1')}>
        <MaxWidthContainer>
          <Stack screenOptions={{ headerShown: false }} />
        </MaxWidthContainer>
      </SafeAreaView>
    </View>
  );
};
