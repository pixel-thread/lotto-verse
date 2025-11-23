import React, { useCallback } from 'react';
import { RefreshControl } from 'react-native';
import {
  YStack,
  XStack,
  Text,
  ScrollView,
  Card,
  H1,
  Paragraph,
  Button,
  Circle,
  Spinner,
} from 'tamagui';
import useCurrentDrawNumbers from '@/src/hooks/draw/useCurrentDrawNumbers';
import { RecentDrawParticipants } from '../home/RecentDrawParticipants';
import { ContinuousShuffleCounter } from '../home/slot-counter/ContinousShuffleCounter';
import { WinnerCard } from '../home/WinnerCard';
import { HowItWorkSection } from './HowItWorkSection';
import { drawRule } from '@/src/lib/constant/draw/drawRule';
import { router, Stack } from 'expo-router';
import { CustomHeader } from '../../common/CustomHeader';
import useGetDraw from '@/src/hooks/draw/useGetDraw';
import { formatMonth, formatMonthWithTime } from '@/src/utils/helper/formatMonth';

type Props = {
  id: string;
};

export function DrawDetailScreen({ id }: Props) {
  const { data: draw, refetch: refetchDraw, isFetching: isDrawLoading } = useGetDraw({ id });

  const {
    data: luckyNumbers,
    isFetching: isLuckyLoading,
    refetch: refetchLuckyNumbers,
  } = useCurrentDrawNumbers();

  const onRefresh = useCallback(async () => {
    try {
      await Promise.all([refetchDraw(), refetchLuckyNumbers()]);
    } finally {
    }
  }, [refetchDraw, refetchLuckyNumbers]);
  if (isDrawLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Luck Draw',
            header: ({ back }) => <CustomHeader back={!!back} />,
            headerShown: true,
          }}
        />
        <YStack flex={1} justify="center" items="center">
          <Spinner size="large" />
        </YStack>
      </>
    );
  }

  if (!draw) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Luck Draw',
            header: ({ back }) => <CustomHeader back={!!back} />,
            headerShown: true,
          }}
        />
        <YStack flex={1} justify="center" items="center">
          <Text fontSize={24} fontWeight="bold">
            Draw not found
          </Text>
        </YStack>
      </>
    );
  }

  const displayMonth = formatMonth(draw.month || '');

  const declarationDate = formatMonthWithTime(draw.endDate || 'To be announced');

  const declarationTime = '6:00 PM';

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Luck Draw',
          header: ({ back }) => <CustomHeader back={!!back} />,
          headerShown: true,
        }}
      />
      <ScrollView
        flex={1}
        refreshControl={
          <RefreshControl refreshing={isDrawLoading || isLuckyLoading} onRefresh={onRefresh} />
        }
        style={{
          padding: 20,
        }}>
        <YStack gap="$6">
          {/* Draw Header */}
          <Card padding="$5" elevation="$3" rounded="$8" borderWidth={1} borderColor="$borderColor">
            <YStack gap="$3">
              <Text fontSize={18} fontWeight="bold" textTransform="uppercase" color="gray">
                {displayMonth} Draw
              </Text>
              <H1 fontWeight="900" fontSize={48} color="$green10">
                ₹ {draw.prize?.amount || '-'}
              </H1>
              <Paragraph size="$6" color="gray" maxW={280}>
                {draw.prize?.description || 'No prize information available'}
              </Paragraph>
            </YStack>
          </Card>

          {/* Draw Info Grid */}
          <XStack justify="space-between" gap="$4">
            <Card flex={1} padding="$4" rounded="$6" borderWidth={1} borderColor="$borderColor">
              <Text fontSize={12} color="gray" textTransform="uppercase" fontWeight="700">
                Entry Fee
              </Text>
              <Text fontSize={24} fontWeight="900">
                ₹ {draw.entryFee}
              </Text>
            </Card>
            <Card flex={1} padding="$4" rounded="$6" borderWidth={1} borderColor="$borderColor">
              <Text fontSize={12} color="gray" textTransform="uppercase" fontWeight="700">
                Max Number
              </Text>
              <Text fontSize={24} fontWeight="900">
                {draw.endRange}
              </Text>
            </Card>
          </XStack>

          <Card padding="$4" rounded="$6" borderWidth={1} borderColor="$borderColor">
            <XStack justify="space-between" items="center">
              <Text fontSize={12} color="gray" textTransform="uppercase" fontWeight="700">
                Number Range
              </Text>
              <Text fontSize={16} fontWeight="800">
                {draw.startRange} - {draw.endRange}
              </Text>
            </XStack>
          </Card>

          {/* Dates and Status */}
          <Card padding="$4" rounded="$6" borderWidth={1} borderColor="$borderColor">
            <YStack gap="$3">
              <Text fontSize={12} color="gray" textTransform="uppercase" fontWeight="700">
                Winner Announcement
              </Text>
              <XStack items="center" gap="$3">
                <Circle size={10} bg="$green10" />
                <Text fontSize={16} fontWeight="600">
                  {declarationDate} at {declarationTime}
                </Text>
              </XStack>
              <Text fontSize={14} color={draw.isWinnerDecleared ? '$green10' : 'blue'}>
                Status: {draw.isWinnerDecleared ? 'Winner Declared' : 'Ongoing'}
              </Text>
            </YStack>
          </Card>

          {/* Winner Section */}
          {draw.isWinnerDecleared && draw.winner ? (
            <WinnerCard />
          ) : (
            <YStack
              paddingBlock="$4"
              rounded="$6"
              borderWidth={1}
              borderColor="$borderColor"
              items="center">
              <Text fontSize={16} fontWeight="600" color="gray">
                No winner declared yet.
              </Text>
            </YStack>
          )}

          {/* Lucky Numbers & Shuffle Counter */}
          <Card padding="$4" rounded="$6" borderWidth={1} borderColor="$borderColor">
            <Text fontSize={16} fontWeight="700" paddingBlockEnd={'$4'}>
              Lucky Numbers
            </Text>
            <ContinuousShuffleCounter luckyNumbers={luckyNumbers || []} />
          </Card>

          {/* Recent Participants */}

          {/* Action Buttons */}
          {!draw.isWinnerDecleared && (
            <XStack justify="space-evenly" gap="$3">
              <Button
                onPress={() => router.push('/(drawer)/(home)/(draw)')}
                disabled={isDrawLoading || isLuckyLoading}
                themeInverse
                size="$6"
                flex={1}>
                <Button.Text fontWeight={'bold'}>Buy Number</Button.Text>
              </Button>
            </XStack>
          )}
          <RecentDrawParticipants />
          <HowItWorkSection options={drawRule} title="Draw Rules" />
        </YStack>
      </ScrollView>
    </>
  );
}
