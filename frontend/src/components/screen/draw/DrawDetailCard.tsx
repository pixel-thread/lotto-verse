import { Stack, H2, XStack, YStack, Text, Card } from 'tamagui';
import { useCurrentDraw } from '@/src/hooks/draw/useCurrentDraw';
import React from 'react';
import { router } from 'expo-router';
import { CONTACT_NO } from '@/src/lib/constant/contact';

export const DrawDetailCard = () => {
  const { data: draw } = useCurrentDraw();

  const totalPurchases = draw?.purchases?.length || 0;
  const progress = Math.min((totalPurchases * 100) / (draw?.endRange || 1), 100);

  if (!draw) return null;

  return (
    <Card bordered onPress={() => router.push(`/draw/${draw.id}`)}>
      {/* Content Overlay */}
      <Stack flex={1} p="$6" justify="space-between" bg="$background" opacity={0.95}>
        {/* Top Minimal Info */}
        <YStack gap="$2">
          <Text fontSize="$3" fontWeight="600" letterSpacing={1.2}>
            DRAW {draw.month}
          </Text>
          <Text fontSize="$2" fontWeight="600" letterSpacing={1.2} color={'grey'}>
            Prize Pool
          </Text>
          <H2 fontSize="$9" fontWeight="800" color="$color12">
            ₹{draw.prize.amount}
          </H2>
        </YStack>

        {/* Bottom Stats + Progress */}
        <YStack gap="$4">
          {/* Prize Preview */}
          <Text fontSize="$4" fontWeight="500" lineHeight={20}>
            {draw.prize.description}
          </Text>

          {/* Compact Stats Row */}
          <XStack items="center" justify="space-between" gap="$5">
            <YStack gap="$0.5" flex={1}>
              <Text fontSize="$2" fontWeight="500">
                ENTRY
              </Text>
              <Text fontSize="$7" fontWeight="900" color="$blue12">
                ₹{draw.entryFee}
              </Text>
            </YStack>

            <YStack gap="$1">
              <Text fontSize="$2" fontWeight="500">
                FILLED
              </Text>
              <Text fontSize="$6" fontWeight="700" color="$color12">
                {progress}%
              </Text>
            </YStack>
          </XStack>
          <Card themeInverse padded>
            <YStack gap="$3">
              <Text fontSize="$2" text="center">
                For more details call us.
              </Text>
              <Text fontSize="$4" fontWeight={'bold'} text="center">
                {CONTACT_NO}
              </Text>
            </YStack>
          </Card>
        </YStack>
      </Stack>
    </Card>
  );
};
