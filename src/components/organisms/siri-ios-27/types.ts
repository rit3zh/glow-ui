import type { StyleProp, ViewStyle } from "react-native";

interface IPerformance {
  readonly undersampling?: number;
  readonly fpsLock?: number;
}

interface ISiriIOS27 {
  readonly width?: number;
  readonly height?: number;
  readonly speed?: number;
  readonly level?: number;
  readonly amplitude?: number;
  readonly thickness?: number;
  readonly strandCount?: number;
  readonly hueShift?: number;
  readonly colors?: readonly string[];
  readonly exposure?: number;
  readonly animated?: boolean;
  readonly performance?: IPerformance;
  readonly style?: StyleProp<ViewStyle>;
}

interface IFrameTime {
  fpsLock: number;
  animated: boolean;
  speed: number;
}

export type { ISiriIOS27, IPerformance, IFrameTime };
