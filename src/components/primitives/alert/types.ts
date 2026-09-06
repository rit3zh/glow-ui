import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

type TAlertVariant = "default" | "destructive" | "success" | "warning";
type TAlertTheme = "light" | "dark";
type TAlertContext = "Alert.Icon" | "Alert.Content" | "Alert.Title" | "Alert.Description";

interface IAlertPalette {
  bg: string;
  border: string;
  icon: string;
  iconBg: string;
  title: string;
  description: string;
}

interface IAlertRoot {
  children: ReactNode;
  readonly variant?: TAlertVariant;
  readonly theme?: TAlertTheme;
  readonly style?: StyleProp<ViewStyle>;
}

interface IAlertIcon {
  children?: ReactNode;
}

interface IAlertContent {
  children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface IAlertTitle {
  children: ReactNode;
  readonly style?: StyleProp<TextStyle>;
}

interface IAlertDescription {
  children: ReactNode;
  readonly style?: StyleProp<TextStyle>;
}

interface IAlertContextValue {
  variant: TAlertVariant;
  palette: IAlertPalette;
}

export type {
  TAlertVariant,
  TAlertTheme,
  TAlertContext,
  IAlertPalette,
  IAlertRoot,
  IAlertIcon,
  IAlertContent,
  IAlertTitle,
  IAlertDescription,
  IAlertContextValue,
};
