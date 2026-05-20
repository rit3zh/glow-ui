import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

interface ISettingsRoot {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

interface ISettingsSectionProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

interface ISettingsGroupProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

interface ISettingsLabelProps {
  children: string;
}

interface ISettingsFooterProps {
  children: string;
}

interface ISettingsItemProps {
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

interface ISettingsIconProps {
  icon: ReactNode;
  color?: string;
  size?: number;
  borderRadius?: number;
}

interface ISettingsContentProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

interface ISettingsTitleProps {
  children: string;
  style?: StyleProp<TextStyle>;
}

interface ISettingsValueProps {
  children: string;
}

interface ISettingsSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

interface ISettingsChevronProps {
  color?: string;
  size?: number;
}

interface ISettingsSeparatorProps {
  inset?: number;
}
interface ISettingsGroupContext {
  hasIcon: boolean;
}

export type {
  ISettingsRoot,
  ISettingsSectionProps,
  ISettingsGroupProps,
  ISettingsLabelProps,
  ISettingsGroupContext,
  ISettingsFooterProps,
  ISettingsItemProps,
  ISettingsIconProps,
  ISettingsContentProps,
  ISettingsTitleProps,
  ISettingsValueProps,
  ISettingsSwitchProps,
  ISettingsChevronProps,
  ISettingsSeparatorProps,
};
