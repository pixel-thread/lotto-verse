import React, { memo, useCallback, useMemo, useState } from 'react';
import { Button, Card, Input, Paragraph, Spinner, Text, XStack, YStack } from 'tamagui';
import { toast } from 'sonner-native';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';

import http from '@/src/utils/http';
import { LUCKY_NUMBER_ENDPOINTS } from '@/src/lib/endpoints/lucky-number';
import { LuckyNumbersT } from '@/src/types/lucky-number';
import { Ternary } from '@/src/components/common/Ternary';
import { useCurrentDraw } from '@/src/hooks/draw/useCurrentDraw';
import { useAuth } from '@/src/hooks/auth/useAuth';
import { logger } from '@/src/utils/logger';

type Props = {
  onNumberChange?: (number: LuckyNumbersT) => void;
};

type BackendResponse = {
  success: boolean;
  message: string;
  data: LuckyNumbersT[] | null;
};

export const SearchNumberTab = memo(({ onNumberChange }: Props) => {
  const { user } = useAuth();
  const { data: draw } = useCurrentDraw();

  const [searchNumber, setSearchNumber] = useState('');
  const [searchedNumber, setSearchedNumber] = useState<LuckyNumbersT | null>(null);
  const [selectedNumberId, setSelectedNumberId] = useState<string | null>(null);

  const startRange = draw?.startRange ?? 1;
  const endRange = draw?.endRange ?? 999;

  const maxLength = useMemo(() => String(endRange).length, [endRange]);
  const placeholder = useMemo(() => `Enter ${startRange}-${endRange}`, [startRange, endRange]);

  const resetSelection = useCallback(() => {
    setSearchedNumber(null);
    setSelectedNumberId(null);
  }, []);

  const handleSuccess = useCallback(
    (response: BackendResponse) => {
      if (!response?.success || !response.data?.length) {
        toast.error(response?.message || 'Number not found');
        resetSelection();
        return;
      }

      const number = response.data[0];
      setSearchedNumber(number);

      if (number.isPurchased) {
        setSelectedNumberId(null);
        toast.error('This number is already purchased');
        return;
      }

      setSelectedNumberId(number.id);
      onNumberChange?.(number);
    },
    [onNumberChange, resetSelection]
  );

  const { mutate: checkNumber, isPending } = useMutation({
    mutationFn: (query: string) =>
      http.post<LuckyNumbersT[]>(LUCKY_NUMBER_ENDPOINTS.POST_SEARCH_LUCKY_NUMBER, { query }),
    onSuccess: handleSuccess,
  });

  const onTextChange = useCallback(
    (text: string) => {
      setSearchNumber(text);
      resetSelection();
    },
    [resetSelection]
  );

  const handleCheck = useCallback(() => {
    if (!searchNumber.trim()) return;
    checkNumber(searchNumber);
  }, [checkNumber, searchNumber]);

  const handleBuy = useCallback(() => {
    if (!selectedNumberId) {
      logger.error('Buy pressed without selected number', {
        userId: user?.id,
        searchNumber,
      });
      return;
    }

    logger.info('Navigating to checkout', {
      numberId: selectedNumberId,
      userId: user?.id,
      number: searchNumber,
    });

    router.push(`/draw/checkout?numberId=${selectedNumberId}`);
  }, [selectedNumberId, user?.id, searchNumber]);

  const canBuy = !!selectedNumberId;

  return (
    <Card padded>
      <YStack gap="$4" width="100%">
        <Paragraph size="$2">Enter a specific number to check if it&apos;s available</Paragraph>

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
            focusStyle={{ borderColor: '$blue9' }}
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
                {searchedNumber.number}
              </Text>

              <Text fontSize="$2">
                {searchedNumber.isPurchased ? 'This number is not available' : 'Ready to buy'}
              </Text>
            </YStack>
          </Card>
        )}

        <Button
          size="$5"
          themeInverse={canBuy}
          disabled={!searchNumber || isPending}
          onPress={canBuy ? handleBuy : handleCheck}>
          <Ternary
            condition={isPending}
            ifTrue={<Spinner size="small" color="white" />}
            ifFalse={<Text>{canBuy ? 'Buy' : 'Check'}</Text>}
          />
        </Button>
      </YStack>
    </Card>
  );
});

SearchNumberTab.displayName = 'SearchNumberTab';
