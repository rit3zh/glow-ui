import type { StyleProp, ViewStyle } from "react-native";

export interface IGlyph {
  size?: number;
  color?: string;
}

export type WelcomeActionVariant = "primary" | "secondary";

export interface IWelcomeAction {
  key: string;
  label: string;
  icon: "apple" | "google" | "email";
  variant?: WelcomeActionVariant;
}

export interface IWelcomeActionRow {
  action: IWelcomeAction;
  onPress?: (action: IWelcomeAction) => void;
}

export interface IWelcomeScreen {
  title?: string;
  subtitle?: string;
  actions?: IWelcomeAction[];
  logo?: React.ReactNode;
  gradientRatio?: number;
  style?: StyleProp<ViewStyle>;
  onActionPress?: (action: IWelcomeAction) => void;
}
