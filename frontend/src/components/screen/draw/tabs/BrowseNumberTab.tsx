import React, { useState } from 'react';
import { View, Paragraph, Button, Text, YStack, XStack } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { Ternary } from '@components/common/Ternary';
import { LuckyNumbersT } from '@/src/types/lucky-number';
import useCurrentDrawNumbers from '@/src/hooks/draw/useCurrentDrawNumbers';
import { DrawNumberSkeleton } from '../skeleton/DrawNumberSkeleton';

type Props = {
  number: LuckyNumbersT | null;
  onNumberChange: (number: LuckyNumbersT | null) => void;
};

export const BrowseNumbersTab = ({
  number: selectedNumber,
  onNumberChange: setSelectedNumber,
}: Props) => {
  const [userPurchasedNumber, setUserPurchasedNumber] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const { meta, isFetching: isLuckyNumbersFetching, data } = useCurrentDrawNumbers({ page });

  const luckyNumbers = data || null;

  const toggleNumberSelection = (number: LuckyNumbersT) => {
    setSelectedNumber(selectedNumber === number ? null : number);
  };

  const handlePageChange = (value: string) => {
    if (value === 'next' && meta?.hasNextPage) {
      setPage(page + 1);
    }
    if (value === 'previous' && meta?.hasPreviousPage) {
      setPage(page - 1);
    }
  };

  if (isLuckyNumbersFetching) {
    return <DrawNumberSkeleton />;
  }

  return (
    <YStack gap="$4" width="100%">
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
                disabled={item.isPurchased || userPurchasedNumber !== null}>
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

      {/* Pagination Controls */}
      <XStack justify="space-between" items="center" gap="$3">
        <Button
          size="$3"
          rounded="$6"
          variant="outlined"
          width="auto"
          height={56}
          disabled={!meta?.hasPreviousPage}
          onPress={() => handlePageChange('previous')}>
          <Ionicons color={meta?.hasPreviousPage ? '#000' : '#ccc'} size={24} name="chevron-back" />
        </Button>

        <Text fontSize="$3" color="gray">
          Page {page} of {meta?.totalPages || 1}
        </Text>

        <Button
          size="$3"
          rounded="$6"
          width="auto"
          variant="outlined"
          height={56}
          disabled={!meta?.hasNextPage}
          onPress={() => handlePageChange('next')}>
          <Ionicons name="chevron-forward" color={meta?.hasNextPage ? '#000' : '#ccc'} size={24} />
        </Button>
      </XStack>
    </YStack>
  );
};
