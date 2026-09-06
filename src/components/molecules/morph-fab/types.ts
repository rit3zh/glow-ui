import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import type { SharedValue, WithSpringConfig } from "react-native-reanimated";

enum MorphFabDirection {
  Up = "up",
  Down = "down",
  Left = "left",
  Right = "right",
}

enum MorphFabAlignment {
  Start = "start",
  Center = "center",
  End = "end",
}

type TDirection = "up" | "down" | "left" | "right";
type TAlign = "start" | "center" | "end";
type TMorphFabContextComponents =
  | "MorphFab.Trigger"
  | "MorphFab.Item"
  | "MorphFab.Blob";

interface ISize {
  w: number;
  h: number;
}

interface IRect {
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
}

interface IRegisteredItem extends ISize {
  id: string;
  radius?: number;
  color?: string;
}

interface IGeo {
  layerW: number;
  layerH: number;
  left: number;
  top: number;
  fab: IRect;
  slots: IRect[];
}

interface IGeoConfig {
  triggerSize: ISize;
  items: IRegisteredItem[];
  direction: TDirection;
  align: TAlign;
  sideOffset: number;
  spacing: number;
  itemRadius: number;
  triggerRadius: number;
  padding: number;
}

interface IItemAppearance {
  itemRadius: number;
  itemPadding: number;
  itemGap: number;
  itemSize?: number;
  itemColor?: string;
}

interface IMorphFabRoot extends Partial<IItemAppearance> {
  children: ReactNode;
  readonly open?: boolean;
  readonly defaultOpen?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
  readonly direction?: TDirection;
  readonly align?: TAlign;
  readonly sideOffset?: number;
  readonly spacing?: number;
  readonly triggerRadius?: number;
  readonly triggerColor?: string;
  readonly gooStrength?: number;
  readonly color?: string;
  readonly stagger?: number;
  readonly closeOnSelect?: boolean;
  readonly dismissOnOutsidePress?: boolean;
  readonly openSpringConfig?: WithSpringConfig;
  readonly closeSpringConfig?: WithSpringConfig;
  readonly style?: StyleProp<ViewStyle>;
}

interface IMorphFabTrigger {
  children?: ReactNode;
  readonly size?: number;
  readonly pressScale?: number;
  readonly rotate?: number;
  readonly style?: StyleProp<ViewStyle>;
}

interface IMorphFabItem {
  children: ReactNode;
  readonly value?: string;
  readonly disabled?: boolean;
  readonly onSelect?: (value?: string) => void;
  readonly size?: number;
  readonly radius?: number;
  readonly color?: string;
  readonly padding?: number;
  readonly gap?: number;
  readonly pressScale?: number;
  readonly style?: StyleProp<ViewStyle>;
}

interface IMorphFabItemIcon {
  children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface IMorphFabItemLabel {
  children: ReactNode;
  readonly style?: StyleProp<TextStyle>;
}

interface IMorphFabBlob {
  readonly index: number;
  readonly count: number;
  readonly geo: IGeo;
  readonly progress: SharedValue<number>;
  readonly stagger: number;
  readonly color: string;
}

interface IMorphFabContext extends IItemAppearance {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  progress: SharedValue<number>;
  triggerScale: SharedValue<number>;
  triggerSize: ISize;
  items: IRegisteredItem[];
  registerItem: (id: string) => void;
  unregisterItem: (id: string) => void;
  updateItem: (id: string, patch: Partial<Omit<IRegisteredItem, "id">>) => void;
  selectItem: (value?: string, onSelect?: (value?: string) => void) => void;
  geo: IGeo;
  stagger: number;
}

export type {
  TDirection,
  TAlign,
  TMorphFabContextComponents,
  ISize,
  IRect,
  IRegisteredItem,
  IGeo,
  IGeoConfig,
  IItemAppearance,
  IMorphFabRoot,
  IMorphFabTrigger,
  IMorphFabItem,
  IMorphFabItemIcon,
  IMorphFabItemLabel,
  IMorphFabBlob,
  IMorphFabContext,
};

export { MorphFabAlignment, MorphFabDirection };
