import { Card, H4, Paragraph, XStack, YStack } from 'tamagui';
import { DrawDetailSkeleton } from './skeleton/DrawDetailSkeleton';
import { useCurrentDraw } from '@/src/hooks/draw/useCurrentDraw';
import { router } from 'expo-router';

export const DrawDetailCard = () => {
  const { isFetching: isDrawFetching, data: draw } = useCurrentDraw();

  const displayMonth = draw?.month;

  if (isDrawFetching) {
    return <DrawDetailSkeleton />;
  }

  return (
    <Card onPress={() => router.push(`/draw/${draw?.id}`)} padded rounded="$4" animation={'bouncy'}>
      <YStack gap="$5">
        <XStack justify="space-between" paddingInlineEnd="$2" gap="$1" items="center">
          <YStack gap="$1">
            <Paragraph size="$2" textTransform="uppercase">
              #&nbsp;{draw?.id}
            </Paragraph>
            <H4 textTransform="uppercase" fontWeight={'bold'}>
              {displayMonth}
            </H4>
            <Paragraph size="$5">{draw?.createdAt.split('T')[0]}</Paragraph>
          </YStack>
        </XStack>

        <XStack gap="$6" justify="space-between" flexWrap="wrap">
          <YStack>
            <Paragraph size="$2" color={'gray'}>
              Entry
            </Paragraph>
            <Paragraph size="$6" fontWeight="700" color="$blue10">
              ₹{draw?.entryFee}
            </Paragraph>
          </YStack>
          <YStack>
            <Paragraph size="$2" color="gray">
              Prize Pool
            </Paragraph>
            <Paragraph size="$6" fontWeight="700" color="$green10">
              ₹{draw?.prize.amount}
            </Paragraph>
          </YStack>
          <YStack>
            <Paragraph size="$2" color="gray">
              Participants
            </Paragraph>
            <Paragraph size="$6" fontWeight="700">
              0 /{draw?.endRange}
            </Paragraph>
          </YStack>
        </XStack>
      </YStack>
    </Card>
  );
};
