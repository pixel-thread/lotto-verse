import React from 'react';
import { YStack, XStack, Card } from 'tamagui';
import { SkeletonPulse } from '../../common/Skeleton';

export const NotificationSkeleton = () => {
  return (
    <YStack gap="$5" paddingBlock="$4" paddingInline="$4">
      {/* Filter Buttons Skeleton */}
      <XStack justify="space-around" marginBlockEnd="$2">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonPulse key={i} style={{ width: 80, height: 36, borderRadius: 10 }} />
        ))}
      </XStack>

      {/* Notification Cards Skeleton */}
      <NotificationCardSkeleton />
    </YStack>
  );
};

export const NotificationCardSkeleton = () => {
  return (
    <YStack gap="$4">
      {[1, 2, 3].map((i) => (
        <Card key={i} padding="$4" borderRadius="$6" borderColor="$borderColor" borderWidth={1}>
          <YStack gap="$3">
            <XStack items="center" gap="$3">
              <SkeletonPulse style={{ width: 24, height: 24, borderRadius: 12 }} />
              <SkeletonPulse style={{ width: 120, height: 14 }} />
            </XStack>

            <SkeletonPulse style={{ width: '100%', height: 12 }} />
            <SkeletonPulse style={{ width: '70%', height: 12 }} />
            <SkeletonPulse style={{ width: 100, height: 10, marginTop: 6 }} />
          </YStack>
        </Card>
      ))}
    </YStack>
  );
};
