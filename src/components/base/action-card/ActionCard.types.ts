import * as React from "react";

export interface ActionCardTypes {
  title?: string;
  tint?: string;
  icon?: () => React.ReactNode;
  width?: number;
  height?: number;
}
