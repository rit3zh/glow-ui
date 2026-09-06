import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

enum ThemeMode {
  Light = "light",
  Dark = "dark",
}

enum AnimationType {
  Circular = "circular",
  Wipe = "wipe",
  CircularInverted = "circularInverted",
  WipeRight = "wipeRight",
  WipeDown = "wipeDown",
  WipeUp = "wipeUp",
  /** Circular, with the reveal edge softened by a blur on the mask. */
  CircularBlur = "circularBlur",
  /** Vertical slats that widen inside their own column, like a shutter. */
  Blinds = "blinds",
  /** Horizontal slats that deepen inside their own row. */
  BlindsHorizontal = "blindsHorizontal",
  /** A band opening outward from the vertical centre line. */
  Curtain = "curtain",
  /** A rhombus expanding from the touch point. */
  Iris = "iris",
  /** Straight cross-fade between the two themes. */
  Fade = "fade",
  /** A radial sweep around the touch point, like a clock hand. */
  ClockWipe = "clockWipe",
}

enum EasingType {
  Linear = "linear",
  Ease = "ease",
  EaseIn = "easeIn",
  EaseOut = "easeOut",
  EaseInOut = "easeInOut",
}

interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  muted: string;
  mutedForeground: string;
  success: string;
  warning: string;
  info: string;
}

interface ThemeConfig {
  mode: ThemeMode;
  colors: ThemeColors;
  animationType: AnimationType;
  animationDuration: number;
  easing: EasingType;
}

interface ThemeSwitcherRef {
  animate: (options?: IThemeOptions) => Promise<void>;
}

interface ThemeSwitcherProps {
  theme: ThemeMode;
  onThemeChange: (newTheme: ThemeMode) => void;
  children: Required<ReactNode>;
  animationDuration?: number;
  readonly animationType?: AnimationType;
  readonly style?: StyleProp<ViewStyle>;
  readonly onAnimationStart?: () => void;
  readonly onAnimationComplete?: () => void;
  readonly switchDelay?: number;
  readonly easing?: EasingType;
}

interface IThemeOptions {
  readonly touchX?: number;
  readonly touchY?: number;
  readonly animationType?: AnimationType;
  readonly animationDuration?: number;
  readonly easing?: EasingType;
}

interface ThemeContextType {
  theme: ThemeMode;
  colors: ThemeColors;
  config: ThemeConfig;
  toggleTheme: (options?: IThemeOptions) => Promise<void>;
  setTheme: (theme: ThemeMode) => void;
  isDark: boolean;
  isLight: boolean;
}

interface ThemeProviderProps {
  children: Required<ReactNode>;
  readonly defaultTheme?: ThemeMode;
  readonly onThemeChange?: (theme: ThemeMode) => void;
  readonly onAnimationStart?: () => void;
  readonly onAnimationComplete?: () => void;
  readonly customLightColors?: Partial<ThemeColors>;
  readonly customDarkColors?: Partial<ThemeColors>;
}

interface IThemeAnimation {
  type: AnimationType;
  duration: number;
  easing: EasingType;
}

export {
  ThemeMode,
  AnimationType,
  EasingType,
  ThemeColors,
  ThemeConfig,
  ThemeSwitcherRef,
  ThemeSwitcherProps,
  ThemeContextType,
  ThemeProviderProps,
  IThemeOptions,
  IThemeAnimation,
};
