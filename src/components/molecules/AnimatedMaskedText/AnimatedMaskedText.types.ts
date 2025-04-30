import type { StyleProp, TextStyle } from "react-native";

export interface AnimatedMaskedTextProps {
  children: string;
  speed?: number;
  /**
   *
   *
   * @type {string[]}
   * @memberof AnimatedMaskedTextProps
   * @description The first color in the array is always going to be "transparent."
   */
  colors?: string[];

  style?: StyleProp<TextStyle>;
}
