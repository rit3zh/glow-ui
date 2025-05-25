import type { ReactNode } from "react";

export interface TouchableProps {
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  scaleTo?: number;
}
