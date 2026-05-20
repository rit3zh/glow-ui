import type { StyleProp, TextStyle } from "react-native";
import type {
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

interface TextAnimationProps {
  readonly text: string;
  readonly style: StyleProp<TextStyle>;
}

interface CharacterProps {
  readonly char: string;
  readonly style: StyleProp<TextStyle>;
  readonly index: number;
  readonly animationConfig: AnimationConfig;
  readonly enterInitial: CharacterAnimationParams;
  readonly enterFinal: CharacterAnimationParams;
  readonly exitInitial: CharacterAnimationParams;
  readonly exitFinal: CharacterAnimationParams;
}

export {
  SpinButtonProps,
  AnimationConfig,
  ButtonColors,
  SpinnerConfig,
  ButtonStyleConfig,
  CharacterAnimationParams,
  TextAnimationProps,
  CharacterProps,
};
