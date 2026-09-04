import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import type { SharedValue, WithSpringConfig } from "react-native-reanimated";

interface IExpandableRoot {
  children: ReactNode;
  readonly collapsedWidth?: number;
  readonly expandedWidth?: number;
  readonly collapsedHeight?: number;
  readonly expandedHeight?: number;
  readonly collapsedRadius?: number;
  readonly expandedRadius?: number;
  readonly pressSpring?: WithSpringConfig;
  readonly expandSpring?: WithSpringConfig;
  readonly onExpandedChange?: (expanded: boolean) => void;
  readonly style?: StyleProp<ViewStyle>;
}

interface IExpandableSlot {
  children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface IExpandableClose {
  children?: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface IExpandableContext {
  progress: SharedValue<number>;
  expanded: boolean;
  expand: () => void;
  collapse: () => void;
}

export type {
  IExpandableRoot,
  IExpandableSlot,
  IExpandableClose,
  IExpandableContext,
};
