// TouchableRipple.tsx
import React from "react";
import { Pressable, View, StyleSheet, LayoutChangeEvent } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import type { TouchableRippleProps } from "./Ripple.types";

export const TouchableRipple: React.FC<TouchableRippleProps> = ({
  children,
  onPress,
  rippleColor = "rgba(255,255,255,0.2)",
  radius = 100,
  duration = 400,
  value = 0.4,
}: TouchableRippleProps) => {
  const rippleScale = useSharedValue(0);
  const rippleOpacity = useSharedValue(0);
  const width = useSharedValue(20);
  const height = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rippleScale.value }],
    opacity: rippleOpacity.value,
  }));

  const onLayout = (event: LayoutChangeEvent) => {
    width.value = event.nativeEvent.layout.width;
    height.value = event.nativeEvent.layout.height;
  };

  const handlePressIn = () => {
    rippleOpacity.value = value;
    rippleScale.value = 0;
    rippleScale.value = withTiming(1, {
      duration,
      easing: Easing.out(Easing.ease),
    });
  };

  const handlePressOut = () => {
    rippleOpacity.value = withTiming(0, { duration });
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onLayout={onLayout}
      style={{ overflow: "hidden" }}
    >
      <View style={{ overflow: "hidden" }}>
        {children}

        <Animated.View
          pointerEvents="none"
          style={[
            styles.ripple,
            {
              width: width.value,
              height: height.value,
              backgroundColor: rippleColor,
              borderRadius: radius, // always fully round
            },
            animatedStyle,
          ]}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  ripple: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});
