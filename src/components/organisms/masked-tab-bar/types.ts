import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";

type TMaskedTabBarTheme = "light" | "dark";
type TMaskedTabBarLayer = "base" | "active";

interface IMaskedTabBox {
  readonly x: number;
  readonly width: number;
}

interface IMaskedTabBoxEntry extends IMaskedTabBox {
  readonly value: string;
  readonly disabled: boolean;
}

interface IMaskedTabBarPalette {
  readonly track: string;
  readonly pill: string;
  readonly inactive: string;
  readonly active: string;
}

interface IMaskedTabIconState {
  readonly color: string;
  readonly size: number;
  readonly active: boolean;
}

interface IMaskedTabBarContext {
  value: string;
  setValue: (value: string) => void;
  registerTrigger: (
    value: string,
    box: IMaskedTabBox,
    disabled: boolean,
  ) => void;
  boxes: IMaskedTabBoxEntry[];
  listWidth: number;
  setListWidth: (width: number) => void;
  pillX: SharedValue<number>;
  pillWidth: SharedValue<number>;
  press: SharedValue<number>;
  grabbed: SharedValue<boolean>;
  palette: IMaskedTabBarPalette;
  height: number;
  radius: number;
  padding: number;
  gap: number;
  iconSize: number;
  fontSize: number;
  fontWeight: TextStyle["fontWeight"];
  draggable: boolean;
}

interface IMaskedTabBarRoot {
  children: ReactNode;
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onValueChange?: (value: string) => void;
  readonly theme?: TMaskedTabBarTheme;
  readonly palette?: Partial<IMaskedTabBarPalette>;
  readonly height?: number;
  readonly radius?: number;
  readonly padding?: number;
  readonly gap?: number;
  readonly iconSize?: number;
  readonly fontSize?: number;
  readonly fontWeight?: TextStyle["fontWeight"];
  readonly draggable?: boolean;
  readonly style?: StyleProp<ViewStyle>;
}

interface IMaskedTabBarList {
  children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface IMaskedTabBarTrigger {
  children: ReactNode;
  readonly value: string;
  readonly disabled?: boolean;
  readonly style?: StyleProp<ViewStyle>;
}

interface IMaskedTabBarLabel {
  children: ReactNode;
  readonly style?: StyleProp<TextStyle>;
}

interface IMaskedTabBarIcon {
  children: ReactNode | ((state: IMaskedTabIconState) => ReactNode);
  readonly size?: number;
  readonly style?: StyleProp<ViewStyle>;
}

export type {
  IMaskedTabBarContext,
  IMaskedTabBarIcon,
  IMaskedTabBarLabel,
  IMaskedTabBarList,
  IMaskedTabBarPalette,
  IMaskedTabBarRoot,
  IMaskedTabBarTrigger,
  IMaskedTabBox,
  IMaskedTabBoxEntry,
  IMaskedTabIconState,
  TMaskedTabBarLayer,
  TMaskedTabBarTheme,
};
