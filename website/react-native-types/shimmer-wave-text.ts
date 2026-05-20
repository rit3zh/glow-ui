import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { SharedValue } from "react-native-reanimated";
interface ShimmerConfig {
  readonly duration: number;
  readonly width: number;
  readonly colors: readonly string[];
}

interface FloatConfig {
  readonly duration: number;
  readonly distance: number;
  readonly scaleAmount: number;
  readonly characterDelay: number;
}

interface RoundConfig {
  readonly total: number;
  readonly delayBetween: number;
}

interface ShimmerWaveTextProps {
  readonly text?: string;
  readonly containerStyle?: StyleProp<ViewStyle>;
  readonly textStyle?: StyleProp<TextStyle>;
  readonly textColor?: string;
  readonly shimmerConfig?: Partial<ShimmerConfig>;
  readonly floatConfig?: Partial<FloatConfig>;
  readonly roundConfig?: Partial<RoundConfig>;
}

interface AnimatedCharacterProps {
  readonly char: string;
  readonly charIndex: number;
  readonly style: StyleProp<TextStyle>;
  readonly textColor: string;
  readonly floatConfig: FloatConfig;
  readonly roundTrigger: number;
}

interface AnimationState {
  currentRound: number;
}

interface LayoutDimensions {
  readonly width: number;
  readonly height: number;
}

interface TextRendererProps {
  readonly words: readonly string[];
  readonly textStyle: TextStyle;
  readonly textColor: string;
  readonly floatConfig: FloatConfig;
  readonly roundTrigger: number;
  readonly isMask?: boolean;
}

interface ISyncedAnimatedCharacter extends Omit<
  AnimatedCharacterProps,
  "roundTrigger"
> {
  shimmerProgress: SharedValue<number>;
  totalChars: number;
  shimmerWidth: number;
}

interface ISyncedTextRenderer extends Omit<TextRendererProps, "roundTrigger"> {
  shimmerProgress: SharedValue<number>;
  totalChars: number;
  shimmerWidth: number;
}

export type {
  ShimmerWaveTextProps,
  ShimmerConfig,
  FloatConfig,
  RoundConfig,
  AnimatedCharacterProps,
  AnimationState,
  LayoutDimensions,
  TextRendererProps,
  ISyncedAnimatedCharacter,
  ISyncedTextRenderer,
};
