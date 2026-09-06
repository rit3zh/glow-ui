import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withDelay,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import type { IPulsingDots } from "./types";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const STAGGER_DELAY = 200;

interface DotProps {
  index: number;
  radius: number;
  spacing: number;
  duration: number;
  fill: string;
}

/**
 * A single dot owns its animation so the number of hooks stays constant no
 * matter how many dots are rendered.
 */
const Dot: React.FC<DotProps> = ({ index, radius, spacing, duration, fill }) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withDelay(
      index * STAGGER_DELAY,
      withRepeat(
        withTiming(1, {
          duration,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true,
      ),
    );
  }, [duration, index, opacity]);

  const animatedProps = useAnimatedProps(() => ({ opacity: opacity.value }));

  return (
    <AnimatedCircle
      cx={radius + index * spacing}
      cy={radius * 1.5}
      r={radius}
      fill={fill}
      animatedProps={animatedProps}
    />
  );
};

export const PulsingDots: React.FC<IPulsingDots> = ({
  dotCount = 3,
  radius = 6,
  spacing = 25,
  duration = 800,
  color = "#00C896",
  gradient,
}): React.ReactNode & React.JSX.Element => {
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

        {Array.from({ length: dotCount }, (_, i) => {
          const gradientId = gradient?.[i]
            ? `url(#grad-${i})`
            : gradient?.[0]
              ? `url(#grad-0)`
              : color;

          return (
            <Dot
              key={i}
              index={i}
              radius={radius}
              spacing={spacing}
              duration={duration}
              fill={gradientId}
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
