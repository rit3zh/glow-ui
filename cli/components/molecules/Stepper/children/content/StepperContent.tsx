import * as React from "react";
import { View, StyleSheet } from "react-native";
import type { StepperContentProps } from "./types";

export const StepperContent: React.FC<StepperContentProps> = ({
  children,
  style,
}: StepperContentProps): React.ReactNode => {
  return <View style={[styles.content, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
