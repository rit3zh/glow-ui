import type { StyleProp, TextStyle } from "react-native";

interface IAnimatedMaskedText {
  children: string;
  readonly speed?: number;
  readonly textWaveLength?: number;
  /**
   *
   *
   * @type {string[]}
   * @memberof AnimatedMaskedTextProps
   * @description The first color in the array is always going to be "transparent."
   */
  readonly colors?: string[];
  readonly baseTextColor?: string;
  readonly style?: StyleProp<TextStyle>;
}

export type { IAnimatedMaskedText };
