import React, { useState, useCallback, memo, useMemo } from 'react';
import { Button, Card, Input, Paragraph, Spinner, Text, XStack, YStack } from 'tamagui';
import { toast } from 'sonner-native';
import { useMutation } from '@tanstack/react-query';
import http from '@/src/utils/http';
import { LUCKY_NUMBER_ENDPOINTS } from '@/src/lib/endpoints/lucky-number';
import { LuckyNumbersT } from '@/src/types/lucky-number';
import { Ternary } from '@/src/components/common/Ternary';
import { router } from 'expo-router';
import { useCurrentDraw } from '@/src/hooks/draw/useCurrentDraw';

type Props = {
  onNumberChange?: (number: LuckyNumbersT) => void;
};

export const SearchNumberTab = memo(({ onNumberChange }: Props) => {
  const [searchNumber, setSearchNumber] = useState('');
  const { data: draw } = useCurrentDraw();
  const [searchedNumber, setSearchedNumber] = useState<LuckyNumbersT | null>(null);
  // Only get the data we need, don't track isFetching
  const endRange = draw?.endRange || 999;
  const startRange = draw?.startRange || 1;
  // Memoize computed values
  const maxLength = useMemo(() => String(endRange || 999).length, [endRange]);
  const placeholder = useMemo(() => `Enter ${startRange}-${endRange}`, [startRange, endRange]);

  // Memoize the success handler
  const handleSuccess = useCallback(
    (data: { success: boolean; message: string; data: LuckyNumbersT[] | null }) => {
      if (data?.success) {
        if (data.data && data.data.length > 0) {
          const number = data.data[0];
          if (!number.isPurchased) {
            setSearchedNumber(number);
            onNumberChange && onNumberChange(number);
            return data;
          }
          setSearchedNumber(number);
          toast.error('Number is purchase by another user', {
            duration: 5000,
            position: 'top-center',
          });
          return number;
        }
        toast.error('Number not found');
        return;
      }
      toast.error(data.message);
      return data;
    },
    []
  );

  const { mutate: check, isPending: isChecking } = useMutation({
    mutationFn: (searchNumber: string) =>
      http.post<LuckyNumbersT[]>(LUCKY_NUMBER_ENDPOINTS.POST_SEARCH_LUCKY_NUMBER, {
        query: searchNumber,
      }),
    onSuccess: handleSuccess,
  });

  // Memoize the text change handler
  const onTextChange = useCallback((text: string) => {
    setSearchNumber(text);
    setSearchedNumber(null);
  }, []);

  // Memoize the check handler
  const handleCheck = useCallback(() => {
    if (searchNumber.trim() !== '') {
      check(searchNumber);
    }
  }, [check, searchNumber]);

  const onConfirmSelection = useCallback(() => {
    if (searchedNumber?.isPurchased) {
      toast.error('This number has already been purchased');
      return;
    }
    router.push(`/draw/checkout?numberId=${searchedNumber?.id}`);
  }, []);

  return (
    <Card padded>
      <YStack gap="$4" width="100%">
        <Paragraph size="$2">Enter a specific number to check if it's available</Paragraph>
        <XStack gap="$3" items="center">
          <Input
            flex={1}
            size="$5"
            placeholder={placeholder}
            keyboardType="numeric"
            value={searchNumber}
            onChangeText={onTextChange}
            maxLength={maxLength}
            borderWidth={2}
            borderColor="$borderColor"
            focusStyle={{
              borderColor: '$blue9',
            }}
          />
        </XStack>

        {searchedNumber && (
          <Card
            themeShallow
            padding="$4"
            rounded="$6"
            bordered
            themeInverse={!searchedNumber.isPurchased}>
            <YStack gap="$2" items="center">
              <Text fontSize="$3" textTransform="uppercase" fontWeight="700">
                Selected Number
              </Text>
              <Text fontSize="$10" fontWeight="900">
                {searchNumber ?? '—'}
              </Text>
              <Text fontSize="$2">
                {searchedNumber.isPurchased ? 'This number is not available' : 'Ready to buy'}
              </Text>
            </YStack>
          </Card>
        )}

        <Button
          size="$5"
          themeInverse={searchNumber !== ''}
          onPress={!!searchedNumber?.id ? onConfirmSelection : handleCheck}
          disabled={!searchNumber || isChecking}>
          <Ternary
            condition={isChecking}
            ifTrue={<Spinner size="small" color="white" />}
            ifFalse={
              <Text fontWeight="700" color="white">
                {searchedNumber?.isPurchased
                  ? 'Not Available'
                  : !searchedNumber?.isPurchased && searchedNumber
                    ? 'Buy'
                    : 'Check'}
              </Text>
            }
          />
        </Button>
      </YStack>
    </Card>
  );
});

SearchNumberTab.displayName = 'SearchNumberTab';
