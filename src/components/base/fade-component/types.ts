import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import type {
  EasingFunction,
  EasingFunctionFactory,
  SharedValue,
  WithSpringConfig,
} from "react-native-reanimated";

type TFadeState = "from" | "to";

type TFadeAnimation = "timing" | "spring";

type TFadeComponents = "FadeComponent.From" | "FadeComponent.To";

interface IFadeHandle {
  /** Animate to the opposite face. */
  toggle: () => void;
  /** Animate to the `From` face. */
  from: () => void;
  /** Animate to the `To` face. */
  to: () => void;
  /** Jump/animate to an explicit face. */
  setState: (state: TFadeState, animated?: boolean) => void;
  /** Current face, read synchronously. */
  getState: () => TFadeState;
  /** 0 = `From` fully visible, 1 = `To` fully visible. */
  progress: SharedValue<number>;
}

interface IFadeContext {
  readonly progress: SharedValue<number>;
  readonly blockHiddenTouches: boolean;
}

interface IFadeComponent {
  readonly children: ReactNode;
  /** Duration in ms for the `timing` animation. @default 1000 */
  readonly duration?: number;
  /** Delay in ms before the animation starts. @default 0 */
  readonly delay?: number;
  /** Easing for the `timing` animation. */
  readonly easing?: EasingFunction | EasingFunctionFactory;
  /** Drive the crossfade with timing or spring. @default "timing" */
  readonly animation?: TFadeAnimation;
  /** Spring config used when `animation` is `"spring"`. */
  readonly springConfig?: WithSpringConfig;
  /** Controlled face — when provided the component mirrors this value. */
  readonly state?: TFadeState;
  /** Uncontrolled starting face. @default "from" */
  readonly defaultState?: TFadeState;
  /** Fired when a transition is requested. */
  readonly onChange?: (state: TFadeState) => void;
  /** Fired when a transition settles. */
  readonly onAnimationEnd?: (state: TFadeState) => void;
  /** Ignore imperative calls and controlled updates. @default false */
  readonly disabled?: boolean;
  /** Style applied to the wrapping container. */
  readonly style?: StyleProp<ViewStyle>;
  /** Prevent touches from reaching the face that is fading out. @default true */
  readonly blockHiddenTouches?: boolean;
  readonly testID?: string;
}

interface IFadeFace {
  readonly children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
  /** Opacity of this face when it is the hidden one. @default 0 */
  readonly hiddenOpacity?: number;
  /** Scale of this face when it is the hidden one — 1 disables the effect. @default 1 */
  readonly hiddenScale?: number;
  readonly pointerEvents?: ViewStyle["pointerEvents"];
  readonly testID?: string;
}

type IFadeFromProps = IFadeFace;
type IFadeToProps = IFadeFace;

export type {
  TFadeState,
  TFadeAnimation,
  TFadeComponents,
  IFadeComponent,
  IFadeContext,
  IFadeHandle,
  IFadeFace,
  IFadeFromProps,
  IFadeToProps,
};
