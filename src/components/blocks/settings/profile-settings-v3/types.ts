import { IconSvgElement } from "@hugeicons/react-native";
import type { ImageSourcePropType, StyleProp, ViewStyle } from "react-native";

export interface IGlyph {
  size?: number;
  colors?: readonly [string, string, string];
}

export type TSettingsRowAccessory = "chevron" | "switch" | "value" | "none";

export interface ISettingsRow {
  id: string;
  title: string;
  icon: IconSvgElement;
  accessory?: TSettingsRowAccessory;
  value?: string;
  defaultChecked?: boolean;
}

export interface ISettingsSection {
  id: string;
  label?: string;
  rows: ISettingsRow[];
}

export interface ISettingsProfile {
  name: string;
  email?: string;
  avatar?: ImageSourcePropType;
}

export interface ISettingsPromo {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  colors?: readonly [string, string];
}

export interface ISettingsRowItem extends ISettingsRow {
  isLast: boolean;
  checked?: boolean;
  onPress?: (id: string) => void;
  onToggle?: (id: string, checked: boolean) => void;
}

export interface IProfileSettingsV3 {
  title?: string;
  profile?: ISettingsProfile;
  promo?: ISettingsPromo;
  sections?: ISettingsSection[];
  hideBack?: boolean;
  hideSearch?: boolean;
  style?: StyleProp<ViewStyle>;
  onBackPress?: () => void;
  onSearchPress?: () => void;
  onProfilePress?: () => void;
  onPromoPress?: () => void;
  onRowPress?: (id: string) => void;
  onRowToggle?: (id: string, checked: boolean) => void;
}
