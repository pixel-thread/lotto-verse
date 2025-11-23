import React, { useEffect } from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
  Easing,
  SharedValue,
} from 'react-native-reanimated';

type DotProps = {
  size?: number;
  color?: string;
  delay: number;
};

const useDotAnimation = (delay: number): SharedValue<number> => {
  const progress = useSharedValue(0.7);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.3, {
            duration: 450,
            easing: Easing.bezier(0.4, 0, 0.2, 1), // super smooth out/in
          }),
          withTiming(0.7, {
            duration: 450,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
          })
        ),
        -1,
        false
      )
    );
  }, [delay, progress]);

  return progress;
};

const Dot: React.FC<DotProps> = ({ size = 15, color = '#000', delay }) => {
  const progress = useDotAnimation(delay);

  const style = useAnimatedStyle(() => ({
    opacity: progress.value, // fades smoothly
    transform: [{ scale: progress.value }], // expands & collapses softly
  }));

  const dotStyle: StyleProp<ViewStyle> = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: color,
  };

  return <Animated.View style={[dotStyle, style]} />;
};

export const LoadingScreen: React.FC = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
        }}>
        <Dot delay={0} />
        <Dot delay={180} />
        <Dot delay={360} />
      </View>
    </View>
  );
};
