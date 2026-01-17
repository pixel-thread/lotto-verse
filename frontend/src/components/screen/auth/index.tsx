import { useAuth, useSSO } from '@clerk/clerk-expo';
import React, { useEffect, useState } from 'react';
import { Platform, useColorScheme } from 'react-native';
import { Button, H1, View, Paragraph, Text, Spinner, useTheme } from 'tamagui';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Ternary } from '@components/common/Ternary';
import { toast } from 'sonner-native';
import * as WebBrowser from 'expo-web-browser';
import { logger } from '@/src/utils/logger';
import { router } from 'expo-router';

export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    void WebBrowser.warmUpAsync();
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export function LoginScreen() {
  useWarmUpBrowser();
  const { isSignedIn } = useAuth();
  const { startSSOFlow } = useSSO();
  const [isLoading, setIsLoading] = useState(false);
  const colorSchema = useColorScheme();
  const isDarkTheme = colorSchema === 'dark';
  const theme = useTheme();

  const onClickGoogle = async () => {
    setIsLoading(true);
    try {
      const { createdSessionId, setActive, signUp, signIn } = await startSSOFlow({
        strategy: 'oauth_google',
      });

      // Case 1: Existing user - direct session
      if (createdSessionId && setActive) {
        toast.success('Login successful');
        await setActive({
          session: createdSessionId,
          navigate: ({ session }) => {
            if (session) router.replace('/(drawer)/(home)');
          },
        });
        return;
      }

      // Case 2: New user - incomplete signup
      if (signUp?.status === 'missing_requirements' && signUp.update) {
        const completeSignUp = await signUp.update({
          username: signUp.emailAddress?.split('@')[0]?.replace(/\W/g, ''),
        });

        if (completeSignUp?.status === 'complete' && completeSignUp.createdSessionId && setActive) {
          await setActive({
            session: completeSignUp.createdSessionId,
            navigate: ({ session }) => router.replace('/'),
          });
          toast.success('Account created successfully');
          return;
        }
      }

      // Case 3: Sign-in flow (fallback)
      if (signIn?.createdSessionId && setActive) {
        await setActive({
          session: signIn.createdSessionId,
          navigate: ({ session }) => router.replace('/'),
        });
        toast.success('Login successful');
        return;
      }

      // Fallback error
      toast.error('Authentication incomplete. Please try again.');
    } catch (error: any) {
      const errorMessage = error.errors?.[0]?.message || error.message || 'Authentication failed';
      toast.error(errorMessage);
      logger.error('Google OAuth error:', error);
    } finally {
      await WebBrowser.coolDownAsync();
      setIsLoading(false);
    }
  };

  return (
    <View bg={'$background'} flex={1} paddingInline={4}>
      <View
        flex={1}
        paddingInline={5}
        flexDirection="column"
        items={'flex-start'}
        justify={'center'}
        gap={2}>
        <H1 letterSpacing={'$3'} fontWeight={'bold'}>
          Your Lucky Numbers Await
        </H1>
        <Paragraph width={'90%'} fontWeight={'400'}>
          Join thousands of winners in the most exciting lucky draw platform
        </Paragraph>
      </View>
      <View
        position="absolute"
        width={'100%'}
        paddingInline={5}
        style={{ bottom: 0, left: 0, right: 0 }}>
        <Button
          disabled={isSignedIn || isLoading}
          onPress={onClickGoogle}
          themeInverse
          width="100%"
          size={'$6'}>
          <Ternary
            condition={isLoading || !!isSignedIn}
            ifTrue={<Spinner size="small" />}
            ifFalse={
              <View flex={1} items={'center'} justify={'center'} flexDirection={'row'} gap={5}>
                <Ionicons
                  name="logo-google"
                  size={24}
                  color={isDarkTheme ? theme.black1?.val : theme.white1.val}
                />
                <Text fontSize={'$5'} fontWeight={'500'}>
                  Continue with Google
                </Text>
              </View>
            }
          />
        </Button>
      </View>
    </View>
  );
}
