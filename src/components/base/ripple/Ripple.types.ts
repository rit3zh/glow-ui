import type { ReactNode } from "react";

export interface TouchableRippleProps {
  children: ReactNode;
  onPress?: () => void;
  rippleColor?: string;
  radius?: number;
  duration?: number;
  value?: number;
  rippleWidth?: number;
  rippleHeight?: number;
}
