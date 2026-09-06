import type { StyleProp, TextStyle, ViewStyle } from "react-native";

interface INumberFlowProps {
  value: number;
  padStart?: boolean;
  decimals?: number;
  decimalSeparator?: string;
  groupSeparator?: string;
  fontSize?: number;
  color?: string;
  fontWeight?: TextStyle["fontWeight"];
  style?: StyleProp<ViewStyle>;
}

interface IDigitProps {
  value: number;
  place: number;
  active: boolean;
  enter?: boolean;
  fontSize: number;
  color: string;
  fontWeight: TextStyle["fontWeight"];
}

interface ISeparatorProps {
  char: string;
  active: boolean;
  fontSize: number;
  color: string;
  fontWeight: TextStyle["fontWeight"];
}

export type { INumberFlowProps, IDigitProps, ISeparatorProps };
