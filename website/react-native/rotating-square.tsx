import React, { useEffect } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import Svg, { Rect } from "react-native-svg";
import type { IRotatingSquaresSpinner } from "./types";
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export const RotatingSquaresSpinner: React.FC<IRotatingSquaresSpinner> = ({
  color = "#FF5722",
  squareSize = 10,
  spacing = 20,
  size = 60,
  duration = 1000,
  repeatCount = -1,
  style,
}) => {
  const rotation = useSharedValue<number>(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration,
        easing: Easing.linear,
      }),
      repeatCount,
    );
  }, [duration, repeatCount]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const half = size / 2;
  const offset = squareSize / 2;

  return (
    <View style={[styles.container, style]}>
      <AnimatedSvg width={size} height={size} style={animatedStyle}>
        <Rect
          x={half - spacing - offset}
          y={half - spacing - offset}
          width={squareSize}
          height={squareSize}
          fill={color}
        />
        <Rect
          x={half + spacing - offset}
          y={half - spacing - offset}
          width={squareSize}
          height={squareSize}
          fill={color}
        />
        <Rect
          x={half - spacing - offset}
          y={half + spacing - offset}
          width={squareSize}
          height={squareSize}
          fill={color}
        />
        <Rect
          x={half + spacing - offset}
          y={half + spacing - offset}
          width={squareSize}
          height={squareSize}
          fill={color}
        />
      </AnimatedSvg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
