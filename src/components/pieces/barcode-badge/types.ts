import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

/** Color tokens the badge paints with; merged over the defaults */
type TBarcodePalette = {
  /** The bars themselves */
  bars: string;
  /** The label printed under the bars */
  label: string;
};

type TBarcodeComponents = "BarcodeBadge.Bars" | "BarcodeBadge.Label";

interface IBarcodeBadgeContext {
  /** Palette resolved from the root's `palette` prop over the defaults */
  readonly palette: TBarcodePalette;
  /** Monospace family the label inherits */
  readonly fontFamily: string;
  /** Seeds the bar pattern and is what `Label` prints */
  readonly label: string;
  /** How many bars to draw */
  readonly barCount: number;
}

interface IBarcodeBadgeRoot {
  /** Label under the bars, and the seed for the bar pattern */
  readonly label: string;
  /**
   * Composition override. Omit it for the default `Bars` + `Label` stack;
   * pass slots to reorder them or wrap them in your own layout.
   */
  children?: ReactNode;
  /** Overrides any subset of the color tokens */
  readonly palette?: Partial<TBarcodePalette>;
  /** Number of bars (defaults to 28) */
  readonly barCount?: number;
  /** Keep the label for screen readers only */
  readonly hideLabel?: boolean;
  readonly style?: StyleProp<ViewStyle>;
}

interface IBarcodeBadgeBars {
  /** Height of the bar strip */
  readonly height?: number;
  /** Space between bars */
  readonly gap?: number;
  readonly color?: string;
  readonly style?: StyleProp<ViewStyle>;
}

interface IBarcodeBadgeLabel {
  /** Overrides the root's `label` for this slot only */
  children?: ReactNode;
  readonly color?: string;
  readonly style?: StyleProp<TextStyle>;
}

export type {
  TBarcodePalette,
  TBarcodeComponents,
  IBarcodeBadgeContext,
  IBarcodeBadgeRoot,
  IBarcodeBadgeBars,
  IBarcodeBadgeLabel,
};
