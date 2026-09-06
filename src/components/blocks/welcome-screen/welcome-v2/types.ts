import type { StyleProp, ViewStyle } from "react-native";

export interface IGlyph {
  size?: number;
  color?: string;
}

export interface IWelcomeOrb {
  width: number;
  height: number;
}

export interface IWelcomeScreenV2 {
  title?: string;
  subtitle?: string;
  actionLabel?: string;
  footerPrompt?: string;
  footerActionLabel?: string;
  legalPrefix?: string;
  termsLabel?: string;
  legalSeparator?: string;
  privacyLabel?: string;
  legalSuffix?: string;
  logo?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onActionPress?: () => void;
  onFooterPress?: () => void;
  onTermsPress?: () => void;
  onPrivacyPress?: () => void;
}
