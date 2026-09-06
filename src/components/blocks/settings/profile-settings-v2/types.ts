import { IconSvgElement } from "@hugeicons/react-native";
import type { ImageSourcePropType, StyleProp, ViewStyle } from "react-native";

export interface IGlyph {
  size?: number;
  color?: string;
}

export type TSettingsRowAccessory = "chevron" | "external" | "none";

export interface ISettingsRow {
  id: string;
  title: string;
  icon: IconSvgElement;
  value?: string;
  accessory?: TSettingsRowAccessory;
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
  onPress?: (id: string) => void;
}

export interface IProfileSettingsV2 {
  title?: string;
  profile?: ISettingsProfile;
  sections?: ISettingsSection[];
  hideBack?: boolean;
  style?: StyleProp<ViewStyle>;
  onBackPress?: () => void;
  onProfilePress?: () => void;
  onRowPress?: (id: string) => void;
}
