import React from 'react';
import Reanimated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

export const SkeletonPulse = ({ style }: { style?: any }) => {
  const animatedOpacity = useAnimatedStyle(() => {
    return {
      opacity: withRepeat(
        withSequence(
          withTiming(0.3, { duration: 700, easing: Easing.linear }),
          withTiming(1, { duration: 700, easing: Easing.linear })
        ),
        -1,
        true
      ),
    };
  });

  return (
    <Reanimated.View
      style={[style, animatedOpacity, { backgroundColor: '#e6e6e6', borderRadius: 7 }]}
    />
  );
};
