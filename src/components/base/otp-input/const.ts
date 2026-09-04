import {
  FadeInUp,
  FadeOutUp,
  FadeOutDown,
  ZoomIn,
  ZoomOut,
  FlipInEasyX,
  BounceIn,
  BounceOut,
  FadeInDown,
  Easing,
  FlipOutEasyX,
} from "react-native-reanimated";
import type { AnimationVariant } from "./types";

const ANIMATION_VARIATIONS: Record<AnimationVariant, any> = {
  fadeSlideUp: {
    entering: FadeInUp.duration(300).springify().mass(0.5),
    exiting: FadeOutUp.duration(200),
  },
  fadeSlideDown: {
    entering: FadeInDown.duration(300)
      .springify()
      .damping(12)
      .stiffness(150)
      .mass(0.5),
    exiting: FadeOutDown.duration(200)
      .springify()
      .damping(12)
      .stiffness(150)
      .mass(0.5),
  },
  scale: {
    entering: ZoomIn.duration(250).easing(Easing.out(Easing.back(1.5))),
    exiting: ZoomOut.duration(200),
  },
  rotate: {
    entering: FlipInEasyX.duration(400),
    exiting: FlipOutEasyX.duration(300),
  },
  bounce: {
    entering: BounceIn.duration(500),
    exiting: BounceOut.duration(300),
  },
  elastic: {
    entering: ZoomIn.springify().damping(8).stiffness(100),
    exiting: ZoomOut.springify().damping(12),
  },
} as const;

export { ANIMATION_VARIATIONS };
