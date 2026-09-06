import type { StyleProp, ViewStyle } from "react-native";

type Scheme =
  | "analogous"
  | "triadic"
  | "splitComplementary"
  | "tetradic"
  | "complementary"
  | "custom";

interface IPalette {
  seed: number;
  swatches: string[];
  scheme: Scheme;
}

interface IPaletteConfig {
  palette?: string[];
}

interface IMesh {
  fill: string;
  layers: string[];
}

interface IGradientAvatar {
  token: number | string;
  size?: number;
  rounding?: number;
  palette?: string[];
  sheen?: boolean;
  style?: StyleProp<ViewStyle>;
}

export type { Scheme, IPalette, IPaletteConfig, IMesh, IGradientAvatar };
