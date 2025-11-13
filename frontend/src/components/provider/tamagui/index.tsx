import tamaguiConfig from '@/tamagui.config';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { TamaguiProvider } from 'tamagui';

export const RNTamaguiProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme || 'dark'}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {children}
      </ThemeProvider>
    </TamaguiProvider>
  );
};
