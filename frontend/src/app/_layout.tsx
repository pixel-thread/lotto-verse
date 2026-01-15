import '@/src/styles/global.css';

import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Wrapper } from '../components/provider';

SplashScreen.setOptions({ duration: 1000, fade: true });

export default function Layout() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      setIsLoaded(true);
      SplashScreen.hide();
    }
  }, [isLoaded]);

  return <Wrapper />;
}
