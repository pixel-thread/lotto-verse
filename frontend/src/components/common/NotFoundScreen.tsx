import React from 'react';
import { router } from 'expo-router';
import { YStack, Text, Button } from 'tamagui';

export const NotFoundScreen = ({
  title = '404 - Page Not Found',
  message = 'The page you are trying to access does not exist. Please try again.',
}: {
  title?: string;
  message?: string;
}) => {
  return (
    <YStack flex={1} items="center" justify="center" paddingBlock="$6" paddingInline="$6" gap="$4">
      <Text fontSize={42} fontWeight="900" color="$red10">
        404
      </Text>

      <Text fontSize={18} fontWeight="700">
        {title}
      </Text>

      <Text color="gray" text="center">
        {message}
      </Text>

      <YStack gap="$3" mt="$4" width="100%">
        <Button size="$5" onPress={() => router.back()}>
          <Button.Text fontWeight="bold">Go Back</Button.Text>
        </Button>

        <Button size="$5" themeInverse onPress={() => router.push('/')}>
          <Button.Text fontWeight="bold">Go Home</Button.Text>
        </Button>
      </YStack>
    </YStack>
  );
};
