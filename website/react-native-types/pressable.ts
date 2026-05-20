import type { ReactNode } from "react";
import type { BlurTint } from "expo-blur";
import type { ViewStyle, GestureResponderEvent } from "react-native";
import type { AnimatedStyle, SharedValue } from "react-native-reanimated";

interface AnimationConfig {
  readonly scale?: number;
  readonly rotate?: number;
  readonly opacity?: number;

  readonly translateX?: number;
  readonly translateY?: number;
  readonly duration?: number;
  readonly useSpring?: boolean;
  readonly damping?: number;
  readonly stiffness?: number;
  readonly mass?: number;
}

type CustomAnimation = (
  progress: SharedValue<number>,
  isPressed: SharedValue<boolean>,
) => AnimatedStyle<ViewStyle>;

interface BlurConfig {
  enabled: boolean;
  intensity?: number;
  readonly tint?: BlurTint;
  animateOnPress?: boolean;
  pressedIntensity?: number;
}

interface FeedbackConfig {
  haptic?: boolean;
  hapticType?:
    | "light"
    | "medium"
    | "heavy"
    | "selection"
    | "success"
    | "warning"
    | "error";
  sound?: boolean;
  onSound?: () => void;
}

interface PressableProviderProps {
  children: ReactNode;
  initialOnPress?: (event: GestureResponderEvent) => void;
  defaultPressAnimation?: AnimationConfig;
  defaultLongPressAnimation?: AnimationConfig;
  defaultFeedback?: FeedbackConfig;
  defaultBlur?: BlurConfig;
  disableAnimations?: boolean;
  defaultLongPressDuration?: number;
}

interface PressableProps {
  readonly children: ReactNode;
  readonly onPress?: (event: GestureResponderEvent) => void;
  readonly onLongPress?: (event: GestureResponderEvent) => void;
  readonly onPressIn?: (event: GestureResponderEvent) => void;
  readonly onPressOut?: (event: GestureResponderEvent) => void;
  readonly longPressDuration?: number;
  readonly disabled?: boolean;
  readonly style?: ViewStyle | ViewStyle[];
  readonly pressAnimation?: AnimationConfig;
  readonly longPressAnimation?: AnimationConfig;
  readonly customAnimation?: CustomAnimation;
  readonly feedback?: FeedbackConfig;
  readonly blur?: BlurConfig;
  readonly disableAnimations?: boolean;
  readonly skipGlobalCallback?: boolean;
  readonly testID?: string;
  readonly accessibilityLabel?: string;
  readonly accessibilityHint?: string;
  readonly accessibilityRole?: "button" | "link" | "none";
  readonly hitSlop?:
    | number
    | { top?: number; bottom?: number; left?: number; right?: number };
}

interface PressableContextType {
  readonly initialOnPress?: (event: GestureResponderEvent) => void;
  readonly defaultPressAnimation?: AnimationConfig;
  readonly defaultLongPressAnimation?: AnimationConfig;
  readonly defaultFeedback?: FeedbackConfig;
  readonly defaultBlur?: BlurConfig;
  readonly disableAnimations?: boolean;
  readonly defaultLongPressDuration?: number;
}

export type {
  AnimationConfig,
  CustomAnimation,
  BlurConfig,
  FeedbackConfig,
  PressableProviderProps,
  PressableProps,
  PressableContextType,
};
