import type { ReactNode } from "react";

export interface ListItemType {
  _name?: string;
  title?: string;
  subtitle?: string;
  leadingIcon?: () => ReactNode;
  trailingIcon?: () => ReactNode;
  onPress?: () => void;
  destructive?: boolean;
}
