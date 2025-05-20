import type { StyleProp, TextStyle, ViewStyle } from "react-native";

export interface AnimatedCheckboxProps {
  /** Whether the checkbox is checked */
  checked: boolean;
  /** Function called when checkbox is pressed */
  onPress: (checked: boolean) => void;
  /** Size of the checkbox (width and height) */
  size?: number;
  /** Border radius of the checkbox */
  borderRadius?: number;
  /** Color when checkbox is checked */
  activeColor?: string;
  /** Color when checkbox is unchecked */
  inactiveColor?: string;
  /** Border color when checkbox is unchecked */
  borderColor?: string;
  /** Border width */
  borderWidth?: number;
  /** Check mark color */
  checkMarkColor?: string;
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** Label to display next to checkbox */
  label?: string;
  /** Position of the label relative to checkbox */
  labelPosition?: "left" | "right";
  /** Additional styling for the container */
  containerStyle?: StyleProp<ViewStyle>;
  /** Additional styling for the checkbox */
  checkboxStyle?: StyleProp<ViewStyle>;
  /** Style for the label text */
  labelStyle?: StyleProp<TextStyle>;
  /** Whether checkbox is disabled */
  disabled?: boolean;
  /** Whether to use bounce animation */
  bounceEffect?: boolean;
  /** Whether to use ripple effect when pressing */
  rippleEffect?: boolean;
}
