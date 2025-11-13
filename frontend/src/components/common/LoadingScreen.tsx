import { View, Spinner, YStack } from 'tamagui';

export function LoadingScreen() {
  return (
    <View flex={1} items={'center'} justify={'center'}>
      <YStack gap="$4">
        <Spinner size="large" />
      </YStack>
    </View>
  );
}
