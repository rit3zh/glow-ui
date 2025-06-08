import React, { ReactNode, useState, useEffect } from "react";
import { View, StyleSheet, LayoutChangeEvent } from "react-native";
import Animated, {
  Easing,
  withTiming,
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  LinearTransition,
  FadeIn,
} from "react-native-reanimated";

export const AccordionContent = ({
  children,
  isActive = false,
  className = "",
}: {
  children: ReactNode;
  isActive?: boolean;
  className?: string;
}) => {
  const [contentHeight, setContentHeight] = useState(0);
  const animatedHeight = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(10);
  const [measured, setMeasured] = useState(false);
  const marginBottom = useSharedValue(0);

  const onLayout = (event: LayoutChangeEvent) => {
    const height = event.nativeEvent.layout.height;
    if (height > 0 && !measured) {
      setContentHeight(height);
      setMeasured(true);
    }
  };

  useEffect(() => {
    if (measured) {
      animatedHeight.value = withTiming(isActive ? contentHeight : 0, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
      });

      if (isActive) {
        marginBottom.value = withTiming(10, {
          easing: Easing.linear,
        });
        textOpacity.value = withDelay(
          400,
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        );
        textTranslateY.value = withDelay(
          300,
          withTiming(0, { duration: 250, easing: Easing.out(Easing.quad) })
        );
      } else {
        textOpacity.value = withTiming(0, { duration: 150 });
        textTranslateY.value = withTiming(10, { duration: 150 });
        marginBottom.value = withTiming(0, {
          easing: Easing.linear,
        });
      }
    }
  }, [isActive, measured, contentHeight]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
    opacity: measured ? 1 : 0,
    marginBottom: marginBottom.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  return (
    <>
      {!measured && (
        <Animated.View
          style={styles.measuringContainer}
          onLayout={onLayout}
          entering={FadeIn}
          layout={LinearTransition}
          className={className}
        >
          {children}
        </Animated.View>
      )}

      <Animated.View
        style={[styles.content, containerAnimatedStyle]}
        layout={LinearTransition}
      >
        <Animated.View style={textAnimatedStyle}>{children}</Animated.View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    overflow: "hidden",
    marginLeft: 10,
  },
  measuringContainer: {
    position: "absolute",
    opacity: 0,
    left: 0,
    right: 0,
  },
});
