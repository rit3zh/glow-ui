import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import {
  BADGE_RADIUS,
  BORDER_WIDTH,
  CHECK_SIZE,
  DEFAULT_PALETTE,
  GAP,
  PADDING_X,
  PADDING_Y,
} from "./const";
import { VerifiedBadgeContext, useVerifiedBadge } from "./context";
import type {
  IVerifiedBadgeCheck,
  IVerifiedBadgeContext,
  IVerifiedBadgeRoot,
  IVerifiedBadgeText,
} from "./types";

import { createCompoundComponent } from "@/utils/create-compound-component";

const VerifiedBadgeRoot: React.FC<IVerifiedBadgeRoot> = ({
  children,
  palette,
  radius = BADGE_RADIUS,
  borderWidth = BORDER_WIDTH,
  gap = GAP,
  style,
}: IVerifiedBadgeRoot): React.JSX.Element => {
  const context = useMemo<IVerifiedBadgeContext>(
    () => ({ palette: { ...DEFAULT_PALETTE, ...palette } }),
    [palette],
  );

  return (
    <VerifiedBadgeContext.Provider value={context}>
      <View
        style={[
          styles.root,
          {
            gap,
            borderWidth,
            borderRadius: radius,
            backgroundColor: context.palette.surface,
            borderColor: context.palette.border,
          },
          style,
        ]}
      >
        {children}
      </View>
    </VerifiedBadgeContext.Provider>
  );
};

const VerifiedBadgeName: React.FC<IVerifiedBadgeText> = ({
  children,
  numberOfLines = 1,
  style,
}: IVerifiedBadgeText): React.JSX.Element => {
  const { palette } = useVerifiedBadge("VerifiedBadge.Name");

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[styles.name, { color: palette.name }, style]}
    >
      {children}
    </Text>
  );
};

const VerifiedBadgeCheck: React.FC<IVerifiedBadgeCheck> = ({
  size = CHECK_SIZE,
  color,
  markColor,
  label = "Verified",
  style,
}: IVerifiedBadgeCheck): React.JSX.Element => {
  const { palette } = useVerifiedBadge("VerifiedBadge.Check");

  return (
    <View accessible accessibilityLabel={label} style={style}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
          d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
          fill={color ?? palette.check}
        />
        <Path
          d="m9 12 2 2 4-4"
          fill="none"
          stroke={markColor ?? palette.checkMark}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};

const VerifiedBadgeHandle: React.FC<IVerifiedBadgeText> = ({
  children,
  numberOfLines = 1,
  style,
}: IVerifiedBadgeText): React.JSX.Element => {
  const { palette } = useVerifiedBadge("VerifiedBadge.Handle");

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[styles.handle, { color: palette.handle }, style]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: PADDING_X,
    paddingVertical: PADDING_Y,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  name: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: "600",
  },
  handle: {
    flexShrink: 1,
    fontSize: 12,
  },
});

const Root = createCompoundComponent("VerifiedBadge.Root", VerifiedBadgeRoot);
const Name = createCompoundComponent("VerifiedBadge.Name", VerifiedBadgeName);
const Check = createCompoundComponent(
  "VerifiedBadge.Check",
  VerifiedBadgeCheck,
);
const Handle = createCompoundComponent(
  "VerifiedBadge.Handle",
  VerifiedBadgeHandle,
);

const VerifiedBadge = createCompoundComponent(
  "VerifiedBadge",
  VerifiedBadgeRoot,
  { Root, Name, Check, Handle },
);

export { VerifiedBadge, Root, Name, Check, Handle, useVerifiedBadge };
export default VerifiedBadge;
export { DEFAULT_PALETTE, EMERALD_PALETTE, INK_PALETTE } from "./const";
export type {
  IVerifiedBadgeRoot,
  IVerifiedBadgeText,
  IVerifiedBadgeCheck,
  TVerifiedPalette,
} from "./types";
