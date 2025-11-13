import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { AuthRedirect } from '@/src/components/common/AuthRedirect';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './auth';
import { RNQueryProvider } from './query';
import { RNTamaguiProvider } from './tamagui';
import { PortalProvider } from 'tamagui';
import { Toaster } from 'sonner-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const Wrapper = () => {
  return (
    <GestureHandlerRootView>
      <ClerkProvider tokenCache={tokenCache}>
        <StatusBar style="auto" />
        <ClerkLoaded>
          <PortalProvider>
            <RNTamaguiProvider>
              <AuthProvider>
                <SafeAreaProvider className="flex-1">
                  <RNQueryProvider>
                    <AuthRedirect />
                    <Toaster />
                  </RNQueryProvider>
                </SafeAreaProvider>
              </AuthProvider>
            </RNTamaguiProvider>
          </PortalProvider>
        </ClerkLoaded>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
};
