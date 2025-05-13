import type { ImageSourcePropType, ImageStyle, ViewStyle } from "react-native";

export interface AnimatedSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  width?: number;
  height?: number;
  onColor?: string;
  offColor?: string;
  thumbColor?: string;
  thumbSize?: number;
  thumbInset?: number;
  springConfig?: {
    damping?: number;
    stiffness?: number;
    mass?: number;
  };
  style?: ViewStyle;
  testID?: string;
  // Icon properties
  thumbOnIcon?: React.ReactNode;
  thumbOffIcon?: React.ReactNode;
  trackOnIcon?: React.ReactNode;
  trackOffIcon?: React.ReactNode;
  // Background properties
  backgroundImage?: ImageSourcePropType;
  backgroundImageStyle?: ImageStyle;
  // Animation properties
  animateIcons?: boolean;
  iconAnimationType?: "fade" | "rotate" | "scale" | "bounce";
}
