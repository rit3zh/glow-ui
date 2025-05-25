// SpinnerSegments.tsx
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

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const SpinnerSegments: React.FC = () => {
  const rotation = useSharedValue(0);
  const centerScale = useSharedValue(1);

  // Rotation animation
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 900,
        easing: Easing.linear,
      }),
      -1
    );
  }, []);

  // Center pulse animation
  useEffect(() => {
    centerScale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 400, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 400, easing: Easing.in(Easing.ease) })
      ),
      -1
    );
  }, []);

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const centerProps = useAnimatedProps(() => ({
    r: 5 * centerScale.value,
  }));

  return (
    <View style={styles.container}>
      <Svg width={40} height={40}>
        {/* Pulsing center circle */}
        <AnimatedCircle
          cx={20}
          cy={20}
          r={5}
          fill="#fff"
          animatedProps={centerProps}
        />
      </Svg>

      {/* Rotating segments */}
      <AnimatedView style={[styles.spinner, rotateStyle]}>
        <Svg width={40} height={40}>
          {Array.from({ length: 4 }).map((_, i) => {
            const angle = (360 / 4) * i;
            return (
              <Circle
                key={i}
                cx={20}
                cy={8}
                r={4}
                fill="#fff"
                transform={`rotate(${angle}, 20, 20)`}
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
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
    position: "absolute",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
