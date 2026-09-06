import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  BARS_HEIGHT,
  BAR_COUNT,
  BAR_GAP,
  DEFAULT_PALETTE,
  MONO_FONT,
} from "./const";
import { BarcodeBadgeContext, useBarcodeBadge } from "./context";
import type {
  IBarcodeBadgeBars,
  IBarcodeBadgeContext,
  IBarcodeBadgeLabel,
  IBarcodeBadgeRoot,
} from "./types";

import { createCompoundComponent } from "@/utils/create-compound-component";

const BarcodeBadgeRoot: React.FC<IBarcodeBadgeRoot> = ({
  label,
  children,
  palette,
  barCount = BAR_COUNT,
  hideLabel = false,
  style,
}: IBarcodeBadgeRoot): React.JSX.Element => {
  const context = useMemo<IBarcodeBadgeContext>(
    () => ({
      palette: { ...DEFAULT_PALETTE, ...palette },
      fontFamily: MONO_FONT,
      label,
      barCount,
    }),
    [palette, label, barCount],
  );

  return (
    <BarcodeBadgeContext.Provider value={context}>
      <View
        accessible
        accessibilityRole="text"
        accessibilityLabel={label}
        style={[styles.root, style]}
      >
        {children ?? (
          <React.Fragment>
            <BarcodeBadgeBars />
            {!hideLabel && <BarcodeBadgeLabel />}
          </React.Fragment>
        )}
      </View>
    </BarcodeBadgeContext.Provider>
  );
};

const BarcodeBadgeBars: React.FC<IBarcodeBadgeBars> = ({
  height = BARS_HEIGHT,
  gap = BAR_GAP,
  color,
  style,
}: IBarcodeBadgeBars): React.JSX.Element => {
  const { palette, label, barCount } = useBarcodeBadge("BarcodeBadge.Bars");

  const widths = useMemo<number[]>(() => {
    const seed = label.length > 0 ? label : "beste";
    return Array.from(
      { length: barCount },
      (_, i) => 1 + ((seed.charCodeAt(i % seed.length) + i * 7) % 3),
    );
  }, [label, barCount]);

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.bars, { height, gap }, style]}
    >
      {widths.map((width, i) => (
        <View
          key={`${label}-${i}`}
          style={{
            width,
            height: "100%",
            backgroundColor: color ?? palette.bars,
          }}
        />
      ))}
    </View>
  );
};

const BarcodeBadgeLabel: React.FC<IBarcodeBadgeLabel> = ({
  children,
  color,
  style,
}: IBarcodeBadgeLabel): React.JSX.Element => {
  const { palette, fontFamily, label } = useBarcodeBadge("BarcodeBadge.Label");

  return (
    <Text
      style={[
        styles.label,
        { color: color ?? palette.label, fontFamily },
        style,
      ]}
    >
      {children ?? label}
    </Text>
  );
};

const styles = StyleSheet.create({
  root: {
    gap: 6,
  },
  bars: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  label: {
    fontSize: 12,
    letterSpacing: 6,
    textTransform: "uppercase",
  },
});

const Root = createCompoundComponent("BarcodeBadge.Root", BarcodeBadgeRoot);
const Bars = createCompoundComponent("BarcodeBadge.Bars", BarcodeBadgeBars);
const Label = createCompoundComponent("BarcodeBadge.Label", BarcodeBadgeLabel);

const BarcodeBadge = createCompoundComponent("BarcodeBadge", BarcodeBadgeRoot, {
  Root,
  Bars,
  Label,
});

export { BarcodeBadge, Root, Bars, Label, useBarcodeBadge };
export default BarcodeBadge;
export type {
  IBarcodeBadgeRoot,
  IBarcodeBadgeBars,
  IBarcodeBadgeLabel,
  TBarcodePalette,
} from "./types";
