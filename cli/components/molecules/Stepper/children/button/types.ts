import type { TextStyle, ViewStyle } from "react-native";

export interface StepperButtonProps {
  type: "increment" | "decrement";
  style?: ViewStyle;
  iconStyle?: TextStyle;
  icon?: React.ReactNode;
}
