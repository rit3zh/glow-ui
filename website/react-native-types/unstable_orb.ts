import type { StyleProp, ViewStyle } from "react-native";

interface UnstableOrbProps {
  readonly colorShift?: number;
  readonly intensity?: number;
  readonly background?: string;
  readonly colors?: [string, string, string];
  readonly style?: StyleProp<ViewStyle>;
}

export type { UnstableOrbProps };
