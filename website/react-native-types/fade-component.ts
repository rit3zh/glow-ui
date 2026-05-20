import type { ReactNode } from "react";
import type { SharedValue } from "react-native-reanimated";

interface IFadeHandle {
  toggle: () => void;
  from?: () => void;
  to?: () => void;
}

interface IFadeContext {
  progress: SharedValue<number>;
}

interface IFadeComponent {
  children: ReactNode;
}

export type { IFadeComponent, IFadeContext, IFadeHandle };
