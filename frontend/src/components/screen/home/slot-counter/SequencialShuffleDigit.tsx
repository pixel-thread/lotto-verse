import React, { useState, useEffect, useRef } from 'react';
import { YStack, XStack, Text } from 'tamagui';
import { Animated, Easing } from 'react-native';

interface NumberData {
  id: string;
  number: number;
}

interface AnimatedDigitProps {
  targetDigit: string;
  index: number;
  isActive: boolean;
  isStopped: boolean;
}

function ShufflingDigit({ targetDigit, index, isActive, isStopped }: AnimatedDigitProps) {
  const [displayDigits, setDisplayDigits] = useState<string[]>([]);
  const translateY = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<any>(null);

  const digitHeight = 80;

  useEffect(() => {
    if (isStopped) {
      // Stop shuffle and animate to winner digit
      setDisplayDigits([
        ...Array.from({ length: 10 }, () => Math.floor(Math.random() * 10).toString()),
        targetDigit,
      ]);
      translateY.setValue(0);

      const finalPosition = -10 * digitHeight;
      animationRef.current = Animated.timing(translateY, {
        toValue: finalPosition,
        duration: 2500 + index * 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      });

      animationRef.current.start();
      return () => animationRef.current?.stop();
    }

    if (isActive && !isStopped) {
      // Animate only when active
      const randomDigits = Array.from({ length: 12 }, () =>
        Math.floor(Math.random() * 10).toString()
      );
      setDisplayDigits(randomDigits);

      translateY.setValue(0);
      const distance = -randomDigits.length * digitHeight;

      animationRef.current = Animated.timing(translateY, {
        toValue: distance,
        duration: 1500,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      });

      animationRef.current.start();

      return () => animationRef.current?.stop();
    }
  }, [isActive, isStopped, targetDigit]);

  return (
    <YStack
      width="auto"
      height={digitHeight}
      minW={70}
      overflow="hidden"
      rounded="$3"
      borderWidth={1}>
      <Animated.View style={{ transform: [{ translateY }] }}>
        {displayDigits.map((digit, idx) => (
          <YStack key={idx} height={digitHeight} ai="center" jc="center">
            <Text fontSize={72} fontWeight="900">
              {digit}
            </Text>
          </YStack>
        ))}
      </Animated.View>
    </YStack>
  );
}

export function SequentialShuffleCounter({
  luckyNumbers,
  winnerNumber,
}: {
  luckyNumbers: NumberData[];
  winnerNumber?: number;
}) {
  const [numbers] = useState<NumberData[]>(luckyNumbers);
  const [isStopped, setIsStopped] = useState(false);
  const [currentDigitIndex, setCurrentDigitIndex] = useState(0);

  const displayNumber =
    isStopped && winnerNumber !== undefined ? winnerNumber : numbers[0]?.number || 0;

  const paddedNumber = displayNumber.toString().padStart(5, '0');
  const digits = paddedNumber.split('');

  useEffect(() => {
    if (isStopped) return;

    const interval = setInterval(() => {
      setCurrentDigitIndex((prev) => (prev + 1) % digits.length);
    }, 1600); // 1.6s per digit — slower & smooth

    return () => clearInterval(interval);
  }, [digits.length, isStopped]);

  return (
    <YStack gap="$5" ai="center" paddingBlock="$8">
      <XStack gap="$2" ai="center">
        {digits.map((digit, index) => (
          <ShufflingDigit
            key={`${isStopped ? 'winner' : 'running'}-${index}-${digit}`}
            targetDigit={digit}
            index={index}
            isActive={!isStopped && currentDigitIndex === index}
            isStopped={isStopped}
          />
        ))}
      </XStack>
    </YStack>
  );
}
