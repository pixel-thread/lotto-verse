import { useCurrentDrawUser } from '@/src/hooks/draw/useCurrentDrawUsers';
import React from 'react';
import { H3, Text, YStack, XStack, ScrollView, Circle, Card, Button, Avatar, View } from 'tamagui';

export const RecentDrawParticipants = () => {
  const { data: users, refetch } = useCurrentDrawUser();
  if (!users) return null;
  return (
    <Card
      padded
      rounded="$true"
      borderWidth={1}
      borderColor="$borderColor"
      paddingBlockStart="$2"
      overflow="hidden"
      maxHeight={400} // ensure card itself doesn’t grow endlessly
    >
      {/* Header */}
      <XStack justify="space-between" items="center">
        <H3 fontSize={18} fontWeight="700" letterSpacing={-0.5}>
          Recent Participants
        </H3>
      </XStack>

      {/* Scrollable list */}
      <ScrollView gap="$3" showsVerticalScrollIndicator={true} maxH={340}>
        <View height={5} />
        {users?.map((user) => (
          <XStack
            key={user.id}
            justify="space-between"
            rounded="$true"
            items="center"
            borderWidth={0.5}
            borderColor="$borderColor"
            paddingBlock="$2"
            paddingInline="$2">
            <XStack gap="$3" items="center">
              <Avatar circular size="$4">
                <Avatar.Image accessibilityLabel="Cam" src={user.imageUrl} />
                <Avatar.Fallback backgroundColor="$blue10" />
              </Avatar>
              <YStack>
                <Text fontSize={15} fontWeight="600">
                  {user.name}
                </Text>
                <Text fontSize={12} color="gray">
                  {user.purchaseAt}
                </Text>
              </YStack>
            </XStack>
            <Text fontSize={17} fontWeight="700">
              #{user?.number}
            </Text>
          </XStack>
        ))}
      </ScrollView>
    </Card>
  );
};
