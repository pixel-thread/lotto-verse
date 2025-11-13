import React from 'react';
import { View, YStack, XStack, Card } from 'tamagui';
import { SkeletonPulse } from '../../../common/Skeleton';

export const DrawDetailSkeleton = () => {
  return (
    <Card padded bg="$background" rounded="$4" style={{ width: '100%', overflow: 'hidden' }}>
      <YStack gap={24}>
        {/* Header skeleton */}
        <XStack justify="space-between" items="center" gap={8}>
          <YStack gap={8} flex={1}>
            <SkeletonPulse style={{ height: 12, width: '40%' }} />
            <SkeletonPulse style={{ height: 20, width: '60%', borderRadius: 6 }} />
            <SkeletonPulse style={{ height: 14, width: 80, borderRadius: 4 }} />
          </YStack>
          <SkeletonPulse style={{ height: 24, width: 60, borderRadius: 8 }} />
        </XStack>

        {/* Info section skeleton */}
        <XStack flexWrap="wrap" justify="space-between" gap={24}>
          {[...Array(3)].map((_, i) => (
            <View key={i} style={{ width: '20%' }}>
              <SkeletonPulse style={{ height: 12, width: 50, marginBottom: 4 }} />
              <SkeletonPulse style={{ height: 24, width: '100%', borderRadius: 6 }} />
            </View>
          ))}
        </XStack>
      </YStack>
    </Card>
  );
};
