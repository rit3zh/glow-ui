import type { StyleProp, ViewStyle } from "react-native";

export interface IGlyph {
  size?: number;
  color?: string;
}

export type WelcomeActionVariant = "primary" | "secondary";

export interface IWelcomeAction {
  key: string;
  label: string;
  icon?: "apple";
  variant?: WelcomeActionVariant;
}

export interface IWelcomeActionRow {
  action: IWelcomeAction;
  onPress?: (action: IWelcomeAction) => void;
}

export type IWelcomeToken =
  | { kind: "word"; text: string; muted?: boolean }
  | { kind: "avatar"; background: string; emoji?: string; source?: string };

export interface IWelcomeLegalLink {
  key: string;
  label: string;
  onPress?: () => void;
}

export interface IWelcomeScreenV4 {
  wordmark?: string;
  headline?: IWelcomeToken[];
  actions?: IWelcomeAction[];
  legalPrefix?: string;
  legalLinks?: IWelcomeLegalLink[];
  legalSuffix?: string;
  logo?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onActionPress?: (action: IWelcomeAction) => void;
}
