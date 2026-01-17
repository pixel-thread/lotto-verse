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
import ErrorBoundary from '../common/ErrorBoundary';
import { ProfileUpdateSheet } from '../common/ProfileUpdateSheet';
import { ExpoNotificationProvider } from './notification';

export const Wrapper = () => {
  return (
    <PortalProvider>
      <GestureHandlerRootView>
        <ClerkProvider
          publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
          tokenCache={tokenCache}>
          <ClerkLoaded>
            <RNTamaguiProvider>
              <ErrorBoundary>
                <StatusBar style="auto" />
                <RNQueryProvider>
                  <EASUpdateProvider>
                    <AuthProvider>
                      <ExpoNotificationProvider>
                        <SafeAreaProvider className="flex-1">
                          <AuthRedirect />
                          <ProfileUpdateSheet open={true} setOpen={() => {}} />
                          <Toaster closeButton position="bottom-center" />
                        </SafeAreaProvider>
                      </ExpoNotificationProvider>
                    </AuthProvider>
                  </EASUpdateProvider>
                </RNQueryProvider>
              </ErrorBoundary>
            </RNTamaguiProvider>
          </ClerkLoaded>
        </ClerkProvider>
      </GestureHandlerRootView>
    </PortalProvider>
  );
};
