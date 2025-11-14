import React, { useCallback } from 'react';
import { RefreshControl } from 'react-native';
import { YStack, XStack, Text, ScrollView, Card, H1, Paragraph, Button, Circle } from 'tamagui';
import { router, Stack } from 'expo-router';
import { CustomHeader } from '../../common/CustomHeader';
import { useUser } from '@clerk/clerk-expo';

export function ProfileScreen() {
  const [isLoading, setIsLoading] = React.useState(false);
  const { user } = useUser();

  const onRefresh = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setIsLoading(false);
    }
  }, []);
  if (!user) {
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Profile',
          header: ({ back }) => <CustomHeader back={!!back} />,
          headerShown: true,
        }}
      />
      <ScrollView
        flex={1}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
        style={{ padding: 20 }}>
        <YStack gap="$6" items="center">
          <Circle size={120} bg="$background" borderWidth={2} borderColor="$borderColor">
            <Text fontSize={48} fontWeight="900" color="$green10">
              A
            </Text>
          </Circle>

          <H1 fontWeight="900" fontSize={36} color="$green10">
            {user?.username || user?.firstName}
          </H1>

          <Paragraph size="$6" color="gray" maxW={280}>
            {user?.primaryEmailAddress?.emailAddress}
          </Paragraph>

          <Card padding="$4" rounded="$6" borderWidth={1} borderColor="$borderColor" width="100%">
            <YStack gap="$2" items="center">
              <Text fontSize={12} color="gray" textTransform="uppercase" fontWeight="700">
                Member Since
              </Text>
              <Text fontSize={20} fontWeight="700">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </Text>
            </YStack>
          </Card>

          <XStack justify="space-between" gap="$4" width="100%">
            <Card flex={1} padding="$4" rounded="$6" borderWidth={1} borderColor="$borderColor">
              <Text fontSize={12} color="gray" textTransform="uppercase" fontWeight="700" mb={4}>
                Draws Participated
              </Text>
              <Text fontSize={24} fontWeight="900">
                00
              </Text>
            </Card>
            <Card flex={1} padding="$4" rounded="$6" borderWidth={1} borderColor="$borderColor">
              <Text fontSize={12} color="gray" textTransform="uppercase" fontWeight="700" mb={4}>
                Total Wins
              </Text>
              <Text fontSize={24} fontWeight="900">
                00
              </Text>
            </Card>
          </XStack>

          <Card padding="$4" rounded="$6" borderWidth={1} borderColor="$borderColor" width="100%">
            <YStack gap="$2" items="center">
              <Text fontSize={12} color="gray" textTransform="uppercase" fontWeight="700">
                Total Billing
              </Text>
              <H1 fontWeight="900" fontSize={36} color="$green10">
                ₹ {user.billingAmount}
              </H1>
            </YStack>
          </Card>

          {/* Buttons in rows - two per row */}
          <YStack width="100%" gap="$3">
            <XStack justify="space-between" gap="$3">
              <Button onPress={() => router.push('/profile/edit')} themeInverse size="$6" flex={1}>
                <Button.Text fontWeight={'bold'}>Edit Profile</Button.Text>
              </Button>
              <Button onPress={() => router.push('/profile/wins')} themeInverse size="$6" flex={1}>
                <Button.Text fontWeight={'bold'}>Draw Wins</Button.Text>
              </Button>
            </XStack>

            <XStack justify="space-between" gap="$3">
              <Button
                onPress={() => router.push('/settings/account')}
                themeInverse
                size="$6"
                flex={1}>
                <Button.Text fontWeight={'bold'}>Account Settings</Button.Text>
              </Button>
              <Button
                onPress={() => router.push('/settings/notifications')}
                themeInverse
                size="$6"
                flex={1}>
                <Button.Text fontWeight={'bold'}>Notification Settings</Button.Text>
              </Button>
            </XStack>

            <XStack justify="space-between" gap="$3">
              <Button
                onPress={() => router.push('/settings/privacy')}
                themeInverse
                size="$6"
                flex={1}>
                <Button.Text fontWeight={'bold'}>Privacy Settings</Button.Text>
              </Button>
              <Button onPress={() => alert('Logout pressed')} size="$6" flex={1}>
                <Button.Text fontWeight={'bold'}>Logout</Button.Text>
              </Button>
            </XStack>
          </YStack>
        </YStack>
      </ScrollView>
    </>
  );
}
