import React, { useState } from 'react';
import { View, Paragraph, Button, Text, YStack, XStack, Card } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { DrawNumberSectionSkeleton, DrawNumberSkeleton } from './skeleton/DrawNumberSkeleton';
import { Ternary } from '../../common/Ternary';
import { useCurrentDraw } from '@/src/hooks/draw/useCurrentDraw';
import useCurrentDrawNumbers from '@/src/hooks/draw/useCurrentDrawNumbers';
import { router } from 'expo-router';

type LuckyNumbersT = { number: number; id: string; isPurchased: boolean };

export const DrawNumberSection = () => {
  const [selectedNumber, setSelectedNumber] = useState<LuckyNumbersT | null>(null);
  const [userPurchasedNumber, setUserPurchasedNumber] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const { isFetching: isDrawFetching, data: draw } = useCurrentDraw();

  const totalCost = selectedNumber ? draw?.entryFee : 0;

  const { meta, isFetching: isLuckyNumbersFetching, data } = useCurrentDrawNumbers({ page });

  const luckyNumbers = data || null;

  const toggleNumberSelection = (number: LuckyNumbersT) => {
    setSelectedNumber(selectedNumber === number ? null : number);
  };

  const handleBuyNumbers = () => {
    router.push(`/draw/checkout?number=${selectedNumber?.number}&id=${selectedNumber?.id}`);
  };

  const handlePageChange = (value: string) => {
    if (value === 'next' && meta?.hasNextPage) {
      setPage(page + 1);
    }
    if (value === 'previous' && meta?.hasPreviousPage) {
      setPage(page - 1);
    }
  };

  if (isDrawFetching && isLuckyNumbersFetching) {
    return <DrawNumberSectionSkeleton />;
  }

  if (!luckyNumbers) {
    return <DrawNumberSectionSkeleton />;
  }

  return (
    <>
      <Card>
        <YStack paddingInline="$6" paddingBlock="$6" rounded="$8" gap="$3">
          <Paragraph size="$8" fontWeight="700">
            Choose Your Lucky Number
          </Paragraph>
          <YStack gap="$2">
            <Paragraph size="$3" color="gray">
              Select one number from {draw?.startRange}-{draw?.endRange} • ₹{draw?.entryFee}
            </Paragraph>
            {userPurchasedNumber && (
              <Paragraph size="$3" fontWeight="600">
                ✓ You already have number #{userPurchasedNumber}
              </Paragraph>
            )}
          </YStack>

          {/* Selected Number Display */}
          {selectedNumber && (
            <YStack bg="$blue2" rounded="$6" gap="$2" items="center">
              <Paragraph size="$2" color="gray">
                Your Selection
              </Paragraph>
              <Text fontSize="$10" fontWeight="700" color="$black1">
                {selectedNumber.number ? selectedNumber.number : '000'}
              </Text>
            </YStack>
          )}

          {/* Modern Number Grid */}
          <YStack gap="$4">
            <XStack justify="space-between" items="center">
              <Paragraph size="$4" fontWeight="600">
                Available Numbers
              </Paragraph>
              <Paragraph size="$2" color="gray">
                {luckyNumbers?.filter((n) => !n.isPurchased).length} remaining
              </Paragraph>
            </XStack>
            <Ternary
              condition={isLuckyNumbersFetching}
              ifFalse={
                <View flexDirection="row" flexWrap="wrap" gap="$3" justify="center">
                  {luckyNumbers?.map((item) => (
                    <Button
                      key={item.id}
                      size="$4"
                      rounded="$6"
                      width={'auto'}
                      height={'auto'}
                      paddingBlock={20}
                      // animation="bouncy"
                      // scale={selectedNumber?.id === item.id ? 0.9 : 1}
                      bg={
                        selectedNumber?.id === item.id
                          ? '$black2'
                          : item.isPurchased || userPurchasedNumber
                            ? 'gray'
                            : 'gray'
                      }
                      borderColor={selectedNumber?.id === item.id ? 'black' : 'gray'}
                      borderWidth={2}
                      onPress={() =>
                        !item.isPurchased && !userPurchasedNumber && toggleNumberSelection(item)
                      }
                      disabled={item.isPurchased || userPurchasedNumber !== null}
                      // opacity={item.isPurchased || userPurchasedNumber ? 0.4 : 1}
                      // hoverStyle={{
                      //   scale: 1.05,
                      //   bg: selectedNumber?.id === item.id ? '$blue10' : 'gray',
                      // }}
                      // pressStyle={{
                      //   scale: 0.95,
                      // }}
                    >
                      <Text
                        fontSize="$5"
                        fontWeight="700"
                        color={
                          selectedNumber?.id === item.id
                            ? 'white'
                            : item.isPurchased || userPurchasedNumber
                              ? 'red'
                              : 'white'
                        }>
                        {item.number}
                      </Text>
                    </Button>
                  ))}
                </View>
              }
              ifTrue={<DrawNumberSkeleton />}
            />
          </YStack>
          {/* Modern Buy Button */}
          <XStack flex={1} flexDirection="row" items="center" justify="space-between" gap="$0">
            <Button
              size="$3"
              rounded="$6"
              variant="outlined"
              width="auto"
              height={56}
              // animation="bouncy"
              // disabled={!meta?.hasPreviousPage}
              // onPress={() => handlePageChange('previous')}
              // pressStyle={{
              //   scale: 0.98,
              // }}
            >
              <View>
                <Ionicons color={''} size={24} name="chevron-back" />
              </View>
            </Button>

            <Button
              size="$5"
              rounded="$6"
              themeInverse
              width="auto"
              fontWeight="700"
              height={56}
              onPress={handleBuyNumbers}
              disabled={!selectedNumber || userPurchasedNumber !== null}
              // animation="bouncy"
              // scale={!selectedNumber || userPurchasedNumber !== null ? 0.95 : 1}
              // opacity={!selectedNumber || userPurchasedNumber !== null ? 0.6 : 1}
              // pressStyle={{
              //   scale: 0.98,
              // }}
            >
              <Text fontSize="$5" fontWeight="700">
                {!selectedNumber
                  ? 'Select a Number'
                  : userPurchasedNumber
                    ? 'Already Purchased'
                    : `Buy #${selectedNumber.number} for ₹${totalCost}`}
              </Text>
            </Button>
            <Button
              size="$3"
              rounded="$6"
              width="auto"
              variant="outlined"
              height={56}
              disabled={!meta?.hasNextPage}
              onPress={() => handlePageChange('next')}
              // animation="bouncy"
              // pressStyle={{ scale: 0.98 }}
            >
              <Ionicons name="chevron-forward" color={'#000'} size={24} />
            </Button>
          </XStack>
        </YStack>
      </Card>
    </>
  );
};
