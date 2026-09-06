import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

type RGB = [number, number, number];

type BackdropVariant = "solid" | "studio" | "pool" | "grid";

interface IChromeBackdrop {
  readonly variant?: BackdropVariant;
  readonly accentColor?: string;
  readonly baseColor?: string;
  readonly baseOpacity?: number;
  readonly intensity?: number;
  readonly grain?: number;
  readonly speed?: number;
  readonly paused?: boolean;

  readonly width?: number;
  readonly height?: number;
  readonly borderRadius?: number;

  readonly asChild?: boolean;
  readonly children?: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

export type { RGB, BackdropVariant, IChromeBackdrop };
