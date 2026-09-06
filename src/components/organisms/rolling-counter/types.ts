import { StyleProp, TextStyle, ViewStyle } from "react-native";
import type {
  SharedValue,
  WithSpringConfig,
  WithTimingConfig,
} from "react-native-reanimated";

interface IReusableDigit {
  place: number;
  counterValue: SharedValue<number>;
  height: number;
  width: number;
  digitStyle?: StyleProp<TextStyle>;
  color?: string;
  fontSize?: number;
  stagger: number;
  fadeEdges: boolean;
  motionBlur: boolean;
  timingConfig: WithTimingConfig;
  springConfig?: Partial<WithSpringConfig>;
}

interface ICounter {
  value: number | SharedValue<number>;
  height?: number;
  width?: number;
  digitStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  /**
   * Spring driver. Omit to use the smoother `timingConfig` roll (default).
   */
  springConfig?: Partial<WithSpringConfig>;
  /**
   * Timing driver used when `springConfig` is not supplied.
   */
  timingConfig?: WithTimingConfig;
  /**
   * Delay in ms added per place, cascading right to left. `0` disables it.
   */
  stagger?: number;
  /**
   * Soften the top and bottom of every digit window with a gradient mask.
   */
  fadeEdges?: boolean;
  /**
   * Blur and squash each digit in proportion to how fast it is travelling.
   */
  motionBlur?: boolean;
  fontSize?: number;
  color?: string;
}

export type { ICounter, IReusableDigit };
