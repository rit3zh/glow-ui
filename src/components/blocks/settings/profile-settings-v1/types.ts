import { IconSvgElement } from "@hugeicons/react-native";
import type { ImageSourcePropType, StyleProp, ViewStyle } from "react-native";

export interface IGlyph {
  size?: number;
  color?: string;
}

export type TSettingsRowAccessory = "chevron" | "external" | "none";

export type TSettingsRowIcon =
  | { kind: "hugeicon"; icon: IconSvgElement }
  | { kind: "instagram" }
  | { kind: "reddit" };

export interface ISettingsRow {
  id: string;
  title: string;
  icon?: TSettingsRowIcon;
  accessory?: TSettingsRowAccessory;
}

export interface ISettingsSection {
  id: string;
  label?: string;
  rows: ISettingsRow[];
}

export interface ISettingsHeader {
  name: string;
  avatar?: ImageSourcePropType;
}

export interface ISettingsRowItem extends ISettingsRow {
  isLast: boolean;
  onPress?: (id: string) => void;
}

export interface IProfileSettingsV1 {
  header?: ISettingsHeader;
  sections?: ISettingsSection[];
  hideClose?: boolean;
  style?: StyleProp<ViewStyle>;
  onClosePress?: () => void;
  onRowPress?: (id: string) => void;
}
