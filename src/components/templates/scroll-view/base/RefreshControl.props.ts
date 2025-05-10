import * as React from "react";
import type { SharedValue } from "react-native-reanimated";

export interface RefreshControlProps {
  progress: SharedValue<number>;
  threshold: number;
  isPulling: SharedValue<boolean>;
  isRefreshing: SharedValue<boolean>;
  pullDistance: SharedValue<number>;
  refreshTriggerDistance: number;
  maxPullDistance: number;
  refreshCompleted?: boolean;
}
export type RefreshControlComponent = React.FC<RefreshControlProps>;
