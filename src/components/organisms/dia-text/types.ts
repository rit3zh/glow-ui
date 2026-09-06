import type { StyleProp, TextStyle, ViewStyle } from "react-native";

interface IDiaText {
  readonly text: string | readonly string[];
  readonly sweepColors?: readonly string[];
  readonly baseColor?: string;
  readonly duration?: number;
  readonly delay?: number;
  readonly loop?: boolean;
  readonly loopDelay?: number;
  readonly bandRatio?: number;
  readonly autoPlay?: boolean;
  readonly textStyle?: StyleProp<TextStyle>;
  readonly style?: StyleProp<ViewStyle>;
  readonly onSweepEnd?: (index: number) => void;
}

interface IDiaGradient {
  readonly colors: string[];
  readonly locations: number[];
}

export type { IDiaGradient, IDiaText };
