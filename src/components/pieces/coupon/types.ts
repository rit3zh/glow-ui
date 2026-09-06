import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

type TCouponPalette = {
  surface: string;
  border: string;
  code: string;
  icon: string;
  accent: string;
  accentLabel: string;
};

type TCouponOrientation = "horizontal" | "vertical";
type TCouponBorder = "dashed" | "solid";
type TCouponComponents =
  | "Coupon.Code"
  | "Coupon.Discount"
  | "Coupon.Section"
  | "Coupon.Divider";

interface ICouponContext {
  readonly palette: TCouponPalette;
  readonly fontFamily: string;
  readonly orientation: TCouponOrientation;
  readonly border: TCouponBorder;
  readonly borderWidth: number;
}

interface ICouponRoot {
  children: ReactNode;
  readonly palette?: Partial<TCouponPalette>;
  readonly orientation?: TCouponOrientation;
  readonly border?: TCouponBorder;
  readonly borderWidth?: number;
  readonly radius?: number;
  readonly style?: StyleProp<ViewStyle>;
}

interface ICouponSection {
  children: ReactNode;
  readonly accented?: boolean;
  readonly style?: StyleProp<ViewStyle>;
}

interface ICouponCode {
  children: ReactNode;
  readonly icon?: ReactNode;
  readonly numberOfLines?: number;
  readonly style?: StyleProp<ViewStyle>;
  readonly textStyle?: StyleProp<TextStyle>;
}

interface ICouponDiscount {
  children: ReactNode;
  readonly numberOfLines?: number;
  readonly style?: StyleProp<ViewStyle>;
  readonly textStyle?: StyleProp<TextStyle>;
}

export type {
  TCouponPalette,
  TCouponOrientation,
  TCouponBorder,
  TCouponComponents,
  ICouponContext,
  ICouponRoot,
  ICouponSection,
  ICouponCode,
  ICouponDiscount,
};
