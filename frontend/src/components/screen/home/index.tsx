import React, { useCallback } from 'react';
import { View, H1, Paragraph, Text, YStack, XStack, ScrollView, Card, Circle } from 'tamagui';
import { router, Stack } from 'expo-router';
import { CustomHeader } from '../../common/CustomHeader';
import { useCurrentDraw } from '@/src/hooks/draw/useCurrentDraw';
import useCurrentDrawNumbers from '@/src/hooks/draw/useCurrentDrawNumbers';
import { ContinuousShuffleCounter } from './slot-counter/ContinousShuffleCounter';
import { RecentDrawParticipants } from './RecentDrawParticipants';
import { RefreshControl } from 'react-native';
import { Ternary } from '../../common/Ternary';
import { WinnerCard } from './WinnerCard';
import { NoActiveDraw } from '../draw/NoActiveDraw';
import { formatMonth, formatMonthWithTime } from '@/src/utils/helper/formatMonth';

export function HomeScreen() {
  const { data: draw, refetch: refetchDraw, isFetching: isDrawLoading } = useCurrentDraw();
  const {
    data: luckyNumbers,
    isFetching: isLuckyLoading,
    refetch: refetchLuckyNumbers,
  } = useCurrentDrawNumbers();

  const displayMonth = formatMonth(draw?.month || '');

  const declarationDate = formatMonthWithTime(draw?.endDate || 'To be announced');

  const declarationTime = '6:00 PM';

  const onRefresh = useCallback(async () => {
    try {
      await Promise.all([refetchDraw(), refetchLuckyNumbers()]);
    } finally {
    }
  }, [refetchDraw, refetchLuckyNumbers]);

  if (!draw) {
    return <NoActiveDraw />;
  }
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: ({ back }) => <CustomHeader back={!!back} />,
        }}
      />
      <ScrollView
        flex={1}
        refreshControl={
          <RefreshControl refreshing={isLuckyLoading || isDrawLoading} onRefresh={onRefresh} />
        }
        bg="$background"
        showsVerticalScrollIndicator={false}
        style={{
          paddingBottom: 60,
        }}>
        <YStack gap="$6">
          {/* HERO SECTION - Eye-catching Prize Display */}
          <Ternary
            condition={!!draw?.winner || !!draw?.isWinnerDecleared}
            ifTrue={<WinnerCard />}
            ifFalse={
              <Card
                elevate
                bordered
                onPress={() => router.push(`/draw/${draw.id}`)}
                paddingBlock="$8"
                paddingInline="$6"
                marginHorizontal={20}
                marginTop={20}
                borderWidth={1}
                overflow="hidden"
                position="relative">
                {/* Background Gradient Overlay */}

                <YStack gap="$5" items="center" z={1}>
                  {/* Status Badge */}
                  <XStack flex={1} flexDirection="column" gap="$4" items="center">
                    <Card themeInverse paddingInline="$3.5" paddingBlock="$2" rounded="$10">
                      <Text fontSize={12} fontWeight="700" letterSpacing={0.5}>
                        ⚡ LIVE
                      </Text>
                    </Card>
                    <View>
                      <Text fontSize={18} fontWeight="900" textTransform="uppercase">
                        {displayMonth}
                      </Text>
                    </View>
                  </XStack>

                  {/* Prize Amount - Mitemsn Focus */}
                  <YStack gap="$2" items="center">
                    <Text
                      fontSize={15}
                      fontWeight="700"
                      textTransform="uppercase"
                      letterSpacing={2}>
                      Grand Prize
                    </Text>
                    <H1 fontSize={64} fontWeight="900" lineHeight={68} letterSpacing={0}>
                      ₹&nbsp;{draw?.prize?.amount}
                    </H1>
                    <Paragraph size="$5" maxW={280} lineHeight={22}>
                      {draw?.prize?.description}
                    </Paragraph>
                  </YStack>
                  <ContinuousShuffleCounter luckyNumbers={luckyNumbers || []} />
                  {/* Declaration Date & Time */}
                  <Card
                    themeInverse
                    paddingBlock="$4"
                    paddingInline="$5"
                    borderRadius="$4"
                    width="100%"
                    borderWidth={1}
                    borderColor="$blue5">
                    <YStack gap="$3" items="center">
                      <Text
                        fontSize={12}
                        fontWeight="600"
                        textTransform="uppercase"
                        letterSpacing={1}>
                        Winner Announcement
                      </Text>
                      <YStack gap="$1" items="center">
                        <Text fontSize={18} fontWeight="700">
                          {declarationDate}
                        </Text>
                        <XStack gap="$2" items="center">
                          <Circle size={6} />
                          <Text fontSize={16} fontWeight="600">
                            {declarationTime}
                          </Text>
                          <Circle size={6} />
                        </XStack>
                      </YStack>
                    </YStack>
                  </Card>
                </YStack>
              </Card>
            }
          />

          {/* Rest of the content */}
          <YStack gap="$6" paddingInline={20}>
            {/* Stats Grid */}
            <YStack gap="$3">
              <XStack gap="$3">
                <Card flex={1} bordered paddingBlock="$5" paddingInline="$4" borderWidth={1}>
                  <YStack items="center" justify={'center'} gap="$2">
                    <Text fontSize={11} fontWeight="500" color="gray" textTransform="uppercase">
                      Entry Fee
                    </Text>
                    <Text fontSize={28} fontWeight="700" letterSpacing={-1}>
                      ₹{draw?.entryFee}
                    </Text>
                  </YStack>
                </Card>

                <Card flex={1} bordered paddingBlock="$5" paddingInline="$4" borderWidth={1}>
                  <YStack items="center" justify={'center'} gap="$2">
                    <Text fontSize={11} fontWeight="500" color="gray" textTransform="uppercase">
                      Max Number
                    </Text>
                    <Text fontSize={28} fontWeight="700" letterSpacing={-1}>
                      {draw?.endRange}
                    </Text>
                  </YStack>
                </Card>
              </XStack>

              <Card bordered paddingBlock="$5" paddingInline="$4" borderWidth={1}>
                <XStack justify="space-between" items="center">
                  <Text fontSize={11} fontWeight="500" color="gray" textTransform="uppercase">
                    Number Range
                  </Text>
                  <Text fontSize={15} fontWeight="600">
                    {draw?.startRange} - {draw?.endRange}
                  </Text>
                </XStack>
              </Card>
            </YStack>

            {/* Recent Participants */}
            <RecentDrawParticipants />
            {/* Bottom Notice */}
            <Card
              themeInverse
              bordered
              paddingBlock="$4"
              paddingInline="$5"
              borderWidth={1}
              marginTop="$2">
              <Text fontSize={16} style={{ textAlign: 'center' }} lineHeight={20}>
                Limited numbers available. Results announced promptly after draw ends. i.e{' '}
                {draw?.endDate.split('T')[0]} at 6:00pm
              </Text>
            </Card>
          </YStack>
        </YStack>
      </ScrollView>
    </>
  );
}
