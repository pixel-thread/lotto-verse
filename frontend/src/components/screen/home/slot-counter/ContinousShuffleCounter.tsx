// ContinuousShuffleCounter.tsx
import React, { useState, useEffect, useRef } from 'react';
import { YStack, XStack } from 'tamagui';
import { ShufflingDigit } from './ShufflingDigit';
import { useCurrentDraw } from '@/src/hooks/draw/useCurrentDraw';

interface NumberData {
  id: string;
  number: number;
}

export function ContinuousShuffleCounter({ luckyNumbers }: { luckyNumbers: NumberData[] }) {
  const [numbers] = useState<NumberData[]>(luckyNumbers);
  const { data: draw } = useCurrentDraw();
  const winner = draw?.winner;
  const winnerNumber = winner?.number;
  const isStopped = draw?.isWinnerDecleared;
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const endRangeDigit = draw?.endRange?.toString()?.length || 4;

  // Filter lucky numbers <= endRange
  const filteredLuckyNumbers = numbers
    .map((item) => item.number)
    .filter((num) => num <= (draw?.endRange ?? Number.MAX_SAFE_INTEGER));

  // Extract unique digits from filtered lucky numbers
  const uniqueDigitsSet = new Set<string>();
  filteredLuckyNumbers.forEach((num) => {
    num
      .toString()
      .split('')
      .forEach((d) => uniqueDigitsSet.add(d));
  });
  const shuffleDigits = Array.from(uniqueDigitsSet);

  // Determine display number (winner or cycle)
  const displayNumber =
    isStopped && winnerNumber !== undefined ? winnerNumber : numbers[currentIndex]?.number || 0;

  // Pad number string with leading zeros to match endRangeDigit length
  const paddedNumber = displayNumber.toString().padStart(endRangeDigit, '0');

  const digits = paddedNumber.split('');

  useEffect(() => {
    if (!isStopped) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % numbers.length);
      }, 100000); // Long interval for continuous shuffle

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [isStopped, numbers.length]);

  return (
    <YStack gap="$5" items="center" paddingBlock="$1">
      <YStack gap="$3" items="center" paddingInline="$4">
        <XStack gap="$2" items="center">
          {digits.map((digit, index) => (
            <ShufflingDigit
              key={`${isStopped ? 'winner' : currentIndex}-${index}-${digit}`}
              targetDigit={digit}
              index={index}
              isStopped={isStopped || false}
              shuffleDigits={shuffleDigits} // Pass allowed digits to shuffle
            />
          ))}
        </XStack>
      </YStack>
    </YStack>
  );
}
