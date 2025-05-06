import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from "react-native-reanimated";
import type { SpinnerSegmentsProps } from "./SegmentSpinner.types";

// Animated components
const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const SpinnerSegments: React.FC<SpinnerSegmentsProps> = ({
  size = 40,
  color = "#fff",
  segmentColor = "#fff",
  centerColor = "#fff",
  speed = 900,
  segmentCount = 4,
  pulseSize = 1.3,
}) => {
  const rotation = useSharedValue(0);
  const centerScale = useSharedValue(1);

  // Rotation animation
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: speed,
        easing: Easing.linear,
      }),
      -1
    );
  }, [speed]);

  // Center pulse animation
  useEffect(() => {
    centerScale.value = withRepeat(
      withSequence(
        withTiming(pulseSize, {
          duration: 400,
          easing: Easing.out(Easing.ease),
        }),
        withTiming(1, { duration: 400, easing: Easing.in(Easing.ease) })
      ),
      -1
    );
  }, [pulseSize]);

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const centerProps = useAnimatedProps(() => ({
    r: 5 * centerScale.value,
  }));

  const segmentArray = Array.from({ length: segmentCount });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Pulsing center circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={5}
          fill={centerColor}
          animatedProps={centerProps}
        />
      </Svg>

      {/* Rotating segments */}
      <AnimatedView style={[styles.spinner, rotateStyle]}>
        <Svg width={size} height={size}>
          {segmentArray.map((_, i) => {
            const angle = (360 / segmentCount) * i;
            return (
              <Circle
                key={i}
                cx={size / 2}
                cy={size / 8}
                r={4}
                fill={segmentColor}
                transform={`rotate(${angle}, ${size / 2}, ${size / 2})`}
              />
            );
          })}
        </Svg>
      </AnimatedView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});
