// components/LoadingIndicator.tsx
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const DOT_RADIUS = 6;
const DOT_SPACING = 20;
const DURATION = 450;

export const CircleLoadingIndicator: React.FC = () => {
  const progress1 = useSharedValue(0);
  const progress2 = useSharedValue(0);
  const progress3 = useSharedValue(0);

  useEffect(() => {
    progress1.value = withRepeat(
      withTiming(1, {
        duration: DURATION,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    setTimeout(() => {
      progress2.value = withRepeat(
        withTiming(1, {
          duration: DURATION,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      );
    }, 150);

    setTimeout(() => {
      progress3.value = withRepeat(
        withTiming(1, {
          duration: DURATION,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      );
    }, 300);
  }, []);

  const animatedProps1 = useAnimatedProps(() => ({
    cy: 12 - progress1.value * 5,
  }));

  const animatedProps2 = useAnimatedProps(() => ({
    cy: 12 - progress2.value * 5,
  }));

  const animatedProps3 = useAnimatedProps(() => ({
    cy: 12 - progress3.value * 5,
  }));

  return (
    <View style={styles.container}>
      <Svg width={80} height={24}>
        <AnimatedCircle
          cx={DOT_RADIUS}
          r={DOT_RADIUS}
          fill="#007AFF"
          animatedProps={animatedProps1}
        />
        <AnimatedCircle
          cx={DOT_RADIUS + DOT_SPACING}
          r={DOT_RADIUS}
          fill="#007AFF"
          animatedProps={animatedProps2}
        />
        <AnimatedCircle
          cx={DOT_RADIUS + 2 * DOT_SPACING}
          r={DOT_RADIUS}
          fill="#007AFF"
          animatedProps={animatedProps3}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
