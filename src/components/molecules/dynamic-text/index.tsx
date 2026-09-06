import React, { useEffect, useState, useCallback, memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
  type StyleProp,
  Platform,
} from "react-native";
import Animated, {
  interpolate,
  LinearTransition,
  useAnimatedProps,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { BlurView, type BlurViewProps } from "expo-blur";
import type {
  DotConfig,
  IDynamicText,
  TextConfig,
  TimingConfig,
} from "./types";
import { DEFAULT_TIMING, DEFAULT_DOT, DEFAULT_TEXT } from "./const";
import { getAnimationPreset, normalizeItems } from "./helpers";

const AnimatedBlurView =
  Animated.createAnimatedComponent<BlurViewProps>(BlurView);

const DynamicText: React.FC<IDynamicText> &
  React.FunctionComponent<IDynamicText> = memo<IDynamicText>(
  ({
    items,
    loop = false,
    loopCount = -1,
    animationPreset = "fade",
    animationDirection = "up",
    customEntering,
    customExiting,
    timing,
    dot,
    text,
    containerStyle,
    contentStyle,
    onAnimationComplete,
    onIndexChange,
    paused = false,
    initialIndex = 0,
    accessibilityLabel,
  }: IDynamicText): React.ReactNode &
    React.JSX.Element &
    React.ReactElement => {
    const timingConfig: TimingConfig = { ...DEFAULT_TIMING, ...timing };
    const dotConfig: DotConfig = { ...DEFAULT_DOT, ...dot };
    const textConfig: TextConfig = { ...DEFAULT_TEXT, ...text };

    const normalizedItems = normalizeItems(items);

    const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
    const [isAnimating, setIsAnimating] = useState<boolean>(true);
    const [currentLoop, setCurrentLoop] = useState<number>(0);

    const progress = useSharedValue<number>(0);

    const animationConfig = getAnimationPreset(
      animationPreset,
      animationDirection,
      timingConfig.animationDuration,
    );

    const entering = customEntering ?? animationConfig.entering;
    const exiting = customExiting ?? animationConfig.exiting;

    const handleIndexChange = useCallback<(index: number) => void>(
      <T extends number>(index: T) => {
        if (onIndexChange && normalizedItems[index]) {
          onIndexChange(index, normalizedItems[index]);
        }
      },
      [onIndexChange, normalizedItems],
    );

    useEffect(() => {
      if (!isAnimating || paused) return;

      const interval = setInterval(() => {
        setCurrentIndex((prevIndex: number) => {
          const nextIndex = prevIndex + 1;

          if (nextIndex >= normalizedItems.length) {
            if (loop && (loopCount === -1 || currentLoop < loopCount - 1)) {
              setCurrentLoop((prev) => prev + 1);
              handleIndexChange(0);
              return 0;
            }
            clearInterval(interval);
            setIsAnimating(false);
            onAnimationComplete?.();
            return prevIndex;
          }

          handleIndexChange(nextIndex);
          return nextIndex;
        });

        progress.value = withTiming(
          1,
          { duration: timingConfig.animationDuration },
          () => {
            progress.value = 0;
          },
        );
      }, timingConfig.interval);

      return () => clearInterval(interval);
    }, [
      isAnimating,
      paused,
      loop,
      loopCount,
      currentLoop,
      normalizedItems.length,
      timingConfig.interval,
      handleIndexChange,
      onAnimationComplete,
      progress,
    ]);

    const currentItem = normalizedItems[currentIndex];

    const dotStyle: StyleProp<ViewStyle> = {
      height: dotConfig.size,
      width: dotConfig.size,
      borderRadius: dotConfig.size / 2,
      backgroundColor: dotConfig.color as string,
      ...dotConfig?.style,
    };

    const textStyle: StyleProp<TextStyle> = {
      fontSize: textConfig.fontSize,
      fontWeight: textConfig.fontWeight,
      color: textConfig.color as string,
      ...textConfig.style,
    };

    const animatedBlurViewPropz = useAnimatedProps<
      Pick<BlurViewProps, "intensity">
    >(() => {
      const blurIntensity = interpolate(
        progress.value,
        [0, 0.5, 1],
        [0, 15, 0],
      );

      return {
        intensity: blurIntensity,
      };
    });

    return (
      <View
        style={[styles.container, containerStyle]}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="text"
      >
        <View style={[styles.textContainer, contentStyle]}>
          <Animated.View
            key={`${currentItem.id}-${currentLoop}`}
            entering={entering}
            exiting={exiting}
            layout={LinearTransition}
            style={styles.content}
          >
            {dotConfig.visible && <View style={dotStyle} />}
            <Text style={textStyle}>{currentItem.text}</Text>
            {Platform.OS === "ios" && (
              <AnimatedBlurView
                animatedProps={animatedBlurViewPropz}
                style={[StyleSheet.absoluteFillObject]}
              />
            )}
          </Animated.View>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    minHeight: 200,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  textContainer: {
    height: 64,
    width: 240,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  content: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});

export { DynamicText };

export default memo<
  React.FC<IDynamicText> & React.FunctionComponent<IDynamicText>
>(DynamicText);
