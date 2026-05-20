import type { TextStyle, StyleProp, ViewStyle } from "react-native";

type LineChangeProps = (lineIndex: number, lineText: string) => void;

interface IThinkingState {
  readonly lines?: string[];
  readonly scrollSpeed?: number;
  readonly lineHeight?: number;
  readonly visibleLines?: number;
  readonly showLineNumbers?: boolean;
  readonly containerStyle?: StyleProp<ViewStyle>;
  readonly codeContainerStyle?: StyleProp<ViewStyle>;
  readonly lineTextStyle?: StyleProp<TextStyle>;
  readonly lineNumberStyle?: StyleProp<TextStyle>;
  readonly onLineChange?: LineChangeProps;
  readonly onCycleComplete?: () => void;
  readonly onStart?: () => void;
  readonly gradientColors?: string[];
  readonly gradientHeight?: string | number;
  readonly gradientLocations?: number[];
  readonly centerLineIndex?: number;
}

export type { IThinkingState };
