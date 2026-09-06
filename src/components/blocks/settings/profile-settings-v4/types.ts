import { IconSvgElement } from "@hugeicons/react-native";
import type { ImageSourcePropType, StyleProp, ViewStyle } from "react-native";

export interface IGlyph {
  size?: number;
  color?: string;
}

export type TSettingsRowAccessory = "chevron" | "value" | "switch" | "none";

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

export interface ISettingsRowItem extends ISettingsRow {
  isLast: boolean;
  checked?: boolean;
  onPress?: (id: string) => void;
  onToggle?: (id: string, checked: boolean) => void;
}

export interface IProfileSettingsV4 {
  title?: string;
  subtitle?: string;
  profile?: ISettingsProfile;
  sections?: ISettingsSection[];
  logoutLabel?: string;
  deleteLabel?: string;
  versionLabel?: string;
  hideEdit?: boolean;
  hideDelete?: boolean;
  style?: StyleProp<ViewStyle>;
  onEditPress?: () => void;
  onRowPress?: (id: string) => void;
  onRowToggle?: (id: string, checked: boolean) => void;
  onLogoutPress?: () => void;
  onDeletePress?: () => void;
}
