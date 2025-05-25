import type { BlurTint } from "@lodev09/react-native-true-sheet";
import * as React from "react";

export interface WhatsNewProps {
  children: React.ReactNode;
  /**
   * @interface BlurTint
   * @optional
   * The tint color of the blur effect.
   */
  blurTint?: BlurTint;
}
export interface WhatsNewTriggerProps {
  children: React.ReactNode;
}
export interface WhatsNewContentProps {
  children: React.ReactNode;
}

export interface WhatsNewTitleProps {
  children: React.ReactNode;
  secondaryColor?: string;
}

export interface WhatsNewWrapperProps {
  children: React.ReactNode;
}

export interface WhatsNewItemContainerProps {
  children: React.ReactNode;
}
export interface WhatsNewButtonProps {
  children: React.ReactNode;
  tint?: string;
}
