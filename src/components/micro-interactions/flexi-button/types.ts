import { Ionicons } from "@expo/vector-icons";
import React from "react";

interface Dimensions {
  width: number;
  height: number;
  x: number;
  y: number;
}

type IconName = keyof typeof Ionicons.glyphMap;
type IconRenderFn = () => React.JSX.Element & React.ReactNode;

interface FlexiButtonProps {
  onPress?: () => void;
  collapsedWidth?: number;
  expandedWidth?: number;
  text?: string;
  icon?: IconName | IconRenderFn;
  onDimensionsChange?: (dimensions: Dimensions) => void;
  backgroundColor?: string;
}

export { FlexiButtonProps, Dimensions };
