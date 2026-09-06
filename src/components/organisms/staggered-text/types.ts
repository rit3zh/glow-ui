import type { EasingFunction, SharedValue } from "react-native-reanimated";

type TStaggerFrom = "leading" | "center" | "edges" | "random" | "trailing";
type TResolvedChar = Required<ICharacterAnimationParams>;
type TResolvedConfig = Required<IAnimationConfig>;

interface IAnimationConfig {
  readonly duration?: number;
  readonly repeatDelay?: number;
  readonly characterDelay?: number;
  readonly enterEasing?: EasingFunction;
  readonly exitEasing?: EasingFunction;
  readonly repeatCount?: number;
}

interface ICharacterAnimationParams {
  translateY?: number;
  opacity?: number;
  blur?: number;
  scale?: number;
}

interface ICharacterRenderer<T> {
  char: string;
  x: number;
  y: number;
  font: NonNullable<T>;
  fontSize: number;
  color: string;
  from: TResolvedChar;
  to: TResolvedChar;
  progress: SharedValue<number>;
}

interface ITransitionCharacter<T> {
  char: string;
  x: number;
  y: number;
  delay: number;
  font: NonNullable<T>;
  fontSize: number;
  color: string;
  from: TResolvedChar;
  to: TResolvedChar;
  direction: "in" | "out";
  config: TResolvedConfig;
  triggerSnapshot: number;
}

interface ICharacterAnimationParams {
  translateY?: number;
  opacity?: number;
  blur?: number;
  scale?: number;
}

interface IStaggeredCharacterLayer<T> {
  texts: string[];
  activeIndex: number;
  fontSize: number;
  color: string;
  font: NonNullable<T>;
  height: number;
  staggerFrom: TStaggerFrom;
  enterFrom: TResolvedChar;
  enterTo: TResolvedChar;
  exitFrom: TResolvedChar;
  exitTo: TResolvedChar;
  config: TResolvedConfig;
  letterSpacing: number;
}

interface ICharacterMetrics {
  char: string;
  x: number;
  width: number;
  delay: number;
}

interface ITextMetrics {
  characters: ICharacterMetrics[];
  width: number;
}

interface IStaggeredText {
  texts: string[];
  readonly activeIndex?: number;
  readonly fontSize?: number;
  readonly color?: string;
  readonly fontPath?: ReturnType<typeof require>;
  readonly height?: number;
  readonly staggerFrom?: TStaggerFrom;
  readonly letterSpacing?: number;
  readonly enterFrom?: ICharacterAnimationParams;
  readonly enterTo?: ICharacterAnimationParams;
  readonly exitFrom?: ICharacterAnimationParams;
  readonly exitTo?: ICharacterAnimationParams;
  readonly animationConfig?: IAnimationConfig;
}

export type {
  IStaggeredText,
  IAnimationConfig,
  ICharacterAnimationParams,
  TStaggerFrom,
  IStaggeredCharacterLayer,
  TResolvedConfig,
  TResolvedChar,
  ICharacterMetrics,
  ITextMetrics,
  ITransitionCharacter,
  ICharacterRenderer,
};
