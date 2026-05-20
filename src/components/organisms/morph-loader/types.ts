import type { StyleProp, ViewStyle } from "react-native";
import type { EasingFunction } from "react-native-reanimated";

interface IMorphLoader {
  readonly size?: number;
  readonly color?: string;
  readonly rotationDuration?: number;
  readonly morphDuration?: number;
  readonly style?: StyleProp<ViewStyle>;
  readonly shapes?: readonly string[];
  readonly easing?: EasingFunction;
}

export type { IMorphLoader };
