import * as React from "react";
import type { BlurType } from "@sbaiahmed1/react-native-blur";
import type { ReactNode } from "react";
import type { ViewStyle, PressableProps, StyleProp } from "react-native";
import type { SharedValue, WithSpringConfig } from "react-native-reanimated";

type TFlipCardAnimation = "horizontal" | "vertical" | "depth";

type TFlipCardComponents =
  | "FlipCard.Front"
  | "FlipCard.Back"
  | "FlipCard.Trigger";

interface FlipCardContextValue {
  readonly isFlipped: boolean;
  readonly flip: () => void;
  readonly flipTo: (flipped: boolean) => void;
  readonly width: number;
  readonly height: number;
  readonly borderRadius: number;
  readonly blurIntensity: number;
  readonly animation: TFlipCardAnimation;
  /** 0 = front facing, 1 = back facing. */
  readonly progress: SharedValue<number>;
  readonly scale: SharedValue<number>;
  readonly tint: BlurType;
  readonly scaleEnabled: boolean;
}

interface FlipCardProps extends React.PropsWithChildren {
  readonly width?: number;
  readonly height?: number;
  readonly borderRadius?: number;
  readonly blurIntensity?: number;
  readonly containerStyle?: StyleProp<ViewStyle>;
  readonly blurTint?: BlurType;
  /** Approximate settle time of the flip spring, in ms. */
  readonly animationDuration?: number;
  readonly springConfig?: WithSpringConfig;
  readonly animation?: TFlipCardAnimation;
  readonly enableHaptics?: boolean;
  readonly onFlip?: (isFlipped: boolean) => void;
  readonly scaleOnPress?: boolean;
  /** Controlled mode: when provided, the card mirrors this value. */
  readonly isFlipped?: boolean;
  readonly defaultFlipped?: boolean;
}

interface FlipCardFaceProps extends React.PropsWithChildren {
  readonly style?: StyleProp<ViewStyle>;
}

type FlipCardFrontProps = FlipCardFaceProps;
type FlipCardBackProps = FlipCardFaceProps;

interface FlipCardTriggerProps extends Omit<PressableProps, "onPress"> {
  readonly children?: ReactNode;
  readonly asChild?: boolean;
}

export type {
  TFlipCardAnimation,
  TFlipCardComponents,
  FlipCardContextValue,
  FlipCardProps,
  FlipCardFaceProps,
  FlipCardFrontProps,
  FlipCardBackProps,
  FlipCardTriggerProps,
};
