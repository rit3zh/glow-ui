import React, { useMemo } from "react";
import { StyleSheet, Text, View, type ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

import {
  BORDER_WIDTH,
  COUPON_RADIUS,
  DEFAULT_PALETTE,
  ICON_SIZE,
  MONO_FONT,
  SECTION_PADDING_X,
  SECTION_PADDING_Y,
} from "./const";
import { CouponContext, useCoupon } from "./context";
import type {
  ICouponCode,
  ICouponContext,
  ICouponDiscount,
  ICouponRoot,
  ICouponSection,
} from "./types";

import { createCompoundComponent } from "@/utils/create-compound-component";

/** Default ticket mark, drawn so no icon package is required */
const TicketIcon: React.FC<{ color: string; size?: number }> = ({
  color,
  size = ICON_SIZE,
}): React.JSX.Element => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"
      stroke={color}
      strokeWidth={2}
      strokeLinejoin="round"
      fill="none"
    />
    <Path d="M13 5v14" stroke={color} strokeWidth={2} strokeDasharray="2 3" />
  </Svg>
);

const CouponRoot: React.FC<ICouponRoot> = ({
  children,
  palette,
  orientation = "horizontal",
  border = "dashed",
  borderWidth = BORDER_WIDTH,
  radius = COUPON_RADIUS,
  style,
}: ICouponRoot): React.JSX.Element => {
  const context = useMemo<ICouponContext>(
    () => ({
      palette: { ...DEFAULT_PALETTE, ...palette },
      fontFamily: MONO_FONT,
      orientation,
      border,
      borderWidth,
    }),
    [palette, orientation, border, borderWidth],
  );

  return (
    <CouponContext.Provider value={context}>
      <View
        style={[
          styles.root,
          {
            flexDirection: orientation === "horizontal" ? "row" : "column",
            backgroundColor: context.palette.surface,
            borderColor: context.palette.border,
            borderStyle: border,
            borderWidth,
            borderRadius: radius,
          },
          style,
        ]}
      >
        {children}
      </View>
    </CouponContext.Provider>
  );
};

const CouponSection: React.FC<ICouponSection> = ({
  children,
  accented = false,
  style,
}: ICouponSection): React.JSX.Element => {
  const { palette } = useCoupon("Coupon.Section");

  return (
    <View
      style={[
        styles.section,
        accented && { backgroundColor: palette.accent },
        style,
      ]}
    >
      {children}
    </View>
  );
};

/**
 * The rule between two sections. It follows the root's orientation, so a
 * stacked coupon gets a horizontal tear line instead of a vertical one.
 */
const CouponDivider: React.FC<{ style?: ViewStyle }> = ({
  style,
}): React.JSX.Element => {
  const { palette, orientation, border, borderWidth } =
    useCoupon("Coupon.Divider");

  const rule: ViewStyle =
    orientation === "horizontal"
      ? { borderLeftWidth: borderWidth }
      : { borderTopWidth: borderWidth };

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        { borderColor: palette.border, borderStyle: border },
        rule,
        style,
      ]}
    />
  );
};

const CouponCode: React.FC<ICouponCode> = ({
  children,
  icon,
  numberOfLines = 1,
  style,
  textStyle,
}: ICouponCode): React.JSX.Element => {
  const { palette, fontFamily } = useCoupon("Coupon.Code");

  return (
    <View style={[styles.section, styles.code, style]}>
      {icon === undefined ? <TicketIcon color={palette.icon} /> : icon}
      <Text
        numberOfLines={numberOfLines}
        style={[
          styles.codeText,
          { color: palette.code, fontFamily },
          textStyle,
        ]}
      >
        {children}
      </Text>
    </View>
  );
};

const CouponDiscount: React.FC<ICouponDiscount> = ({
  children,
  numberOfLines = 1,
  style,
  textStyle,
}: ICouponDiscount): React.JSX.Element => {
  const { palette, orientation, border, borderWidth } =
    useCoupon("Coupon.Discount");

  // The discount carries the tear line itself, so the common two-section
  // coupon needs no explicit <Coupon.Divider />.
  const rule: ViewStyle =
    orientation === "horizontal"
      ? { borderLeftWidth: borderWidth }
      : { borderTopWidth: borderWidth };

  return (
    <View
      style={[
        styles.section,
        {
          backgroundColor: palette.accent,
          borderColor: palette.border,
          borderStyle: border,
        },
        rule,
        style,
      ]}
    >
      <Text
        numberOfLines={numberOfLines}
        style={[styles.discountText, { color: palette.accentLabel }, textStyle]}
      >
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    overflow: "hidden",
  },
  section: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SECTION_PADDING_X,
    paddingVertical: SECTION_PADDING_Y,
  },
  code: {
    flexDirection: "row",
    gap: 8,
  },
  codeText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 2,
  },
  discountText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});

const Root = createCompoundComponent("Coupon.Root", CouponRoot);
const Section = createCompoundComponent("Coupon.Section", CouponSection);
const Divider = createCompoundComponent("Coupon.Divider", CouponDivider);
const Code = createCompoundComponent("Coupon.Code", CouponCode);
const Discount = createCompoundComponent("Coupon.Discount", CouponDiscount);

const Coupon = createCompoundComponent("Coupon", CouponRoot, {
  Root,
  Section,
  Divider,
  Code,
  Discount,
});

export { Coupon, Root, Section, Divider, Code, Discount, useCoupon };
export default Coupon;
export { DEFAULT_PALETTE, EMERALD_PALETTE, INK_PALETTE } from "./const";
export type {
  ICouponRoot,
  ICouponSection,
  ICouponCode,
  ICouponDiscount,
  TCouponPalette,
  TCouponOrientation,
  TCouponBorder,
} from "./types";
