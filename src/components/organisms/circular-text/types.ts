import type { StyleProp, TextStyle, ViewStyle } from "react-native";

type TPressEffect = "accelerate" | "slowDown" | "pause" | null;

interface ICircularText {
  readonly text: string;
  readonly spinDuration?: number;
  readonly pressEffect?: TPressEffect;
  readonly radius?: number;
  readonly fontSize?: number;
  readonly color?: string;
  readonly style?: StyleProp<ViewStyle>;
  readonly textStyle?: StyleProp<TextStyle>;
}

interface ICircularTextLetter {
  readonly letter: string;
  readonly index: number;
  readonly totalLetters: number;
  readonly radius: number;
  readonly fontSize: number;
  readonly color: string;
  readonly containerSize: number;
  readonly textStyle?: StyleProp<TextStyle>;
}

export type { ICircularText, ICircularTextLetter, TPressEffect };
