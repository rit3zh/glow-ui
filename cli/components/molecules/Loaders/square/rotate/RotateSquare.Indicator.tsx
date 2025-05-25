import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import Svg, { Rect } from "react-native-svg";

// Make the entire SVG animated
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export const RotatingSquaresSpinner = () => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Create a continuous rotation animation
    rotation.value = withRepeat(
      withTiming(100, {
        // Full 360 rotation
        duration: 1000,
        easing: Easing.linear,
      }),
      -10 // Infinite repeat
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      <AnimatedSvg width={60} height={60} style={animatedStyle}>
        <Rect x={10} y={10} width={10} height={10} fill="#FF5722" />
        <Rect x={40} y={10} width={10} height={10} fill="#FF5722" />
        <Rect x={10} y={40} width={10} height={10} fill="#FF5722" />
        <Rect x={40} y={40} width={10} height={10} fill="#FF5722" />
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
