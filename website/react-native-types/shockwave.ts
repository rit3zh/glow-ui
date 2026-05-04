import type { RefObject, ReactNode } from "react";
import type { StyleProp, View, ViewStyle } from "react-native";

type ShockwaveValue = "from" | "to";

interface IShockwaveOrigin {
  x: number;
  y: number;
}

interface IShockwaveProps {
  value: ShockwaveValue;
  width: number;
  height: number;
  duration?: number;
  origin?: IShockwaveOrigin;
  shockStrength?: number;
  lensingSpread?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  onTransitionEnd?: (value: ShockwaveValue) => void;
}

interface IShockwaveSlotProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

interface IShockwaveContext {
  fromRef: RefObject<View | null>;
  toRef: RefObject<View | null>;
  activeValue: ShockwaveValue;
  isTransitioning: boolean;
}

export type {
  ShockwaveValue,
  IShockwaveOrigin,
  IShockwaveProps,
  IShockwaveSlotProps,
  IShockwaveContext,
};
