import { useAuth } from '@clerk/clerk-expo';
import { Stack, usePathname, useRouter } from 'expo-router';
import { LoadingScreen } from './LoadingScreen';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, View } from 'tamagui';
import { cn } from '@/src/lib/utils';
import { logger } from '@/src/utils/logger';
type HSLA = {
  h: number;
  s: number;
  l: number;
  a?: number;
};
const hslToCss = ({ h, s, l, a }: HSLA) => {
  return a !== undefined ? `hsla(${h}, ${s}%, ${l}%, ${a})` : `hsl(${h}, ${s}%, ${l}%)`;
};

export const AuthRedirect = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const theme = useTheme();
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (isSignedIn && pathName === '/auth') router.replace('/');
  }, [isSignedIn, pathName]);

  useEffect(() => {
    if (!isSignedIn && pathName !== '/auth') router.replace('/auth');
  }, [isSignedIn, pathName]);

  if (!isLoaded) return <LoadingScreen />;

  logger.log(theme.background.variable);
  logger.log(theme.background.val);
  logger.log(theme.background);
  return (
    <View flex={1} bg={'$background'}>
      <SafeAreaView className={cn('flex-1')}>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaView>
    </View>
  );
};
