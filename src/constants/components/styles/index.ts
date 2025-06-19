// types/designSystem.ts
import { ViewStyle, TextStyle, ImageStyle } from "react-native";

// =============================================================================
// SPACING SYSTEM
// =============================================================================
export type SpacingKey =
  | "none"
  | "xs"
  | "sm"
  | "base"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "8xl"
  | "9xl"
  | "10xl";

export const spacingStyles: Record<SpacingKey, number> = {
  none: 0,
  xs: 2,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  "6xl": 56,
  "7xl": 64,
  "8xl": 80,
  "9xl": 96,
  "10xl": 128,
};

// =============================================================================
// BORDER RADIUS SYSTEM
// =============================================================================
export type BorderRadiusKey =
  | "none"
  | "xs"
  | "sm"
  | "base"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "8xl"
  | "9xl"
  | "10xl"
  | "full"
  | "pill";

export const borderRadiusStyles: Record<BorderRadiusKey, number> = {
  none: 0,
  xs: 1,
  sm: 2,
  base: 4,
  md: 6,
  lg: 8,
  xl: 12,
  "2xl": 16,
  "3xl": 24,
  "4xl": 32,
  "5xl": 40,
  "6xl": 48,
  "7xl": 56,
  "8xl": 64,
  "9xl": 80,
  "10xl": 96,
  full: 9999,
  pill: 500,
};

// =============================================================================
// TYPOGRAPHY SYSTEM
// =============================================================================
export type FontSizeKey =
  | "xs"
  | "sm"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "8xl"
  | "9xl";

export const fontSizeStyles: Record<FontSizeKey, number> = {
  xs: 10,
  sm: 12,
  base: 14,
  lg: 16,
  xl: 18,
  "2xl": 20,
  "3xl": 24,
  "4xl": 28,
  "5xl": 32,
  "6xl": 36,
  "7xl": 42,
  "8xl": 48,
  "9xl": 56,
};

export type FontWeightKey =
  | "thin"
  | "extralight"
  | "light"
  | "normal"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold"
  | "black";

export const fontWeightStyles: Record<FontWeightKey, TextStyle["fontWeight"]> =
  {
    thin: "100",
    extralight: "200",
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900",
  };

export type LineHeightKey =
  | "none"
  | "tight"
  | "snug"
  | "normal"
  | "relaxed"
  | "loose";

export const lineHeightStyles: Record<LineHeightKey, number> = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
};

// =============================================================================
// COLOR SYSTEM
// =============================================================================
export type ColorKey =
  | "transparent"
  | "black"
  | "white"
  | "gray-50"
  | "gray-100"
  | "gray-200"
  | "gray-300"
  | "gray-400"
  | "gray-500"
  | "gray-600"
  | "gray-700"
  | "gray-800"
  | "gray-900"
  | "red-50"
  | "red-100"
  | "red-200"
  | "red-300"
  | "red-400"
  | "red-500"
  | "red-600"
  | "red-700"
  | "red-800"
  | "red-900"
  | "blue-50"
  | "blue-100"
  | "blue-200"
  | "blue-300"
  | "blue-400"
  | "blue-500"
  | "blue-600"
  | "blue-700"
  | "blue-800"
  | "blue-900"
  | "green-50"
  | "green-100"
  | "green-200"
  | "green-300"
  | "green-400"
  | "green-500"
  | "green-600"
  | "green-700"
  | "green-800"
  | "green-900"
  | "yellow-50"
  | "yellow-100"
  | "yellow-200"
  | "yellow-300"
  | "yellow-400"
  | "yellow-500"
  | "yellow-600"
  | "yellow-700"
  | "yellow-800"
  | "yellow-900"
  | "purple-50"
  | "purple-100"
  | "purple-200"
  | "purple-300"
  | "purple-400"
  | "purple-500"
  | "purple-600"
  | "purple-700"
  | "purple-800"
  | "purple-900";

export const colorStyles: Record<ColorKey, string> = {
  transparent: "transparent",
  black: "#000000",
  white: "#ffffff",
  "gray-50": "#f9fafb",
  "gray-100": "#f3f4f6",
  "gray-200": "#e5e7eb",
  "gray-300": "#d1d5db",
  "gray-400": "#9ca3af",
  "gray-500": "#6b7280",
  "gray-600": "#4b5563",
  "gray-700": "#374151",
  "gray-800": "#1f2937",
  "gray-900": "#111827",
  "red-50": "#fef2f2",
  "red-100": "#fee2e2",
  "red-200": "#fecaca",
  "red-300": "#fca5a5",
  "red-400": "#f87171",
  "red-500": "#ef4444",
  "red-600": "#dc2626",
  "red-700": "#b91c1c",
  "red-800": "#991b1b",
  "red-900": "#7f1d1d",
  "blue-50": "#eff6ff",
  "blue-100": "#dbeafe",
  "blue-200": "#bfdbfe",
  "blue-300": "#93c5fd",
  "blue-400": "#60a5fa",
  "blue-500": "#3b82f6",
  "blue-600": "#2563eb",
  "blue-700": "#1d4ed8",
  "blue-800": "#1e40af",
  "blue-900": "#1e3a8a",
  "green-50": "#f0fdf4",
  "green-100": "#dcfce7",
  "green-200": "#bbf7d0",
  "green-300": "#86efac",
  "green-400": "#4ade80",
  "green-500": "#22c55e",
  "green-600": "#16a34a",
  "green-700": "#15803d",
  "green-800": "#166534",
  "green-900": "#14532d",
  "yellow-50": "#fefce8",
  "yellow-100": "#fef3c7",
  "yellow-200": "#fde68a",
  "yellow-300": "#fcd34d",
  "yellow-400": "#fbbf24",
  "yellow-500": "#f59e0b",
  "yellow-600": "#d97706",
  "yellow-700": "#b45309",
  "yellow-800": "#92400e",
  "yellow-900": "#78350f",
  "purple-50": "#faf5ff",
  "purple-100": "#f3e8ff",
  "purple-200": "#e9d5ff",
  "purple-300": "#d8b4fe",
  "purple-400": "#c084fc",
  "purple-500": "#a855f7",
  "purple-600": "#9333ea",
  "purple-700": "#7c3aed",
  "purple-800": "#6b21a8",
  "purple-900": "#581c87",
};

// =============================================================================
// SHADOW SYSTEM
// =============================================================================
export type ShadowKey =
  | "none"
  | "xs"
  | "sm"
  | "base"
  | "md"
  | "lg"
  | "xl"
  | "2xl";

export const shadowStyles: Record<ShadowKey, ViewStyle> = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  base: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 12,
  },
  "2xl": {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 16,
  },
};

// =============================================================================
// OPACITY SYSTEM
// =============================================================================
export type OpacityKey =
  | "0"
  | "5"
  | "10"
  | "20"
  | "25"
  | "30"
  | "40"
  | "50"
  | "60"
  | "70"
  | "75"
  | "80"
  | "90"
  | "95"
  | "100";

export const opacityStyles: Record<OpacityKey, number> = {
  "0": 0,
  "5": 0.05,
  "10": 0.1,
  "20": 0.2,
  "25": 0.25,
  "30": 0.3,
  "40": 0.4,
  "50": 0.5,
  "60": 0.6,
  "70": 0.7,
  "75": 0.75,
  "80": 0.8,
  "90": 0.9,
  "95": 0.95,
  "100": 1,
};

// =============================================================================
// BORDER WIDTH SYSTEM
// =============================================================================
export type BorderWidthKey = "none" | "xs" | "sm" | "base" | "md" | "lg" | "xl";

export const borderWidthStyles: Record<BorderWidthKey, number> = {
  none: 0,
  xs: 0.5,
  sm: 1,
  base: 1.5,
  md: 2,
  lg: 3,
  xl: 4,
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

// Spacing utilities
export const generatePadding = (value: SpacingKey | number): ViewStyle => {
  const paddingValue = typeof value === "string" ? spacingStyles[value] : value;
  return { padding: paddingValue };
};

export const generateMargin = (value: SpacingKey | number): ViewStyle => {
  const marginValue = typeof value === "string" ? spacingStyles[value] : value;
  return { margin: marginValue };
};

export const generatePaddingX = (value: SpacingKey | number): ViewStyle => {
  const paddingValue = typeof value === "string" ? spacingStyles[value] : value;
  return { paddingHorizontal: paddingValue };
};

export const generatePaddingY = (value: SpacingKey | number): ViewStyle => {
  const paddingValue = typeof value === "string" ? spacingStyles[value] : value;
  return { paddingVertical: paddingValue };
};

export const generateMarginX = (value: SpacingKey | number): ViewStyle => {
  const marginValue = typeof value === "string" ? spacingStyles[value] : value;
  return { marginHorizontal: marginValue };
};

export const generateMarginY = (value: SpacingKey | number): ViewStyle => {
  const marginValue = typeof value === "string" ? spacingStyles[value] : value;
  return { marginVertical: marginValue };
};

// Border radius utilities
type BorderCorner = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

export const generateBorderRadius = (
  value: BorderRadiusKey | number,
): ViewStyle => {
  const radiusValue =
    typeof value === "string" ? borderRadiusStyles[value] : value;
  return { borderRadius: radiusValue };
};

export const generateCornerRadius = (
  radius: BorderRadiusKey | number,
  corners: BorderCorner[] = [
    "topLeft",
    "topRight",
    "bottomLeft",
    "bottomRight",
  ],
): ViewStyle => {
  const radiusValue =
    typeof radius === "string" ? borderRadiusStyles[radius] : radius;
  const style: ViewStyle = {};

  for (const corner of corners) {
    switch (corner) {
      case "topLeft":
        style.borderTopLeftRadius = radiusValue;
        break;
      case "topRight":
        style.borderTopRightRadius = radiusValue;
        break;
      case "bottomLeft":
        style.borderBottomLeftRadius = radiusValue;
        break;
      case "bottomRight":
        style.borderBottomRightRadius = radiusValue;
        break;
    }
  }
  return style;
};

// Typography utilities
export const generateTextStyle = (config: {
  fontSize?: FontSizeKey | number;
  fontWeight?: FontWeightKey;
  lineHeight?: LineHeightKey | number;
  color?: ColorKey | string;
  textAlign?: TextStyle["textAlign"];
}): TextStyle => {
  const style: TextStyle = {};

  if (config.fontSize) {
    style.fontSize =
      typeof config.fontSize === "string"
        ? fontSizeStyles[config.fontSize]
        : config.fontSize;
  }

  if (config.fontWeight) {
    style.fontWeight = fontWeightStyles[config.fontWeight];
  }

  if (config.lineHeight) {
    const fontSize = style.fontSize || fontSizeStyles.base;
    style.lineHeight =
      typeof config.lineHeight === "string"
        ? lineHeightStyles[config.lineHeight] * fontSize
        : config.lineHeight;
  }

  if (config.color) {
    style.color =
      typeof config.color === "string" && config.color in colorStyles
        ? colorStyles[config.color as ColorKey]
        : config.color;
  }

  if (config.textAlign) {
    style.textAlign = config.textAlign;
  }

  return style;
};

// Color utilities
export const generateBackgroundColor = (
  color: ColorKey | string,
): ViewStyle => {
  const colorValue =
    typeof color === "string" && color in colorStyles
      ? colorStyles[color as ColorKey]
      : color;
  return { backgroundColor: colorValue };
};

export const generateBorderColor = (color: ColorKey | string): ViewStyle => {
  const colorValue =
    typeof color === "string" && color in colorStyles
      ? colorStyles[color as ColorKey]
      : color;
  return { borderColor: colorValue };
};

// Border utilities
export const generateBorder = (
  width: BorderWidthKey | number,
  color: ColorKey | string,
): ViewStyle => {
  const borderWidth =
    typeof width === "string" ? borderWidthStyles[width] : width;
  const borderColor =
    typeof color === "string" && color in colorStyles
      ? colorStyles[color as ColorKey]
      : color;

  return {
    borderWidth,
    borderColor,
  };
};

// Flex utilities
export const generateFlex = (value: number = 1): ViewStyle => ({
  flex: value,
});

export const generateFlexDirection = (
  direction: ViewStyle["flexDirection"],
): ViewStyle => ({
  flexDirection: direction,
});

export const generateJustifyContent = (
  justify: ViewStyle["justifyContent"],
): ViewStyle => ({
  justifyContent: justify,
});

export const generateAlignItems = (
  align: ViewStyle["alignItems"],
): ViewStyle => ({
  alignItems: align,
});

// Positioning utilities
export const generatePosition = (
  position: ViewStyle["position"],
): ViewStyle => ({
  position,
});

export const generateTop = (value: SpacingKey | number): ViewStyle => {
  const topValue = typeof value === "string" ? spacingStyles[value] : value;
  return { top: topValue };
};

export const generateBottom = (value: SpacingKey | number): ViewStyle => {
  const bottomValue = typeof value === "string" ? spacingStyles[value] : value;
  return { bottom: bottomValue };
};

export const generateLeft = (value: SpacingKey | number): ViewStyle => {
  const leftValue = typeof value === "string" ? spacingStyles[value] : value;
  return { left: leftValue };
};

export const generateRight = (value: SpacingKey | number): ViewStyle => {
  const rightValue = typeof value === "string" ? spacingStyles[value] : value;
  return { right: rightValue };
};

// Dimension utilities
export const generateWidth = (
  value: SpacingKey | number | string,
): ViewStyle => {
  if (typeof value === "string" && value in spacingStyles) {
    return { width: spacingStyles[value as SpacingKey] };
  }
  return { width: value as number };
};

export const generateHeight = (
  value: SpacingKey | number | string,
): ViewStyle => {
  if (typeof value === "string" && value in spacingStyles) {
    return { height: spacingStyles[value as SpacingKey] };
  }
  return { height: value as number };
};

// Opacity utility
export const generateOpacity = (value: OpacityKey | number): ViewStyle => {
  const opacityValue = typeof value === "string" ? opacityStyles[value] : value;
  return { opacity: opacityValue };
};

// Shadow utility
export const generateShadow = (shadow: ShadowKey): ViewStyle => {
  return shadowStyles[shadow];
};

// Combined style generators
export const generateViewStyle = (config: {
  padding?: SpacingKey | number;
  margin?: SpacingKey | number;
  backgroundColor?: ColorKey | string;
  borderRadius?: BorderRadiusKey | number;
  borderWidth?: BorderWidthKey | number;
  borderColor?: ColorKey | string;
  shadow?: ShadowKey;
  opacity?: OpacityKey | number;
  width?: SpacingKey | number | string;
  height?: SpacingKey | number | string;
  flex?: number;
  flexDirection?: ViewStyle["flexDirection"];
  justifyContent?: ViewStyle["justifyContent"];
  alignItems?: ViewStyle["alignItems"];
  position?: ViewStyle["position"];
}): ViewStyle => {
  let style: ViewStyle = {};

  if (config.padding) style = { ...style, ...generatePadding(config.padding) };
  if (config.margin) style = { ...style, ...generateMargin(config.margin) };
  if (config.backgroundColor)
    style = { ...style, ...generateBackgroundColor(config.backgroundColor) };
  if (config.borderRadius)
    style = { ...style, ...generateBorderRadius(config.borderRadius) };
  if (config.borderWidth && config.borderColor) {
    style = {
      ...style,
      ...generateBorder(config.borderWidth, config.borderColor),
    };
  }
  if (config.shadow) style = { ...style, ...generateShadow(config.shadow) };
  if (config.opacity) style = { ...style, ...generateOpacity(config.opacity) };
  if (config.width) style = { ...style, ...generateWidth(config.width) };
  if (config.height) style = { ...style, ...generateHeight(config.height) };
  if (config.flex) style = { ...style, ...generateFlex(config.flex) };
  if (config.flexDirection)
    style = { ...style, ...generateFlexDirection(config.flexDirection) };
  if (config.justifyContent)
    style = { ...style, ...generateJustifyContent(config.justifyContent) };
  if (config.alignItems)
    style = { ...style, ...generateAlignItems(config.alignItems) };
  if (config.position)
    style = { ...style, ...generatePosition(config.position) };

  return style;
};
