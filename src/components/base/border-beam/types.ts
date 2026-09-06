import type { StyleProp, ViewStyle } from "react-native";

interface IBorderBeam {
  readonly children: React.ReactNode;
  readonly borderRadius?: number;
  readonly borderWidth?: number;
  readonly glow?: number;
  readonly duration?: number;
  readonly beamLength?: number;
  readonly colors?: string[];
  readonly intensity?: number;
  readonly ambient?: number;
  readonly style?: StyleProp<ViewStyle>;
}

export type { IBorderBeam };
