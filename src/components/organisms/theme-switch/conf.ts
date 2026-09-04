// config.ts
import { ThemeColors, AnimationType, EasingType } from "./types";

// Light theme colors
export const lightColors: ThemeColors = {
  background: "#FFFFFF",
  foreground: "#000000",
  card: "#F5F5F5",
  text: "#1A1A1A",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
  primary: "#3B82F6",
  primaryForeground: "#FFFFFF",
  secondary: "#6B7280",
  secondaryForeground: "#FFFFFF",
  accent: "#8B5CF6",
  accentForeground: "#FFFFFF",
  destructive: "#EF4444",
  destructiveForeground: "#FFFFFF",
  muted: "#F3F4F6",
  mutedForeground: "#6B7280",
  success: "#10B981",
  warning: "#F59E0B",
  info: "#3B82F6",
};

// Dark theme colors
export const darkColors: ThemeColors = {
  background: "#0A0A0A",
  foreground: "#FAFAFA",
  card: "#1A1A1A",
  text: "#FAFAFA",
  textSecondary: "#A1A1AA",
  border: "#27272A",
  primary: "#60A5FA",
  primaryForeground: "#0A0A0A",
  secondary: "#A1A1AA",
  secondaryForeground: "#0A0A0A",
  accent: "#A78BFA",
  accentForeground: "#0A0A0A",
  destructive: "#F87171",
  destructiveForeground: "#0A0A0A",
  muted: "#1F1F23",
  mutedForeground: "#A1A1AA",
  success: "#34D399",
  warning: "#FBBF24",
  info: "#60A5FA",
};

// Default animation settings
export const DEFAULT_ANIMATION_DURATION = 600;
export const DEFAULT_ANIMATION_TYPE = AnimationType.Circular;
export const DEFAULT_SWITCH_DELAY = 80;
export const DEFAULT_EASING = EasingType.EaseInOut;

// Number of slats the Blinds variants divide the screen into.
export const DEFAULT_SLAT_COUNT = 12;

// Blur radius applied to the CircularBlur mask, in points.
export const DEFAULT_MASK_BLUR = 24;
