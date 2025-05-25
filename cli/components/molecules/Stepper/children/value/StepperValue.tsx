import * as React from "react";
import { StyleSheet } from "react-native";
import { Easing, ReduceMotion } from "react-native-reanimated";
import { useStepperContext } from "../../context/StepperContext";
import type { StepperValueProps } from "./types";
import { AnimatedRollingNumber } from "react-native-animated-rolling-numbers";

export const StepperValue: React.FC<StepperValueProps> = ({
  style,

  animationConfig = {
    duration: 500,
    reduceMotion: ReduceMotion.Never,
    easing: Easing.bounce,
  },
}: StepperValueProps): React.ReactNode => {
  const { value, variant } = useStepperContext();

  return (
    <AnimatedRollingNumber
      value={Number(value)}
      useGrouping={false}
      enableCompactNotation={false}
      compactToFixed={2}
      textStyle={[styles.value, style, variant === "dark" && styles.darkValue]}
      spinningAnimationConfig={animationConfig}
    />
  );
};

const styles = StyleSheet.create({
  value: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",

    textAlign: "center",
  },
  darkValue: {
    color: "#fff",
  },
});
