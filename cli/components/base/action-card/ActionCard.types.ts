import * as React from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

export interface ActionCardTypes {
  children: React.ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export interface ActionCardWrapperTypes {
  children: React.ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export interface ActionCardTitleTypes {
  children: React.ReactNode;
  className?: string;
  style?: StyleProp<TextStyle>;
}
export interface ActionCardSubtitleTypes {
  children: React.ReactNode;
  className?: string;
  style?: StyleProp<TextStyle>;
}
