import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import type { PanGesture } from "react-native-gesture-handler";
import type { SharedValue, WithSpringConfig } from "react-native-reanimated";

type TSplitViewComponents =
  | "SplitView.Bottom"
  | "SplitView.Handle"
  | "SplitView.Top";

interface ISplitViewRoot {
  children: ReactNode;
  readonly initialTopHeight?: number;
  readonly minTopHeight?: number;
  readonly minBottomHeight?: number;
  readonly springConfig?: WithSpringConfig;
  readonly maxTopHeight?: number;
  readonly gap?: number;
  readonly snapPoints?: readonly number[];
  readonly velocityThreshold?: number;
  readonly onHeightChange?: (height: number) => void;
  readonly style?: StyleProp<ViewStyle>;
}

interface ISplitViewPane {
  children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface ISplitViewHandle {
  readonly color?: string;
  readonly style?: StyleProp<ViewStyle>;
  readonly barStyle?: StyleProp<ViewStyle>;
}

interface ISplitViewTitle {
  children: ReactNode;
  readonly style?: StyleProp<TextStyle>;
}

interface ISplitViewContext {
  topHeight: SharedValue<number>;
  handleScale: SharedValue<number>;
  gap: number;
  minTop: number;
  maxTop: number;
  gesture: PanGesture;
}

export type {
  ISplitViewRoot,
  ISplitViewPane,
  ISplitViewHandle,
  ISplitViewTitle,
  ISplitViewContext,
  TSplitViewComponents,
};
