import React, { useState, useCallback, memo, useMemo } from 'react';
import { Button, Card, Input, Paragraph, Spinner, Text, XStack, YStack } from 'tamagui';
import { toast } from 'sonner-native';
import { useMutation } from '@tanstack/react-query';
import http from '@/src/utils/http';
import { LUCKY_NUMBER_ENDPOINTS } from '@/src/lib/endpoints/lucky-number';
import { LuckyNumbersT } from '@/src/types/lucky-number';
import { Ionicons } from '@expo/vector-icons';
import { DrawT } from '@/src/types/draw';
import { Ternary } from '@/src/components/common/Ternary';
import { router } from 'expo-router';

type Props = {
  onNumberChange: (number: LuckyNumbersT | null) => void;
  draw?: DrawT | null;
};

export const SearchNumberTab = memo(({ onNumberChange, draw }: Props) => {
  const [searchNumber, setSearchNumber] = useState('');
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
            onNumberChange(number); // Keep parent synced
            return data;
          }
          toast.success('Number is purchase by another user');
          return number;
        }
        toast.error('Number not found');
        onNumberChange(null);
        return;
      }
      toast.error(data.message);
      onNumberChange(null);
      return data;
    },
    [onNumberChange]
  );

  const { mutate: check, isPending: isChecking } = useMutation({
    mutationFn: (searchNumber: string) =>
      http.post<LuckyNumbersT[]>(LUCKY_NUMBER_ENDPOINTS.POST_SEARCH_LUCKY_NUMBER, {
        query: searchNumber,
      }),
    onSuccess: handleSuccess,
  });

  // Memoize the text change handler
  const onTextChange = useCallback(
    (text: string) => {
      onNumberChange(null);
      setSearchNumber(text);
      setSearchedNumber(null);
    },
    [onNumberChange]
  );

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

    if (searchedNumber) {
      onNumberChange(searchedNumber);
    }
  }, []);

  return (
    <YStack gap="$4" width="100%">
      <Paragraph size="$4" fontWeight="600">
        Check Number Availability
      </Paragraph>
      <Paragraph size="$2" color="gray">
        Enter a specific number to check if it's available
      </Paragraph>

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
        <Button
          size="$5"
          themeInverse={searchNumber !== ''}
          onPress={!!searchedNumber?.id ? onConfirmSelection : handleCheck}
          disabled={!searchNumber || isChecking}
          icon={<Ionicons name="search" size={20} color="white" />}>
          <Ternary
            condition={isChecking}
            ifTrue={<Spinner size="small" color="white" />}
            ifFalse={
              <Text fontWeight="700" color="white">
                {!!searchedNumber?.id ? 'Confirm' : 'Check'}
              </Text>
            }
          />
        </Button>
      </XStack>

      {searchedNumber && (
        <Card
          padding="$4"
          borderRadius="$6"
          borderWidth={2}
          borderColor={searchedNumber.isPurchased ? '$red8' : '$green8'}
          backgroundColor={searchedNumber.isPurchased ? '$red2' : '$green2'}>
          <YStack gap="$3" items="center">
            <Text fontSize="$10" fontWeight="900">
              {searchedNumber.number}
            </Text>
            <Paragraph
              size="$4"
              fontWeight="600"
              color={searchedNumber.isPurchased ? '$red11' : '$green11'}>
              {searchedNumber.isPurchased ? 'Already Purchased' : 'Available for Purchase'}
            </Paragraph>
          </YStack>
        </Card>
      )}
    </YStack>
  );
});

SearchNumberTab.displayName = 'SearchNumberTab';
