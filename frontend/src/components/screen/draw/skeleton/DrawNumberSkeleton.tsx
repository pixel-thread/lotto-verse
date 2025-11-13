import { SkeletonPulse } from '@/src/components/common/Skeleton';
import React from 'react';
import { YStack, XStack, Card } from 'tamagui';

const skeletonNumbers = Array(12).fill(0);
export const DrawNumberSectionSkeleton = () => {
  // Skeleton squares for number buttons grid

  return (
    <Card rounded="$4" style={{ width: '100%', maxWidth: 600, padding: 20 }}>
      <YStack gap={24}>
        {/* Header */}
        <SkeletonPulse style={{ height: 32, width: 220, borderRadius: 6 }} />

        {/* Description and purchased number */}
        <SkeletonPulse style={{ height: 16, width: '60%', borderRadius: 4 }} />
        <SkeletonPulse style={{ height: 16, width: '40%', borderRadius: 4, marginTop: 8 }} />

        {/* Selected Number Display */}
        <SkeletonPulse style={{ height: 64, width: '100%', borderRadius: 6, marginTop: 16 }} />

        {/* Number grid header */}
        <XStack justify="space-between" items="center" style={{ marginTop: 8 }}>
          <SkeletonPulse style={{ height: 24, width: 140, borderRadius: 6 }} />
          <SkeletonPulse style={{ height: 16, width: 60, borderRadius: 4 }} />
        </XStack>

        {/* Number Buttons Grid */}

        {/* Pagination & Buy Button */}
        <XStack
          justify="space-between"
          items="center"
          style={{
            marginTop: 12,
          }}>
          <SkeletonPulse style={{ width: 48, height: 48, borderRadius: 12 }} />
          <SkeletonPulse style={{ width: 200, height: 56, borderRadius: 12 }} />
          <SkeletonPulse style={{ width: 48, height: 48, borderRadius: 12 }} />
        </XStack>
      </YStack>
    </Card>
  );
};
export const DrawNumberSkeleton = () => {
  return (
    <XStack flexWrap="wrap" justify="center" gap={12}>
      {skeletonNumbers.map((_, i) => (
        <SkeletonPulse
          key={i}
          style={{
            width: 70,
            height: 70,
            borderRadius: 12,
            marginVertical: 6,
          }}
        />
      ))}
    </XStack>
  );
};
