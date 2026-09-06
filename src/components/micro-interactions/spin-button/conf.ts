import { Easing } from "react-native-reanimated";
import type {
  AnimationConfig,
  ButtonColors,
  ButtonStyleConfig,
  CharacterAnimationParams,
  SpinnerConfig,
} from "./types";

const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  spring: {
    damping: 20,
    stiffness: 300,
    mass: 0.5,
  },
  timing: {
    duration: 200,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  },
  characterDelay: 25,
  characterEnterDuration: 200,
  characterExitDuration: 200,
  buttonTransitionDuration: 250,
  buttonPressDuration: 80,
  buttonReleaseDuration: 150,
  spinnerEnterDuration: 250,
  spinnerExitDuration: 200,
  colorTransitionDuration: 300,
};

const DEFAULT_CHARACTER_ENTER_INITIAL: CharacterAnimationParams = {
  opacity: 0,
  translateY: 20,
  scale: 0.5,
};

const DEFAULT_CHARACTER_ENTER_FINAL: CharacterAnimationParams = {
  opacity: 1,
  translateY: 0,
  scale: 1,
};

const DEFAULT_CHARACTER_EXIT_INITIAL: CharacterAnimationParams = {
  opacity: 1,
  translateY: 0,
  scale: 1,
};

const DEFAULT_CHARACTER_EXIT_FINAL: CharacterAnimationParams = {
  opacity: 0,
  translateY: -20,
  scale: 0.5,
};

const DEFAULT_BUTTON_COLORS: ButtonColors = {
  idle: {
    background: "#e6e6e6",
    text: "#000000",
  },
  active: {
    background: "#121212",
    text: "#FFFFFF",
  },
};

const DEFAULT_SPINNER_CONFIG: SpinnerConfig = {
  size: 20,
  strokeWidth: 1.6,
  color: "#FFFFFF",
  containerSize: 35,
  containerBackground: "#121212",
  duration: 900,
  arc: 0.28,
  position: {
    right: -12,
    bottom: 20,
  },
};

const DEFAULT_BUTTON_STYLE: ButtonStyleConfig = {
  paddingHorizontal: 40,
  paddingVertical: 12,
  borderRadius: 99,
  fontSize: 17,
  fontWeight: "700",
};

const BUTTON_SCALE = {
  pressed: 0.96,
  released: 1,
} as const;

export {
  DEFAULT_ANIMATION_CONFIG,
  DEFAULT_CHARACTER_ENTER_INITIAL,
  DEFAULT_CHARACTER_ENTER_FINAL,
  DEFAULT_CHARACTER_EXIT_INITIAL,
  DEFAULT_CHARACTER_EXIT_FINAL,
  DEFAULT_BUTTON_COLORS,
  DEFAULT_SPINNER_CONFIG,
  DEFAULT_BUTTON_STYLE,
  BUTTON_SCALE,
};
