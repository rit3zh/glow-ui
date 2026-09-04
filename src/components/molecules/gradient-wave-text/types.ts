import type { StyleProp, TextStyle, ViewStyle } from "react-native";

interface IGradientWaveText {
  readonly children: string;
  readonly colors?: string[];
  readonly baseColor?: string;
  readonly radial?: boolean;
  readonly bandGap?: number;
  readonly bandCount?: number;
  readonly speed?: number;
  readonly paused?: boolean;
  readonly textStyle?: StyleProp<TextStyle>;
  readonly style?: StyleProp<ViewStyle>;
}

interface IStopData {
  positions: number[];
  colors: number[];
  count: number;
}

type TRGB = [number, number, number];

export type { IGradientWaveText, IStopData, TRGB };
