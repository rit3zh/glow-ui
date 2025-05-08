import * as React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import { useStepperContext } from "../../context/StepperContext";

import type { StepperButtonProps } from "./types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const StepperButton: React.FC<StepperButtonProps> = ({
  type,
  style,
  iconStyle,
  icon,
}: StepperButtonProps): React.ReactNode => {
  const { value, onChange, min, max, step, disabled, variant } =
    useStepperContext();

  const pressed = useSharedValue(0);

  const canDecrement = value > (min || 0);
  const canIncrement = value < (max || Infinity);

  const isDisabled =
    disabled ||
    (type === "decrement" && !canDecrement) ||
    (type === "increment" && !canIncrement);

  const handlePress = () => {
    if (isDisabled) return;

    const newValue =
      type === "increment" ? value + (step || 1) : value - (step || 1);

    onChange(newValue);
  };

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      pressed.value,
      [0, 1],
      variant === "light"
        ? ["transparent", "rgba(0, 0, 0, 0.05)"]
        : ["transparent", "rgba(255, 255, 255, 0.1)"]
    );

    return {
      backgroundColor,
      opacity: isDisabled ? 0.4 : 1,
    };
  });

  return (
    <AnimatedPressable
      style={[styles.button, animatedStyle, style]}
      onPress={handlePress}
      disabled={isDisabled}
      onPressIn={() => {
        pressed.value = withTiming(1, { duration: 150 });
      }}
      onPressOut={() => {
        pressed.value = withTiming(0, { duration: 150 });
      }}
    >
      {icon || (
        <Text
          style={[
            styles.icon,
            variant === "dark" && styles.darkIcon,
            iconStyle,
          ]}
        >
          {type === "increment" ? "+" : "−"}
        </Text>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 18,
    color: "#000",
    fontWeight: "500",
  },
  darkIcon: {
    color: "#fff",
  },
});
