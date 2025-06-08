import { Feather } from "@expo/vector-icons";
import { TextStyle, ViewStyle } from "react-native";

export interface ExpandableButtonProps {
  /** Text to display on the button */
  title: string;
  /** Whether the button is in a loading state */
  isLoading: boolean;
  /** Function to call when button is pressed */
  onPress: () => void;
  /** Width of the button in its expanded state */
  width?: number;
  /** Height of the button */
  height?: number;
  /** Background color of the button (ignored if gradient is provided) */
  backgroundColor?: string;
  /** Text color */
  textColor?: string;
  /** Font size of the button text */
  fontSize?: number;
  /** Optional icon to display before text */
  icon?: keyof typeof Feather.glyphMap;
  /** Icon size */
  iconSize?: number;
  /** Icon color (defaults to text color) */
  iconColor?: string;
  /** Button border radius (automatically calculated by default) */
  borderRadius?: number;
  /** Gradient colors to use (if provided) */
  gradientColors?: string[];
  /** Button style */
  style?: ViewStyle;
  /** Text style override */
  textStyle?: TextStyle;
  /** Whether to add a press animation effect */
  withPressAnimation?: boolean;
  /** Custom loading component */
  loadingComponent?: React.ReactNode;
  /** Loading indicator color */
  loadingIndicatorColor?: string;
  /** Animation configuration */
  animationConfig?: {
    damping?: number;
    stiffness?: number;
    duration?: number;
  };
  /** Whether to disable the button */
  disabled?: boolean;
}
