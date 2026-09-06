import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { createCompoundComponent } from "@/utils/create-compound-component";
import { IconTileContext, useIconTile } from "./context";
import {
  DEFAULT_GLOSS_OPACITY,
  DEFAULT_ICON_TILE_SIZE,
  ICON_TILE_GLYPH_RATIO,
  ICON_TILE_RADIUS_RATIO,
  ICON_TILE_TONES,
} from "./const";
import type { IIconTileGloss, IIconTileIcon, IIconTileRoot } from "./types";

type TGradientColors = readonly [string, string, ...string[]];

const GLOSS_COLORS: TGradientColors = [
  "rgba(255,255,255,1)",
  "rgba(255,255,255,0)",
];

const IconTileGloss: React.FC<IIconTileGloss> = ({
  opacity = DEFAULT_GLOSS_OPACITY,
  style,
}): React.JSX.Element => (
  <LinearGradient
    colors={GLOSS_COLORS}
    start={{ x: 0.5, y: 0 }}
    end={{ x: 0.5, y: 0.62 }}
    style={[StyleSheet.absoluteFill, { opacity }, style]}
    pointerEvents="none"
  />
);

const IconTileRoot: React.FC<IIconTileRoot> = ({
  children,
  size = DEFAULT_ICON_TILE_SIZE,
  tone = "blue",
  colors,
  start = { x: 0.5, y: 0 },
  end = { x: 0.5, y: 1 },
  cornerRadius,
  contentColor = "#FFFFFF",
  gloss = true,
  style,
}): React.JSX.Element => {
  const radius = cornerRadius ?? size * ICON_TILE_RADIUS_RATIO;

  const gradientColors = useMemo<TGradientColors>(
    () =>
      (colors && colors.length > 1
        ? colors
        : ICON_TILE_TONES[tone]) as TGradientColors,
    [colors, tone],
  );

  const ctx = useMemo(
    () => ({
      size,
      glyphSize: Math.round(size * ICON_TILE_GLYPH_RATIO),
      contentColor,
      cornerRadius: radius,
    }),
    [size, contentColor, radius],
  );

  return (
    <IconTileContext.Provider value={ctx}>
      <View
        style={[
          styles.root,
          { width: size, height: size, borderRadius: radius },
          style,
        ]}
      >
        <LinearGradient
          colors={gradientColors}
          start={start}
          end={end}
          style={StyleSheet.absoluteFill}
        />
        {gloss ? <IconTileGloss /> : null}
        {children}
      </View>
    </IconTileContext.Provider>
  );
};

const IconTileIcon: React.FC<IIconTileIcon> = ({
  children,
  size,
  color,
  style,
}): React.JSX.Element | null => {
  const { glyphSize, contentColor } = useIconTile("IconTile.Icon");

  const resolvedSize = size ?? glyphSize;
  const resolvedColor = color ?? contentColor;

  if (children == null) return null;

  if (typeof children === "string" || typeof children === "number") {
    return (
      <Text
        style={[
          styles.glyph,
          {
            fontSize: resolvedSize * 0.86,
            lineHeight: resolvedSize,
            color: resolvedColor,
          },
          style,
        ]}
      >
        {children}
      </Text>
    );
  }

  return (
    <View
      style={[
        styles.iconSlot,
        { width: resolvedSize, height: resolvedSize },
        style as never,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  iconSlot: {
    alignItems: "center",
    justifyContent: "center",
  },
  glyph: {
    fontWeight: "600",
    textAlign: "center",
    includeFontPadding: false,
  },
});

const IconTile = createCompoundComponent("IconTile", IconTileRoot, {
  Root: IconTileRoot,
  Icon: IconTileIcon,
  Gloss: IconTileGloss,
});

export { IconTile, IconTileRoot, IconTileIcon, IconTileGloss };
export { useIconTile } from "./context";
export { ICON_TILE_TONES } from "./const";
export default IconTile;
export type {
  IIconTileRoot,
  IIconTileIcon,
  IIconTileGloss,
  TIconTileTone,
} from "./types";
