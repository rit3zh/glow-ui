import type { StyleProp, ViewStyle } from "react-native";

interface INebulaOrb {
  readonly size?: number;
  readonly color?: string;
  readonly highlightColor?: string;
  readonly speed?: number;
  readonly turbulence?: number;
  readonly detail?: number;
  readonly contrast?: number;
  readonly edgeSoftness?: number;
  readonly paused?: boolean;
  readonly style?: StyleProp<ViewStyle>;
}

export type { INebulaOrb };
