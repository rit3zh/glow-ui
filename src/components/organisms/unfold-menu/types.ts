import type { ReactNode } from "react";
import type { SharedValue } from "react-native-reanimated";
import type {
  LayoutChangeEvent,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";

type TUnfoldMenuTheme = "light" | "dark";

interface IUnfoldMenuPalette {
  readonly surface: string;
  readonly border: string;
  readonly text: string;
  readonly mutedText: string;
}

interface IUnfoldMenuIconState {
  readonly color: string;
  readonly size: number;
}

type TUnfoldMenuSlot = "anchor" | "overlay" | "float";

interface IUnfoldMenuPoint {
  x: number;
  y: number;
}

interface IUnfoldMenuRect extends IUnfoldMenuPoint {
  w: number;
  h: number;
}

interface IUnfoldMenuMorph {
  iconStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  onLabelLayout?: (event: LayoutChangeEvent) => void;
}

interface IUnfoldMenuContext {
  open: boolean;
  overlayVisible: boolean;
  requestOpen: () => void;
  setOpen: (open: boolean) => void;
  select: (value?: string) => void;
  progress: SharedValue<number>;
  reveal: SharedValue<number>;
  handoff: SharedValue<number>;
  panelWidth: number;
  registerPanel: (height: number) => void;
  anchorRect: IUnfoldMenuRect;
  panelOrigin: IUnfoldMenuPoint;
  labelOrigin: SharedValue<IUnfoldMenuPoint>;
  titleOrigin: SharedValue<IUnfoldMenuPoint>;
  registerLabelOrigin: (point: IUnfoldMenuPoint) => void;
  registerTitleOrigin: (point: IUnfoldMenuPoint) => void;
  palette: IUnfoldMenuPalette;
  iconSize: number;
  reduceMotion: boolean;
}

interface IUnfoldMenuGridContext {
  index: number;
  count: number;
  columns: number;
}

interface IUnfoldMenu {
  children: ReactNode;
  readonly open?: boolean;
  readonly defaultOpen?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
  readonly onSelect?: (value?: string) => void;
  readonly closeOnSelect?: boolean;
  readonly panelWidth?: number;
  readonly screenMargin?: number;
  readonly radius?: number;
  readonly iconSize?: number;
  readonly theme?: TUnfoldMenuTheme;
  readonly palette?: Partial<IUnfoldMenuPalette>;
  readonly style?: StyleProp<ViewStyle>;
}

interface IUnfoldMenuTrigger {
  children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface IUnfoldMenuContent {
  children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface IUnfoldMenuHeader {
  children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface IUnfoldMenuTitle {
  children: ReactNode;
  readonly style?: StyleProp<TextStyle>;
}

interface IUnfoldMenuClose {
  children?: ReactNode | ((state: IUnfoldMenuIconState) => ReactNode);
  readonly style?: StyleProp<ViewStyle>;
}

interface IUnfoldMenuGrid {
  children: ReactNode;
  readonly columns?: number;
  readonly style?: StyleProp<ViewStyle>;
}

interface IUnfoldMenuItem {
  children: ReactNode;
  readonly value?: string;
  readonly onPress?: () => void;
  readonly disabled?: boolean;
  readonly style?: StyleProp<ViewStyle>;
}

interface IUnfoldMenuIcon {
  children: ReactNode | ((state: IUnfoldMenuIconState) => ReactNode);
  readonly style?: StyleProp<ViewStyle>;
}

interface IUnfoldMenuLabel {
  children: ReactNode;
  readonly style?: StyleProp<TextStyle>;
}

export type {
  IUnfoldMenu,
  IUnfoldMenuClose,
  IUnfoldMenuContent,
  IUnfoldMenuContext,
  IUnfoldMenuGrid,
  IUnfoldMenuGridContext,
  IUnfoldMenuHeader,
  IUnfoldMenuIcon,
  IUnfoldMenuIconState,
  IUnfoldMenuItem,
  IUnfoldMenuLabel,
  IUnfoldMenuMorph,
  IUnfoldMenuPalette,
  IUnfoldMenuPoint,
  IUnfoldMenuRect,
  IUnfoldMenuTitle,
  IUnfoldMenuTrigger,
  TUnfoldMenuSlot,
  TUnfoldMenuTheme,
};
