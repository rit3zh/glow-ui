import React, {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  ReactNode,
} from "react";
import {
  Pressable as RNPressable,
  StyleSheet,
  type ViewStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  useAnimatedProps,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import type {
  PressableProviderProps,
  PressableContextType,
  PressableProps,
  AnimationConfig,
} from "./types";
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const PressableContext = createContext<PressableContextType | undefined>(
  undefined,
);

export const usePressableContext = (): PressableContextType => {
  const context = useContext(PressableContext);

  if (!context) {
    return {
      defaultLongPressDuration: 500,
    };
  }

  return context;
};

export const PressableProvider = React.memo<PressableProviderProps>(
  ({
    children,
    initialOnPress,
    defaultPressAnimation,
    defaultLongPressAnimation,
    defaultFeedback,
    defaultBlur,
    disableAnimations = false,
    defaultLongPressDuration = 500,
  }) => {
    const contextValue = useMemo<PressableContextType>(
      () => ({
        initialOnPress,
        defaultPressAnimation,
        defaultLongPressAnimation,
        defaultFeedback,
        defaultBlur,
        disableAnimations,
        defaultLongPressDuration,
      }),
      [
        initialOnPress,
        defaultPressAnimation,
        defaultLongPressAnimation,
        defaultFeedback,
        defaultBlur,
        disableAnimations,
        defaultLongPressDuration,
      ],
    );

    return (
      <PressableContext.Provider value={contextValue}>
        {children}
      </PressableContext.Provider>
    );
  },
);

export const Pressable = React.memo<PressableProps>(
  ({
    children,
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
    longPressDuration,
    disabled = false,
    style,
    pressAnimation,
    longPressAnimation,
    customAnimation,
    feedback,
    blur,
    disableAnimations = false,
    skipGlobalCallback = false,
    testID,
    accessibilityLabel,
    accessibilityHint,
    accessibilityRole = "button",
    hitSlop,
  }) => {
    const context = usePressableContext();

    const isPressed = useSharedValue<boolean>(false);
    const isLongPressed = useSharedValue<boolean>(false);
    const progress = useSharedValue<number>(0);
    const longPressProgress = useSharedValue<number>(0);

    const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

    const finalPressAnimation: AnimationConfig = {
      scale: 0.95,
      opacity: 1,
      rotate: 0,
      translateX: 0,
      translateY: 0,
      duration: 150,
      useSpring: false,
      damping: 10,
      stiffness: 100,

      ...context.defaultPressAnimation,
      ...pressAnimation,
    };

    const finalLongPressAnimation: AnimationConfig = {
      scale: 0.9,
      opacity: 0.8,
      rotate: 0,
      translateX: 0,
      translateY: 0,
      duration: 200,
      useSpring: true,
      damping: 8,
      stiffness: 80,
      ...context.defaultLongPressAnimation,
      ...longPressAnimation,
    };

    const finalFeedback = useMemo(
      () => ({
        haptic: false,
        hapticType: "light" as const,
        sound: false,
        ...context.defaultFeedback,
        ...feedback,
      }),
      [context.defaultFeedback, feedback],
    );

    const finalBlur = useMemo(
      () => ({
        enabled: false,
        intensity: 10,
        tint: "default" as const,
        animateOnPress: false,
        pressedIntensity: 20,
        ...context.defaultBlur,
        ...blur,
      }),
      [context.defaultBlur, blur],
    );

    const finalLongPressDuration =
      longPressDuration ?? context.defaultLongPressDuration ?? 500;
    const animationsDisabled = disableAnimations || context.disableAnimations;

    const triggerHaptic = useCallback(() => {
      if (finalFeedback.haptic && !disabled) {
        switch (finalFeedback.hapticType) {
          case "light":
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            break;
          case "medium":
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            break;
          case "heavy":
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            break;
          case "selection":
            Haptics.selectionAsync();
            break;
          case "success":
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            break;
          case "warning":
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            break;
          case "error":
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            break;
        }
      }
    }, [finalFeedback.haptic, finalFeedback.hapticType, disabled]);

    const triggerSound = useCallback(() => {
      if (finalFeedback.sound && finalFeedback.onSound && !disabled) {
        finalFeedback.onSound();
      }
    }, [finalFeedback.sound, finalFeedback.onSound, disabled]);

    const animateValue = useCallback(
      (value: number, config: AnimationConfig) => {
        if (animationsDisabled) return value;

        if (config.useSpring) {
          return withSpring(value, {
            damping: config.damping,
            stiffness: config.stiffness,
          });
        }
        return withTiming(value, { duration: config.duration });
      },
      [animationsDisabled],
    );

    const handlePressIn = useCallback(
      (event: any) => {
        if (disabled) return;

        isPressed.value = true;
        progress.value = animateValue(1, finalPressAnimation);

        triggerHaptic();
        triggerSound();

        if (!skipGlobalCallback && context.initialOnPress) {
          context.initialOnPress(event);
        }

        if (onLongPress) {
          longPressTimerRef.current = setTimeout(() => {
            isLongPressed.value = true;
            longPressProgress.value = animateValue(1, finalLongPressAnimation);
            onLongPress(event);
          }, finalLongPressDuration);
        }

        onPressIn?.(event);
      },
      [
        disabled,
        isPressed,
        progress,
        triggerHaptic,
        triggerSound,
        skipGlobalCallback,
        context,
        onLongPress,
        finalLongPressDuration,
        onPressIn,
        animateValue,
        finalPressAnimation,
        finalLongPressAnimation,
      ],
    );

    const handlePressOut = useCallback(
      (event: any) => {
        if (disabled) return;

        isPressed.value = false;
        isLongPressed.value = false;
        progress.value = animateValue(0, finalPressAnimation);
        longPressProgress.value = animateValue(0, finalLongPressAnimation);

        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
        }

        onPressOut?.(event);
      },
      [
        disabled,
        isPressed,
        isLongPressed,
        progress,
        longPressProgress,
        onPressOut,
        animateValue,
        finalPressAnimation,
        finalLongPressAnimation,
      ],
    );

    const handlePress = useCallback(
      (event: any) => {
        if (disabled) return;
        onPress?.(event);
      },
      [disabled, onPress],
    );

    useEffect(() => {
      return () => {
        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
        }
      };
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
      if (customAnimation) {
        return customAnimation(progress, isPressed);
      }

      const activeAnimation = isLongPressed.value
        ? finalLongPressAnimation
        : finalPressAnimation;
      const activeProgress = isLongPressed.value
        ? longPressProgress.value
        : progress.value;

      const scale = interpolate(
        activeProgress,
        [0, 1],
        [1, activeAnimation.scale ?? 1],
      );

      const rotate = interpolate(
        activeProgress,
        [0, 1],
        [0, activeAnimation.rotate ?? 0],
      );

      const opacity = interpolate(
        activeProgress,
        [0, 1],
        [1, activeAnimation.opacity ?? 1],
      );

      const translateX = interpolate(
        activeProgress,
        [0, 1],
        [0, activeAnimation.translateX ?? 0],
      );

      const translateY = interpolate(
        activeProgress,
        [0, 1],
        [0, activeAnimation.translateY ?? 0],
      );

      return {
        transform: [
          { scale },
          { rotate: `${rotate}deg` },
          { translateX },
          { translateY },
        ],
        opacity,
      } as any;
    }, [customAnimation, finalPressAnimation, finalLongPressAnimation]);

    const getBorderRadiusFromChildren = (children: ReactNode): any => {
      if (!React.isValidElement(children)) return {};

      const child = children as React.ReactElement<{
        style?: ViewStyle;
        children?: ReactNode;
      }>;
      const style = child.props?.style;

      if (style) {
        let flatStyle: ViewStyle = {};

        if (Array.isArray(style)) {
          for (const s of style) {
            const flattened = StyleSheet.flatten(s);
            if (flattened) {
              flatStyle = { ...flatStyle, ...flattened };
            }
          }
        } else {
          flatStyle = StyleSheet.flatten(style) || {};
        }

        const radiusProps = {
          borderRadius: flatStyle.borderRadius,
          borderTopLeftRadius: flatStyle.borderTopLeftRadius,
          borderTopRightRadius: flatStyle.borderTopRightRadius,
          borderBottomLeftRadius: flatStyle.borderBottomLeftRadius,
          borderBottomRightRadius: flatStyle.borderBottomRightRadius,
        };

        const filtered = Object.fromEntries(
          Object.entries(radiusProps).filter(([_, v]) => v !== undefined),
        );

        if (Object.keys(filtered).length > 0) {
          return filtered;
        }
      }

      if (child.props?.children) {
        const childChildren = child.props.children;

        if (Array.isArray(childChildren)) {
          for (const nestedChild of childChildren) {
            const result = getBorderRadiusFromChildren(nestedChild);
            if (Object.keys(result).length > 0) {
              return result;
            }
          }
        } else {
          return getBorderRadiusFromChildren(childChildren);
        }
      }

      return {};
    };

    const borderRadiusStyle = useMemo(() => {
      return getBorderRadiusFromChildren(children);
    }, [children]);

    const animatedBlurProps = useAnimatedProps(() => {
      if (!finalBlur.enabled || !finalBlur.animateOnPress) {
        return { intensity: finalBlur.intensity ?? 10 };
      }

      const intensity = interpolate(
        progress.value,
        [0, 1],
        [finalBlur.intensity ?? 10, finalBlur.pressedIntensity ?? 20],
      );

      return { intensity };
    }, [finalBlur]);

    const content = useMemo(
      () => (
        <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
      ),
      [style, animatedStyle, children],
    );

    const wrappedContent = useMemo(() => {
      if (!finalBlur.enabled) return content;
      return (
        <>
          <AnimatedBlurView
            animatedProps={animatedBlurProps}
            tint={finalBlur.tint}
            style={[
              StyleSheet.absoluteFillObject,
              borderRadiusStyle,
              {
                overflow: "hidden",
                zIndex: 1,
              },
            ]}
            pointerEvents={"none"}
          />
          {content}
        </>
      );
    }, [finalBlur.enabled, finalBlur.tint, animatedBlurProps, content]);

    return (
      <RNPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole={accessibilityRole}
        hitSlop={hitSlop}
        style={style}
      >
        {wrappedContent}
      </RNPressable>
    );
  },
);
