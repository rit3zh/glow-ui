import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";

import { MAX_STOPS } from "./conf";

import type { MetalStop } from "./types";

const hexToRgb = <T extends string>(hex: T): [number, number, number] => {
  const normalized =
    hex.length === 4
      ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
      : hex;

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalized);

  return result
    ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
      ]
    : [0, 0, 0];
};

const degreesToRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

/**
 * Flattens the palette into the rgba array the shader expects. Stops past
 * the supplied count are padded with the last entry so the uniform always
 * carries MAX_STOPS entries.
 */
const resolvePalette = (colors: readonly MetalStop[]): number[] => {
  const stops = colors.slice(0, MAX_STOPS);

  const last = stops[stops.length - 1] ?? "#ffffff";

  return Array.from({ length: MAX_STOPS }, (_, index) => {
    const stop = stops[index] ?? last;

    return typeof stop === "string"
      ? [...hexToRgb<string>(stop), 1]
      : [...hexToRgb<string>(stop.color), stop.alpha];
  }).flat();
};

/**
 * Picks the radius to draw at: the explicit prop first, then whatever the
 * wrapped child or the wrapper itself already rounds by.
 */
const resolveRadius = (
  radius: number | undefined,
  width: number,
  height: number,
  ...styles: StyleProp<ViewStyle>[]
): number => {
  const inherited = styles.reduce<number | undefined>((found, style) => {
    if (found != null) {
      return found;
    }

    const flattened = StyleSheet.flatten(style);

    return typeof flattened?.borderRadius === "number"
      ? flattened.borderRadius
      : undefined;
  }, undefined);

  return Math.max(
    Math.min(radius ?? inherited ?? 0, Math.min(width, height) / 2),
    0,
  );
};

export { degreesToRadians, hexToRgb, resolvePalette, resolveRadius };
