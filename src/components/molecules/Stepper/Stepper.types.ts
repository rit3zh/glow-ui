import type { ViewStyle } from "react-native";
import type { StepperContextProps } from "./context/types";

export interface StepperProps extends Partial<StepperContextProps> {
  children: React.ReactNode;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
  defaultValue?: number;
}
