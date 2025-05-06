import React from "react";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { View, StyleSheet } from "react-native";

const AnimatedView = Animated.createAnimatedComponent(View);

interface SpinnerArcProps {
  size?: number;
  colorStart?: string;
  colorEnd?: string;
  strokeWidth?: number;
  speed?: number;
  backgroundColor?: string;
  arcLength?: number; // Customizable arc length (stroke dash array)
}

export const SpinnerArc: React.FC<SpinnerArcProps> = ({
  size = 40,
  colorStart = "#FF4E4E",
  colorEnd = "#FF7A00",
  strokeWidth = 4,
  speed = 1000,
  backgroundColor = "#ddd",
  arcLength = 90,
}) => {
  const rotation = useSharedValue(0);

  // Rotation animation for spinner
  rotation.value = withRepeat(
    withTiming(360, {
      duration: speed,
      easing: Easing.linear,
    }),
    -1
  );

  // Animated style for rotating the arc
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <AnimatedView
      style={[styles.loader, { width: size, height: size }, animatedStyle]}
    >
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - strokeWidth}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Arc with Gradient */}
        <Defs>
          <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colorStart} />
            <Stop offset="100%" stopColor={colorEnd} />
          </LinearGradient>
        </Defs>

        <Circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - strokeWidth}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={arcLength}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  loader: {
    justifyContent: "center",
    alignItems: "center",
  },
});
