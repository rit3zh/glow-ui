import type { ReactNode } from "react";
import type { StyleProp, ViewStyle, TextStyle } from "react-native";
import type { SharedValue, WithSpringConfig } from "react-native-reanimated";

type TFanOffset = number | IOffSet;
type TFanDirection = "up" | "down" | "left" | "right";
type TFanPosition =
  | "bottom-right"
  | "bottom-left"
  | "bottom-center"
  | "top-right"
  | "top-left"
  | "top-center";
type TItemDirection = "up" | "down" | "left" | "right" | "none";

interface IOffSet {
  vertical: number;
  horizontal: number;
}
enum FanItemDirection {
  Up = "up",
  Down = "down",
  Left = "left",
  Right = "right",
  None = "none",
}

enum FanPosition {
  BottomRight = "bottom-right",
  BottomLeft = "bottom-left",
  BottomCenter = "bottom-center",
  TopRight = "top-right",
  TopLeft = "top-left",
  TopCenter = "top-center",
}

enum FanDirection {
  Up = "up",
  Down = "down",
  Left = "left",
  Right = "right",
}

interface IResolvedConfig {
  readonly baseAngle: number;
  readonly sweep: number;
  readonly spread: number;
  readonly spacing: number;
  readonly tilt: number;
  readonly springConfig: WithSpringConfig;
  readonly stagger: number;
}

interface IFanMenu {
  children: ReactNode;
  readonly open?: boolean;
  readonly defaultOpen?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
  readonly onOpen?: () => void;
  readonly onClose?: () => void;
  readonly position?: TFanPosition;
  readonly offset?: TFanOffset;
  readonly direction?: TFanDirection;
  readonly itemDirection?: TItemDirection;
  readonly spacing?: number;
  readonly spread?: number;
  readonly tilt?: number;
  readonly stagger?: number;
  readonly springConfig?: WithSpringConfig;
  readonly buttonSize?: number;
  readonly closeOnBackdropPress?: boolean;
  readonly style?: StyleProp<ViewStyle>;
}

interface IFanTrigger {
  readonly children?: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface IFanItem {
  readonly children: ReactNode;
  readonly value?: string;
  readonly onPress?: (value?: string) => void;
  readonly style?: StyleProp<ViewStyle>;
}

interface IFanItemIcon {
  readonly children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface IFanItemLabel {
  readonly children: ReactNode;
  readonly style?: StyleProp<TextStyle>;
}

interface IFanContext {
  readonly progress: SharedValue<number>;
  readonly isOpen: boolean;
  readonly open: () => void;
  readonly close: () => void;
  readonly toggle: () => void;
  readonly pressItem: (
    value: string | undefined,
    cb?: (v?: string) => void,
  ) => void;
  readonly registerItem: (id: string) => void;
  readonly unregisterItem: (id: string) => void;
  readonly order: string[];
  readonly config: IResolvedConfig;
  readonly buttonSize: number;
}

export type {
  TFanDirection,
  TItemDirection,
  TFanPosition,
  TFanOffset,
  IResolvedConfig,
  IFanMenu,
  IFanTrigger,
  IFanItem,
  IFanItemIcon,
  IFanItemLabel,
  IFanContext,
};

export { FanDirection, FanItemDirection, FanPosition };
