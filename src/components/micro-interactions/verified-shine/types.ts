import type { StyleProp, ViewStyle } from "react-native";
import type { EasingFunction } from "react-native-reanimated";

interface IVerifiedShine {
  readonly size?: number;
  readonly color?: string;
  readonly checkColor?: string;
  readonly shineColors?: string[];
  readonly shineWidth?: number;
  readonly shineAngle?: number;
  readonly duration?: number;
  readonly delay?: number;
  readonly easing?: EasingFunction;
  readonly paused?: boolean;
  readonly label?: string;
  readonly style?: StyleProp<ViewStyle>;
}

export type { IVerifiedShine };
