import * as React from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface IPrivacyNoticeLinkProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;

  onPress?: () => void;
  size?: number | 14;
  tint?: string;
}
