import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import type { SharedValue, WithSpringConfig } from "react-native-reanimated";

enum GooeyPopoverAlignment {
  Left = "end",
  Start = "start",
  Center = "center",
}

enum GooeyPopoverSide {
  Top = "top",
  Bottom = "bottom",
}

type TSide = "top" | "bottom";
type TAlign = "start" | "center" | "end";
type TGooeyPopoverContextComponents =
  | "GooeyPopover.Content"
  | "GooeyPopover.Trigger";
interface IRect {
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
}

interface IGeo {
  layerW: number;
  layerH: number;
  left: number;
  top: number;
  trigger: IRect;
  panel: IRect;
}

interface ITriggerSize {
  w: number;
  h: number;
}

interface IGooeyPopoverRoot {
  children: ReactNode;
  readonly open?: boolean;
  readonly defaultOpen?: boolean;
  readonly openSpringConfig?: WithSpringConfig;
  readonly closeSpringConfig?: WithSpringConfig;
  readonly onOpenChange?: (open: boolean) => void;
  readonly side?: TSide;
  readonly align?: TAlign;
  readonly sideOffset?: number;
  readonly panelRadius?: number;
  readonly gooStrength?: number;
  readonly color?: string;
  readonly dismissOnOutsidePress?: boolean;
  readonly style?: StyleProp<ViewStyle>;
}

interface IGooeyPopoverTrigger {
  children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
  readonly pressScale?: number;
}

interface IGooeyPopoverContent {
  children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
  readonly textStyle?: StyleProp<TextStyle>;
}

interface IGooeyPopoverContext {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  progress: SharedValue<number>;
  side: TSide;
  align: TAlign;
  gap: number;
  panelRadius: number;
  gooStrength: number;
  color: string;
  dismissOnOutsidePress: boolean;
  triggerSize: ITriggerSize;
  setTriggerSize: (size: ITriggerSize) => void;
  triggerScale: SharedValue<number>;
}

export type {
  TSide,
  TAlign,
  IRect,
  IGeo,
  ITriggerSize,
  IGooeyPopoverRoot,
  IGooeyPopoverTrigger,
  IGooeyPopoverContent,
  IGooeyPopoverContext,
  TGooeyPopoverContextComponents,
};

export { GooeyPopoverAlignment, GooeyPopoverSide };
