// types.ts
import { ViewStyle } from "react-native";
import { ReactNode } from "react";

export interface StepperProps {
  value: number;
  onValueChange: (value: number) => void;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly disabled?: boolean;
  readonly backgroundColor?: string;
  readonly dividerColor?: string;
  readonly size?: number;
  readonly disabledOpacity?: number;
  readonly containerStyle?: ViewStyle;
  readonly buttonStyle?: ViewStyle;
  readonly renderIncrementIcon?: () => ReactNode;
  readonly renderDecrementIcon?: () => ReactNode;
  readonly activeBackgroundColor?: string;
  readonly inActiveBackgroundColor?: string;
}
