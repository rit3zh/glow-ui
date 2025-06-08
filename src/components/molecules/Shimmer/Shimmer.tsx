import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import { View, LayoutChangeEvent, LayoutRectangle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import type { ShimmerEffectProps } from "./Shimmer.types";

/**
 * @returns {React.ReactNode | React.JSX.Element}
 */
export const ShimmerEffect: React.FC<ShimmerEffectProps> = ({
  isLoading = true,

  shimmerColors = [
    "rgba(15, 15, 15, 0.1)",
    "rgba(255, 255, 255, 0.15)",
    "rgba(15, 15, 15, 0.1)",
  ],
  duration = 1200,
  className,

  style,
  variant = "shimmer",
  direction = "leftToRight",
}) => {
  const [layout, setLayout] = useState<LayoutRectangle | null>(null);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.5);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setLayout(e.nativeEvent.layout);
  }, []);

  const shimmerStyle = useAnimatedStyle(() => {
    const transforms = [];

    if (variant === "shimmer") {
      if (direction === "leftToRight" || direction === "rightToLeft") {
        transforms.push({ translateX: translateX.value });
      } else {
        transforms.push({ translateY: translateY.value });
      }
    }

    return {
      transform: transforms,
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    if (!layout || !isLoading) {
      cancelAnimation(translateX);
      cancelAnimation(translateY);
      cancelAnimation(opacity);
      return;
    }

    if (variant === "shimmer") {
      switch (direction) {
        case "leftToRight":
          translateX.value = -layout.width - 350;
          translateX.value = withRepeat(
            withTiming(layout.width, {
              duration,
              easing: Easing.linear,
            }),
            -1,
            false,
          );
          break;

        case "rightToLeft":
          translateX.value = layout.width + 350;
          translateX.value = withRepeat(
            withTiming(-layout.width - 350, {
              duration,
              easing: Easing.linear,
            }),
            -1,
            false,
          );
          break;

        case "topToBottom":
          translateY.value = -layout.height - 250;
          translateY.value = withRepeat(
            withTiming(layout.height, {
              duration,
              easing: Easing.linear,
            }),
            -1,
            false,
          );
          break;

        case "bottomToTop":
          translateY.value = layout.height + 100;
          translateY.value = withRepeat(
            withTiming(-layout.height - 100, {
              duration,
              easing: Easing.linear,
            }),
            -1,
            false,
          );
          break;
      }
      opacity.value = 1;
    } else {
      opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: duration / 2 }),
          withTiming(0.3, { duration: duration / 2 }),
        ),
        -1,
        true,
      );
    }

    return () => {
      cancelAnimation(translateX);
      cancelAnimation(translateY);
      cancelAnimation(opacity);
    };
  }, [layout, isLoading, duration, variant, direction]);

  return (
    <View
      onLayout={onLayout}
      className={className}
      style={[style, { overflow: "hidden" }]}
    >
      {isLoading && layout && (
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              width:
                variant === "shimmer" &&
                (direction === "leftToRight" || direction === "rightToLeft")
                  ? layout.width * 3
                  : layout.width,
              height:
                variant === "shimmer" &&
                (direction === "topToBottom" || direction === "bottomToTop")
                  ? layout.height * 3
                  : layout.height,
            },
            shimmerStyle,
          ]}
        >
          {variant === "shimmer" ? (
            <LinearGradient
              colors={shimmerColors as [string, string, ...string[]]}
              start={
                direction === "leftToRight" || direction === "rightToLeft"
                  ? { x: 0, y: 0.5 }
                  : { x: 0.5, y: 0 }
              }
              end={
                direction === "leftToRight" || direction === "rightToLeft"
                  ? { x: 1, y: 0.5 }
                  : { x: 0.5, y: 1 }
              }
              style={{ flex: 1 }}
            />
          ) : (
            <View
              style={{
                flex: 1,
                backgroundColor: shimmerColors[0],
              }}
            />
          )}
        </Animated.View>
      )}
    </View>
  );
};
