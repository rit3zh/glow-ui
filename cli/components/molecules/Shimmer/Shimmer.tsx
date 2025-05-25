import React, { useEffect, useState } from "react";
import { View, LayoutChangeEvent, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import type { ShimmerEffectProps } from "./Shimmer.types";

export const ShimmerEffect: React.FC<ShimmerEffectProps> = ({
  children,
  isLoading,
  shimmerColors = [
    "rgba(0,0,0, 0.3)",
    "rgba(255, 255, 255, 0.1)",
    "rgba(0,0,0, 0.3)",
  ],
  shimmerDuration = 1200,
  shimmerWidth = 0.3,
  shimmerAngle = 20,
  containerStyle,
  blurIntensity = 50,
  blurTint = "light",
}) => {
  const translateX = useSharedValue(0);
  const shineOpacity = useSharedValue(0.3);
  const shimmerOpacity = useSharedValue(0);
  const [layoutWidth, setLayoutWidth] = useState(0);
  const [showShimmer, setShowShimmer] = useState(isLoading);

  // Run shimmer animation when loading
  useEffect(() => {
    const shimmerPixelWidth = layoutWidth * shimmerWidth * 5;
    const travel = layoutWidth + shimmerPixelWidth;

    if (isLoading && layoutWidth > 0) {
      setShowShimmer(true);
      shimmerOpacity.value = withTiming(1, { duration: 300 });

      translateX.value = withRepeat(
        withTiming(travel, {
          duration: shimmerDuration,
          easing: Easing.linear,
        }),
        -1
      );

      shineOpacity.value = withRepeat(
        withTiming(1, {
          duration: shimmerDuration / 2,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      );
    } else if (showShimmer) {
      shimmerOpacity.value = withTiming(
        0,
        { duration: 800, easing: Easing.linear },
        () => runOnJS(setShowShimmer)(false)
      );
    }
  }, [isLoading, layoutWidth]);

  const animatedTranslateStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value - layoutWidth * shimmerWidth }],
  }));

  const animatedShineOpacity = useAnimatedStyle(() => ({
    opacity: shineOpacity.value,
  }));

  const animatedFadeOutStyle = useAnimatedStyle(() => ({
    opacity: shimmerOpacity.value,
  }));

  const handleLayout = (event: LayoutChangeEvent) => {
    setLayoutWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={[styles.container, containerStyle]} onLayout={handleLayout}>
      {children}
      {showShimmer && layoutWidth > 0 && (
        <Animated.View
          style={[styles.shimmerOverlay, animatedFadeOutStyle]}
          pointerEvents="none"
        >
          <Animated.View
            style={[
              styles.animatedGradient,
              animatedTranslateStyle,
              animatedShineOpacity,
            ]}
          >
            <BlurView
              intensity={blurIntensity}
              tint={blurTint}
              style={StyleSheet.absoluteFill}
            >
              <LinearGradient
                colors={shimmerColors as [string, string, ...string[]]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{
                  width: layoutWidth * shimmerWidth,
                  height: "100%",
                  transform: [{ rotateZ: `${shimmerAngle}deg` }, { scaleY: 2 }],
                }}
              />
            </BlurView>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
  },
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  animatedGradient: {
    position: "absolute",
    top: 0,
    bottom: 0,
  },
});
