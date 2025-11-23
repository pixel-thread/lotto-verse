import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { AuthRedirect } from '@/src/components/common/AuthRedirect';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './auth';
import { RNQueryProvider } from './query';
import { RNTamaguiProvider } from './tamagui';
import { PortalProvider } from '@tamagui/portal';
import { Toaster } from 'sonner-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import EASUpdateProvider from './update';

export const Wrapper = () => {
  return (
    <PortalProvider>
      <GestureHandlerRootView>
        <ClerkProvider
          publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
          tokenCache={tokenCache}>
          <StatusBar style="auto" />
          <ClerkLoaded>
            <RNQueryProvider>
              <RNTamaguiProvider>
                <EASUpdateProvider>
                  <AuthProvider>
                    <SafeAreaProvider className="flex-1">
                      <AuthRedirect />
                      <Toaster />
                    </SafeAreaProvider>
                  </AuthProvider>
                </EASUpdateProvider>
              </RNTamaguiProvider>
            </RNQueryProvider>
          </ClerkLoaded>
        </ClerkProvider>
      </GestureHandlerRootView>
    </PortalProvider>
  );
};
