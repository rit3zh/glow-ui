import type { StyleProp, ViewStyle } from "react-native";

export interface IGlyph {
  size?: number;
  color?: string;
}

export type WelcomeActionVariant = "primary" | "secondary";

export interface IWelcomeAction {
  key: string;
  label: string;
  icon?: "apple" | "google";
  variant?: WelcomeActionVariant;
}

export interface IWelcomeActionRow {
  action: IWelcomeAction;
  onPress?: (action: IWelcomeAction) => void;
}

export interface IWelcomeCard {
  key: string;
  size: number;
  top: number;
  left: number;
  rotate: number;
}

export interface IWelcomeScreenV3 {
  wordmark?: string;
  titleLines?: string[];
  actions?: IWelcomeAction[];
  legalPrefix?: string;
  termsLabel?: string;
  legalSeparator?: string;
  privacyLabel?: string;
  logo?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onActionPress?: (action: IWelcomeAction) => void;
  onTermsPress?: () => void;
  onPrivacyPress?: () => void;
}
