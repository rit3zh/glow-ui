import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import type { PanGesture } from "react-native-gesture-handler";
import type { LayoutChangeEvent } from "react-native";
import type { SharedValue } from "react-native-reanimated";

type Region = "left" | "middle" | "right";

interface IElasticSliderContext {
  readonly value: SharedValue<number>;
  readonly overflow: SharedValue<number>;
  readonly region: SharedValue<Region>;
  readonly scale: SharedValue<number>;
  readonly sliderWidth: SharedValue<number>;
  readonly min: number;
  readonly max: number;
  readonly step: number;
  readonly isStepped: boolean;
  readonly gesture: PanGesture;
  readonly onTrackLayout: (event: LayoutChangeEvent) => void;
}

interface IElasticSliderRoot {
  children?: ReactNode;
  readonly value?: number;
  readonly defaultValue?: number;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly isStepped?: boolean;
  readonly onValueChange?: (value: number) => void;
  readonly onDragStart?: () => void;
  readonly onDragEnd?: (finalValue: number) => void;
  readonly style?: StyleProp<ViewStyle>;
}

interface IElasticSliderTrack {
  children?: ReactNode;
  readonly color?: string;
  readonly style?: StyleProp<ViewStyle>;
}

interface IElasticSliderFill {
  readonly color?: string;
  readonly style?: StyleProp<ViewStyle>;
}

interface IElasticSliderAccessory {
  children?: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface IElasticSliderValue {
  readonly format?: (value: number) => string;
  readonly style?: StyleProp<TextStyle>;
}

export type {
  Region,
  IElasticSliderContext,
  IElasticSliderRoot,
  IElasticSliderTrack,
  IElasticSliderFill,
  IElasticSliderAccessory,
  IElasticSliderValue,
};
