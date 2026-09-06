import type { StyleProp, TextStyle } from "react-native";
import type {
  SharedValue,
  WithSpringConfig,
  WithTimingConfig,
} from "react-native-reanimated";

interface AnimationConfig {
  readonly spring: WithSpringConfig;
  readonly timing: WithTimingConfig;
  readonly characterDelay: number;
  readonly characterEnterDuration: number;
  readonly characterExitDuration: number;
  readonly buttonTransitionDuration: number;
  readonly buttonPressDuration: number;
  readonly buttonReleaseDuration: number;
  readonly spinnerEnterDuration: number;
  readonly spinnerExitDuration: number;
  readonly colorTransitionDuration: number;
}

interface CharacterAnimationParams {
  readonly opacity: number;
  readonly translateY: number;
  readonly scale: number;
}

interface ButtonColors {
  readonly idle: {
    readonly background: string;
    readonly text: string;
  };
  readonly active: {
    readonly background: string;
    readonly text: string;
  };
}

interface SpinnerConfig {
  readonly size: number;
  readonly strokeWidth: number;
  readonly color: string;
  readonly containerSize: number;
  readonly containerBackground: string;
  /** Time for one full rotation, in milliseconds. */
  readonly duration: number;
  /** Length of the arc as a fraction of the circle (0–1). */
  readonly arc: number;
  readonly position: {
    readonly right: number;
    readonly bottom: number;
  };
}

interface ButtonStyleConfig {
  readonly paddingHorizontal: number;
  readonly paddingVertical: number;
  readonly borderRadius: number;
  readonly fontSize: number;
  readonly fontWeight: TextStyle["fontWeight"];
}

interface SpinButtonProps {
  readonly idleText?: string;
  readonly activeText?: string;
  readonly colors?: Partial<ButtonColors>;
  readonly animationConfig?: Partial<AnimationConfig>;
  readonly spinnerConfig?: Partial<SpinnerConfig>;
  readonly buttonStyle?: Partial<ButtonStyleConfig>;
  readonly onPress?: (isActive: boolean) => void;
  readonly onStateChange?: (isActive: boolean) => void;
  readonly initialState?: boolean;
  readonly disabled?: boolean;
  readonly controlled?: boolean;
  readonly isActive?: boolean;
}

/** Whether a label layer is the one coming in or the one going out. */
type CharacterMode = "enter" | "exit";

/**
 * Character timings, normalized to the 0-1 transition progress so every label
 * finishes within a single shared value sweep.
 */
interface CharacterTimeline {
  readonly delay: number;
  readonly exitSpan: number;
  readonly enterSpan: number;
  readonly enterOffset: number;
}

interface CharacterProps {
  readonly char: string;
  readonly style: StyleProp<TextStyle>;
  readonly progress: SharedValue<number>;
  readonly colorProgress: SharedValue<number>;
  readonly start: number;
  readonly end: number;
  readonly mode: CharacterMode;
  readonly idleColor: string;
  readonly activeColor: string;
  readonly enterInitial: CharacterAnimationParams;
  readonly exitFinal: CharacterAnimationParams;
}

interface LabelLayerProps {
  readonly text: string;
  readonly style: StyleProp<TextStyle>;
  readonly progress: SharedValue<number>;
  readonly colorProgress: SharedValue<number>;
  readonly timeline: CharacterTimeline;
  readonly mode: CharacterMode;
  readonly idleColor: string;
  readonly activeColor: string;
  readonly enterInitial: CharacterAnimationParams;
  readonly exitFinal: CharacterAnimationParams;
}

export {
  SpinButtonProps,
  AnimationConfig,
  ButtonColors,
  SpinnerConfig,
  ButtonStyleConfig,
  CharacterAnimationParams,
  CharacterMode,
  CharacterTimeline,
  CharacterProps,
  LabelLayerProps,
};
