import React from 'react';
import { ScrollView } from 'react-native';
import { YStack, XStack, Text, Card, Button, Avatar, Separator } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { LinearGradient } from 'tamagui/linear-gradient';

export function ProfileScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { isSignedIn } = useAuth();

  if (!user || !isSignedIn) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text fontSize={18}>No user found or not signed in.</Text>
      </YStack>
    );
  }

  /** Reusable section button component */
  function SectionButton({
    label,
    icon,
    onPress,
  }: {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
  }) {
    return (
      <Card
        bordered
        hoverStyle={{ backgroundColor: '$blue2' }}
        pressStyle={{ backgroundColor: '$blue3' }}
        borderRadius="$6"
        padding="$4"
        onPress={onPress}
        elevate>
        <XStack alignItems="center" justifyContent="space-between">
          <XStack alignItems="center" gap="$3">
            <Ionicons name={icon} size={22} color="#007AFF" />
            <Text fontSize={16}>{label}</Text>
          </XStack>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </XStack>
      </Card>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      <Avatar circular size={110} borderWidth={3} borderColor="white" elevation="$4">
        <Avatar.Image src={user.imageUrl} accessibilityLabel="User Avatar" />
        <Avatar.Fallback backgroundColor="$blue5" />
      </Avatar>

      <Text fontSize={26} fontWeight="900" color="white" marginTop="$3">
        {user.fullName || 'User'}
      </Text>

      <Text fontSize={15} color="white" opacity={0.8}>
        {user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress || ''}
      </Text>

      <YStack padding="$5" gap="$5">
        <Separator />

        {/* Settings / Actions */}
        <YStack gap="$3">
          <SectionButton
            label="Edit Basic Info"
            icon="person-circle-outline"
            onPress={() => router.push('/profile/edit-basic')}
          />
          <SectionButton
            label="Change Password"
            icon="lock-closed-outline"
            onPress={() => router.push('/profile/edit-password')}
          />
          <SectionButton
            label="Payment Information"
            icon="card-outline"
            onPress={() => router.push('/profile/payment-info')}
          />
          <SectionButton
            label="Security Settings"
            icon="shield-checkmark-outline"
            onPress={() => router.push('/profile/security-settings')}
          />
          <SectionButton
            label="Notification Preferences"
            icon="notifications-outline"
            onPress={() => router.push('/profile/notification-settings')}
          />
        </YStack>

        <Separator marginVertical="$4" />

        <Button
          theme="red"
          icon={<Ionicons name="log-out-outline" size={20} />}
          onPress={() => router.push('/logout')}
          size="$5"
          borderRadius="$8">
          Log Out
        </Button>
      </YStack>
    </ScrollView>
  );
}
