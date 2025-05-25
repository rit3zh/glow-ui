// PulsingDots.tsx
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import type { PulsingDotsProps } from "./PlusingDots.types";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
export const PulsingDots: React.FC<PulsingDotsProps> = ({
  dotCount = 3,
  radius = 6,
  spacing = 25,
  duration = 800,
  color = "#00C896",
  gradient,
}): React.ReactNode & React.JSX.Element => {
  const opacities = Array.from({ length: dotCount }, () => useSharedValue(0.3));

  useEffect(() => {
    opacities.forEach((opacity, i) => {
      setTimeout(() => {
        opacity.value = withRepeat(
          withTiming(1, {
            duration,
            easing: Easing.inOut(Easing.ease),
          }),
          -1,
          true
        );
      }, i * 200);
    });
  }, []);

  const animatedProps = opacities.map((val) =>
    useAnimatedProps(() => ({ opacity: val.value }))
  );

  const totalWidth = radius * 2 + (dotCount - 1) * spacing;

  return (
    <View style={styles.container}>
      <Svg width={totalWidth} height={radius * 3}>
        <Defs>
          {gradient?.map((g, i) => (
            <LinearGradient
              key={i}
              id={`grad-${i}`}
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <Stop offset="0%" stopColor={g.from} />
              <Stop offset="100%" stopColor={g.to} />
            </LinearGradient>
          ))}
        </Defs>

        {animatedProps.map((props, i) => {
          const gradientId = gradient?.[i]
            ? `url(#grad-${i})`
            : gradient?.[0]
              ? `url(#grad-0)`
              : color;

          return (
            <AnimatedCircle
              key={i}
              cx={radius + i * spacing}
              cy={radius * 1.5}
              r={radius}
              fill={gradientId}
              animatedProps={props}
            />
          );
        })}
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
