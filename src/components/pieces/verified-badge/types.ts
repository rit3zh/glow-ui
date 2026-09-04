import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

type TVerifiedPalette = {
  surface: string;
  border: string;
  name: string;
  handle: string;
  check: string;
  checkMark: string;
};

type TVerifiedComponents =
  | "VerifiedBadge.Name"
  | "VerifiedBadge.Check"
  | "VerifiedBadge.Handle";

interface IVerifiedBadgeContext {
  readonly palette: TVerifiedPalette;
}

interface IVerifiedBadgeRoot {
  children: ReactNode;
  readonly palette?: Partial<TVerifiedPalette>;
  readonly radius?: number;
  readonly borderWidth?: number;
  readonly gap?: number;
  readonly style?: StyleProp<ViewStyle>;
}

interface IVerifiedBadgeText {
  children: ReactNode;
  readonly numberOfLines?: number;
  readonly style?: StyleProp<TextStyle>;
}

interface IVerifiedBadgeCheck {
  readonly size?: number;
  readonly color?: string;
  readonly markColor?: string;
  readonly label?: string;
  readonly style?: StyleProp<ViewStyle>;
}

export type {
  TVerifiedPalette,
  TVerifiedComponents,
  IVerifiedBadgeContext,
  IVerifiedBadgeRoot,
  IVerifiedBadgeText,
  IVerifiedBadgeCheck,
};
