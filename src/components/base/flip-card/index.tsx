import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View, Pressable, StyleSheet, Platform, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
  type WithSpringConfig,
} from "react-native-reanimated";
import { BlurView, type BlurViewProps } from "@sbaiahmed1/react-native-blur";
import * as Haptics from "expo-haptics";

import { createCompoundComponent } from "@/utils/create-compound-component";
import type {
  FlipCardBackProps,
  FlipCardFrontProps,
  FlipCardContextValue,
  FlipCardProps,
  FlipCardTriggerProps,
  TFlipCardAnimation,
  TFlipCardComponents,
} from "./types";

const AnimatedBlurView =
  Animated.createAnimatedComponent<BlurViewProps>(BlurView);

const FlipCardContext = createContext<FlipCardContextValue | null>(null);

const DEFAULT_SPRING: WithSpringConfig = {
  dampingRatio: 0.72,
};

const PRESS_SPRING: WithSpringConfig = {
  damping: 18,
  stiffness: 320,
  mass: 0.5,
};

const useFlipCard = (
  component: TFlipCardComponents = "FlipCard.Front",
): FlipCardContextValue => {
  const context = useContext<FlipCardContextValue | null>(FlipCardContext);
  if (!context) {
    throw new Error(`${component} must be rendered inside <FlipCard>.`);
  }
  return context;
};

const faceTransform = (
  animation: TFlipCardAnimation,
  progress: number,
  offset: number,
  scale: number,
): NonNullable<ViewStyle["transform"]> => {
  "worklet";
  const angle = offset + progress * 180;
  const midFlip = Math.sin(Math.PI * progress);

  if (animation === "vertical") {
    return [
      { perspective: 1000 },
      { rotateX: `${angle}deg` },
      { scale: scale },
    ];
  }

  if (animation === "depth") {
    return [
      { perspective: 900 },
      { translateY: -28 * midFlip },
      { rotateY: `${angle}deg` },
      { scale: scale * (1 - 0.16 * midFlip) },
    ];
  }

  return [{ perspective: 1000 }, { rotateY: `${angle}deg` }, { scale: scale }];
};

const FlipCardRoot: React.FC<FlipCardProps> = ({
  children,
  width = 340,
  height = 480,
  borderRadius = 24,
  blurIntensity = 90,
  containerStyle,
  animationDuration = 600,
  springConfig,
  animation = "horizontal",
  enableHaptics = true,
  onFlip,
  blurTint,
  scaleOnPress = true,
  isFlipped: controlledFlipped,
  defaultFlipped = false,
}: FlipCardProps): React.JSX.Element => {
  const isControlled = controlledFlipped !== undefined;
  const [uncontrolledFlipped, setUncontrolledFlipped] =
    useState<boolean>(defaultFlipped);
  const isFlipped = isControlled ? controlledFlipped : uncontrolledFlipped;

  const progress = useSharedValue<number>(defaultFlipped ? 1 : 0);
  const scale = useSharedValue<number>(1);

  const spring = useMemo<WithSpringConfig>(() => {
    const { damping, stiffness, ...rest } = (springConfig ??
      {}) as WithSpringConfig & { damping?: number; stiffness?: number };

    if (damping !== undefined || stiffness !== undefined) {
      return springConfig as WithSpringConfig;
    }
    return { ...DEFAULT_SPRING, duration: animationDuration, ...rest };
  }, [animationDuration, springConfig]);

  const springRef = useRef<WithSpringConfig>(spring);
  springRef.current = spring;

  const flipTo = useCallback(
    (flipped: boolean): void => {
      if (enableHaptics) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      if (!isControlled) {
        setUncontrolledFlipped(flipped);
      }

      progress.value = withSpring<number>(flipped ? 1 : 0, springRef.current);
      onFlip?.(flipped);
    },
    [enableHaptics, isControlled, onFlip, progress],
  );

  const flip = useCallback((): void => {
    flipTo(!isFlipped);
  }, [flipTo, isFlipped]);

  useEffect(() => {
    if (!isControlled) return;
    progress.value = withSpring<number>(controlledFlipped ? 1 : 0, spring);
  }, [controlledFlipped, isControlled, progress, spring]);

  const value = useMemo<FlipCardContextValue>(
    () => ({
      isFlipped,
      flip,
      flipTo,
      width,
      height,
      borderRadius,
      blurIntensity,
      animation,
      progress,
      scale,
      tint: blurTint ?? "light",
      scaleEnabled: scaleOnPress,
    }),
    [
      isFlipped,
      flip,
      flipTo,
      width,
      height,
      borderRadius,
      blurIntensity,
      animation,
      progress,
      scale,
      blurTint,
      scaleOnPress,
    ],
  );

  return (
    <FlipCardContext.Provider value={value}>
      <View style={[styles.container, { width, height }, containerStyle]}>
        {children}
      </View>
    </FlipCardContext.Provider>
  );
};

const useEdgeBlurStyle = (): ReturnType<typeof useAnimatedStyle> => {
  const { progress }: FlipCardContextValue = useFlipCard();

  return useAnimatedStyle<Pick<ViewStyle, "opacity">>(() => ({
    opacity: interpolate(
      progress.value,
      [0, 0.5, 1],
      [0, 1, 0],
      Extrapolation.CLAMP,
    ),
  }));
};

const FlipCardFace = ({
  children,
  style,
  offset,
  component,
}: FlipCardFrontProps & {
  offset: 0 | 180;
  component: TFlipCardComponents;
}): React.JSX.Element => {
  const {
    progress,
    scale,
    width,
    height,
    borderRadius,
    blurIntensity,
    animation,
    isFlipped,
    tint,
  }: FlipCardContextValue = useFlipCard(component);

  const isBack = offset === 180;

  const animatedStyle = useAnimatedStyle<
    Pick<ViewStyle, "transform" | "opacity">
  >(() => ({
    transform: faceTransform(animation, progress.value, offset, scale.value),
    opacity: isBack
      ? progress.value < 0.5
        ? 0
        : 1
      : progress.value < 0.5
        ? 1
        : 0,
  }));

  const blurStyle = useEdgeBlurStyle();
  const faceVisible = isBack ? isFlipped : !isFlipped;

  return (
    <Animated.View
      pointerEvents={faceVisible ? "auto" : "none"}
      style={[
        styles.card,
        { width, height, borderRadius },
        animatedStyle,
        style,
      ]}
    >
      {children}

      {Platform.OS === "ios" && (
        <AnimatedBlurView
          blurType={tint}
          blurAmount={blurIntensity}
          style={[
            StyleSheet.absoluteFill,
            { borderRadius, overflow: "hidden" },
            blurStyle,
          ]}
        />
      )}
    </Animated.View>
  );
};

const FlipCardFront: React.FC<FlipCardFrontProps> = memo<FlipCardFrontProps>(
  (props: FlipCardFrontProps): React.JSX.Element => (
    <FlipCardFace {...props} offset={0} component="FlipCard.Front" />
  ),
);

const FlipCardBack: React.FC<FlipCardBackProps> = memo<FlipCardBackProps>(
  (props: FlipCardBackProps): React.JSX.Element => (
    <FlipCardFace {...props} offset={180} component="FlipCard.Back" />
  ),
);

const FlipCardTrigger: React.FC<FlipCardTriggerProps> =
  memo<FlipCardTriggerProps>(
    ({
      children,
      asChild = false,
      style,
      ...props
    }: FlipCardTriggerProps): React.JSX.Element => {
      const { flip, scale, scaleEnabled }: FlipCardContextValue =
        useFlipCard("FlipCard.Trigger");

      const onPressIn = useCallback((): void => {
        if (!scaleEnabled) return;
        scale.value = withSpring<number>(0.95, PRESS_SPRING);
      }, [scale, scaleEnabled]);

      const onPressOut = useCallback((): void => {
        if (!scaleEnabled) return;
        scale.value = withSpring<number>(1, PRESS_SPRING);
      }, [scale, scaleEnabled]);

      if (asChild && React.isValidElement(children)) {
        return React.cloneElement(
          children as React.ReactElement<PressableHandlers>,
          { onPress: flip, onPressIn, onPressOut },
        );
      }

      return (
        <Pressable
          onPress={flip}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={[styles.trigger, style as ViewStyle]}
          {...props}
        >
          {children}
        </Pressable>
      );
    },
  );

type PressableHandlers = {
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
};

const Front = createCompoundComponent("FlipCard.Front", FlipCardFront);
const Back = createCompoundComponent("FlipCard.Back", FlipCardBack);
const Trigger = createCompoundComponent("FlipCard.Trigger", FlipCardTrigger);

const FlipCard = createCompoundComponent("FlipCard", FlipCardRoot, {
  Front,
  Back,
  Trigger,
});

export { FlipCard, FlipCardRoot, FlipCardFront, FlipCardBack, FlipCardTrigger };
export { useFlipCard };

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  trigger: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  card: {
    position: "absolute",
    backgroundColor: "#1a1a1a",
    overflow: "hidden",
    backfaceVisibility: "hidden",
    ...(Platform.OS === "ios"
      ? {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
        }
      : { elevation: 12 }),
  },
});
