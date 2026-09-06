import type { StyleProp, ViewStyle } from "react-native";

interface IAuraLiftContext {
  toggle: () => void;
  readonly isRunning?: boolean;
}

interface IAuraLiftProvider {
  children: React.ReactNode;
  readonly duration?: number;
  /**
   * Applied to the wrapper that is captured and overlaid. Defaults to
   * `flex: 1` (full screen) — pass a width/height/borderRadius to scope the
   * effect to a box instead.
   */
  readonly style?: StyleProp<ViewStyle>;
}

export type { IAuraLiftContext, IAuraLiftProvider };
