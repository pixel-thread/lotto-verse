import React, { useState, useEffect, useRef } from 'react';
import { YStack, Text } from 'tamagui';
import { Animated, Easing } from 'react-native';

interface AnimatedDigitProps {
  targetDigit: string;
  index: number;
  isStopped: boolean;
}

// Single digit animator with continuous shuffle
export function ShufflingDigit({ targetDigit, index, isStopped }: AnimatedDigitProps) {
  const [displayDigits, setDisplayDigits] = useState<string[]>([]);
  const translateY = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<any>(null);
  const loopRef = useRef<any>(null);

  const direction = index % 2 === 0 ? 1 : 1;
  const digitHeight = 80;
  const scrollLength = 10; // number of digits in one loop
  const duration = 12000; // make it slow & smooth

  useEffect(() => {
    if (!isStopped) {
      const randomDigits = Array.from({ length: scrollLength }, () =>
        Math.floor(Math.random() * 10).toString()
      );

      // duplicate the sequence for seamless looping
      const repeatedDigits = [...randomDigits, ...randomDigits];

      setDisplayDigits(repeatedDigits);

      translateY.setValue(0);

      const distance = direction * -(randomDigits.length * digitHeight);

      // create a manual loop using Animated.timing + reset
      const animate = () => {
        translateY.setValue(0);
        loopRef.current = Animated.timing(translateY, {
          toValue: distance,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        });
        loopRef.current.start(({ finished }: { finished: boolean }) => {
          if (finished) animate(); // restart seamlessly
        });
      };

      animate();

      return () => {
        loopRef.current?.stop();
      };
    } else {
      // Stop shuffle and animate to winner digit
      loopRef.current?.stop();

      const baseDigits = Array.from({ length: 10 }, () =>
        Math.floor(Math.random() * 10).toString()
      );

      setDisplayDigits([...baseDigits, targetDigit]);
      translateY.setValue(0);

      const delay = index * 200;
      const finalPosition = direction * -baseDigits.length * digitHeight;

      animationRef.current = Animated.sequence([
        Animated.delay(delay),
        Animated.timing(translateY, {
          toValue: finalPosition,
          duration: 3000 + index * 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]);

      animationRef.current.start();

      return () => animationRef.current?.stop();
    }
  }, [targetDigit, index, isStopped, direction]);

  return (
    <YStack
      width="auto"
      height={digitHeight}
      minW={70}
      overflow="hidden"
      rounded="$3"
      borderColor="$borderColor"
      borderWidth={1}>
      <Animated.View style={{ transform: [{ translateY }] }}>
        {displayDigits.map((digit, idx) => (
          <YStack key={idx} height={digitHeight} items="center" justify="center">
            <Text fontSize={72} fontWeight="900">
              {digit}
            </Text>
          </YStack>
        ))}
      </Animated.View>
    </YStack>
  );
}
