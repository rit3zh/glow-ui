import type { TextStyle, ViewStyle } from "react-native";

export interface AnimatedProgressBarProps {
  /**
   * Progress value between 0 and 1
   * @default 0
   */
  progress: number;

  /**
   * Duration of the animation in milliseconds
   * @default 800
   */
  animationDuration?: number;

  /**
   * Width of the progress bar container
   * @default '100%'
   */
  width?: number | string;

  /**
   * Height of the progress bar
   * @default 10
   */
  height?: number;

  /**
   * Color of the progress indicator
   * @default '#2089dc'
   */
  progressColor?: string;

  /**
   * Color of the background track
   * @default '#e0e0e0'
   */
  trackColor?: string;

  /**
   * Border radius of the progress bar
   * @default 4
   */
  borderRadius?: number;

  /**
   * Whether to show the progress percentage
   * @default false
   */
  showPercentage?: boolean;

  /**
   * Position of the percentage text
   * @default 'right'
   */
  percentagePosition?: "left" | "right" | "top" | "bottom" | "inside";

  /**
   * Style for the percentage text
   */
  percentageTextStyle?: TextStyle;

  /**
   * Style for the container
   */
  containerStyle?: ViewStyle;

  /**
   * Format function for the percentage display
   * @default (value: number) => `${Math.round(value * 100)}%`
   */
  formatPercentage?: (value: number) => string;

  /**
   * Whether to use indeterminate animation style for unknown progress
   * @default false
   */
  indeterminate?: boolean;

  /**
   * Whether to show the pulse animation effect
   * @default false
   */
  pulsate?: boolean;

  /**
   * Whether to use a gradient for the progress bar
   * @default false
   */
  useGradient?: boolean;

  /**
   * Colors for gradient (requires useGradient to be true)
   * @default ['#4dabf7', '#3b5bdb']
   */
  gradientColors?: string[];

  /**
   * Optional callback when animation completes
   */
  onAnimationComplete?: () => void;
}
