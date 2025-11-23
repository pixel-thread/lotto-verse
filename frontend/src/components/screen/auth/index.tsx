import { useAuth, useSSO } from '@clerk/clerk-expo';
import React, { useState } from 'react';
import { useColorScheme } from 'react-native';
import { Button, H1, View, Paragraph, Text, Spinner, useTheme } from 'tamagui';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Ternary } from '@components/common/Ternary';
import { toast } from 'sonner-native';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();
export function LoginScreen() {
  const { isSignedIn, signOut } = useAuth();
  const { startSSOFlow } = useSSO();
  const [isLoading, setIsLoading] = useState(false);
  const colorSchema = useColorScheme();
  const isDarkTheme = colorSchema === 'dark';
  const theme = useTheme();

  const onClickGoogle = async () => {
    setIsLoading(true);
    await WebBrowser.warmUpAsync();
    try {
      startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl: '/',
      }).then(({ createdSessionId, setActive }) => {
        if (!!createdSessionId && setActive) {
          setActive({ session: createdSessionId });
        }
      });
    } catch (error: any) {
      toast.error(error.message);
      if (error.status === 400) {
        signOut();
      }
    } finally {
      await WebBrowser.coolDownAsync();
      setIsLoading(false);
    }
  };

  return (
    <View flex={1} paddingInline={4}>
      <View
        flex={1}
        paddingInline={5}
        flexDirection="column"
        items={'flex-start'}
        justify={'center'}
        gap={2}>
        <H1 fontWeight={'bold'}>Your</H1>
        <H1 fontWeight={'bold'}>Fortune</H1>
        <H1 fontWeight={'bold'}>Lucky Draw</H1>
        <Paragraph width={'90%'} fontWeight={'400'}>
          Join now for your chance to win amazing prizes every month. Pick your lucky number and see
          if fortune smiles on you!
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
