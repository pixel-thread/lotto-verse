import { OnboardingScreen } from '@/src/components/screen/onboarding';
import { Stack } from 'expo-router';

export default function page() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Onboarding',
          headerShown: true,
        }}
      />
      <OnboardingScreen />
    </>
  );
}
