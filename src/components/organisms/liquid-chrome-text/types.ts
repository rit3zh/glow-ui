import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import type {
  DataSourceParam,
  matchFont,
  SkFont,
  SkImage,
} from "@shopify/react-native-skia";

type RGB = [number, number, number];
type TSkiaWeight = Parameters<typeof matchFont>[0] extends
  | { fontWeight?: infer W }
  | undefined
  ? W
  : never;

interface IChromeColors {
  readonly sky: string;
  readonly highlight: string;
  readonly shadow: string;
  readonly ground: string;
  readonly base: string;
  readonly spark: string;
}

interface IChromeField {
  readonly image: SkImage;
  readonly width: number;
  readonly height: number;
}

interface IBuildChromeField {
  readonly text: string;
  readonly font: SkFont;
  readonly width: number;
  readonly height: number;
  readonly scale: number;
  readonly fontSizeRatio: number;
  readonly widthRatio: number;
  readonly letterSpacing: number;
  readonly bulge: number;
}

interface ILiquidChromeText {
  readonly text?: string;
  readonly width?: number;
  readonly height?: number;
  readonly borderRadius?: number;

  readonly skyColor?: string;
  readonly highlightColor?: string;
  readonly shadowColor?: string;
  readonly groundColor?: string;
  readonly baseColor?: string;
  readonly sparkColor?: string;
  readonly colors?: Partial<IChromeColors>;
  readonly fontSource?: DataSourceParam;
  readonly fontFamily?: string;
  readonly fontWeight?: TextStyle["fontWeight"];
  readonly fontSizeRatio?: number;
  readonly widthRatio?: number;
  readonly letterSpacing?: number;

  readonly bulge?: number;
  readonly normalStrength?: number;
  readonly horizonSharpness?: number;
  readonly roughness?: number;
  readonly fresnel?: number;
  readonly sparkle?: number;
  readonly edgeSoftness?: number;
  readonly speed?: number;
  readonly drift?: number;
  readonly resolution?: number;
  readonly paused?: boolean;
  readonly asChild?: boolean;
  readonly children?: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
  readonly onReady?: () => void;
}
interface IUseChromeField {
  text: string;
  font: SkFont | null;
  width: number;
  height: number;
  scale: number;
  fontSizeRatio: number;
  widthRatio: number;
  letterSpacing: number;
  bulge: number;
}

export type {
  RGB,
  IChromeColors,
  IChromeField,
  IBuildChromeField,
  ILiquidChromeText,
  TSkiaWeight,
  IUseChromeField,
};
