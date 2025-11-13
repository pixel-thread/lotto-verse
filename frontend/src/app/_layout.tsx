import '@/src/styles/global.css';

import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { Wrapper } from '../components/provider';
import * as SplashScreen from 'expo-splash-screen';
import '@/src/styles/global.css';

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function Layout() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hide();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <Wrapper />;
}
