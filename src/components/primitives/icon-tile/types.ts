import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

type TIconTileTone =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "teal"
  | "blue"
  | "indigo"
  | "purple"
  | "pink"
  | "gray";

type TIconTileContext = "IconTile.Icon" | "IconTile.Gloss";

interface IIconTileGradientPoint {
  readonly x: number;
  readonly y: number;
}

interface IIconTileRoot {
  children?: ReactNode;
  readonly size?: number;
  readonly tone?: TIconTileTone;
  readonly colors?: readonly string[];
  readonly start?: IIconTileGradientPoint;
  readonly end?: IIconTileGradientPoint;
  readonly cornerRadius?: number;
  readonly contentColor?: string;
  readonly gloss?: boolean;
  readonly style?: StyleProp<ViewStyle>;
}

interface IIconTileIcon {
  children?: ReactNode;
  readonly size?: number;
  readonly color?: string;
  readonly style?: StyleProp<TextStyle>;
}

interface IIconTileGloss {
  readonly opacity?: number;
  readonly style?: StyleProp<ViewStyle>;
}

interface IIconTileContext {
  size: number;
  glyphSize: number;
  contentColor: string;
  cornerRadius: number;
}

export type {
  TIconTileTone,
  TIconTileContext,
  IIconTileGradientPoint,
  IIconTileRoot,
  IIconTileIcon,
  IIconTileGloss,
  IIconTileContext,
};
