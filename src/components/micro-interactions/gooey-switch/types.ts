import type { SharedValue, WithSpringConfig } from "react-native-reanimated";

interface ICoreOval {
  cx: SharedValue<number>;
  cy: number;
  rx: SharedValue<number>;
  ry: SharedValue<number>;
  progress: SharedValue<number>;
  onColor: string;
  offColor: string;
}

interface IShadowOval {
  cx: SharedValue<number>;
  cy: number;
  rx: SharedValue<number>;
  ry: SharedValue<number>;
  color: string;
}

interface IAnimatedBridge {
  leftX: number;
  rightX: number;
  cy: number;
  mainX: SharedValue<number>;
  height: number;
  color: string;
  progress: SharedValue<number>;
}

interface IBlobConfig {
  readonly stretchX?: number;
  readonly squishY?: number;
  readonly sideBlobScale?: number;
}
interface BridgeConfig {
  readonly show?: boolean;
  readonly height?: number;
  readonly offset?: number;
}
interface IconRender {
  size: number;
  color: string;
}
interface IGooeySwitch {
  readonly active?: boolean;
  readonly onToggle?: (active: boolean) => void;
  readonly size?: number;
  readonly inactiveColor?: string;
  readonly activeColor?: string;
  readonly trackColor?: string;
  readonly iconTint?: string;
  readonly toggleThreshold?: number;
  readonly isDisabled?: boolean;
  readonly showIcons?: boolean;
  readonly animation?: WithSpringConfig;
  readonly deformation?: IBlobConfig;
  readonly connector?: BridgeConfig;
  readonly blur?: number;
  readonly gooey?: number;
  readonly renderActiveIcon?: (props: IconRender) => React.ReactNode;
  readonly renderInactiveIcon?: (props: IconRender) => React.ReactNode;
  readonly onDragBegin?: () => void;
  readonly onDragFinish?: (active: boolean) => void;
}

export type {
  IGooeySwitch,
  IBlobConfig,
  BridgeConfig,
  IconRender,
  IShadowOval,
  IAnimatedBridge,
  ICoreOval,
};
