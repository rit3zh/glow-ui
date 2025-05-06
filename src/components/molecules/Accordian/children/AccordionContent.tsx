import React, { ReactNode, useState, useEffect } from "react";
import { View, StyleSheet, LayoutChangeEvent } from "react-native";
import Animated, {
  Easing,
  withTiming,
  useSharedValue,
  useAnimatedStyle,
  withDelay,
} from "react-native-reanimated";

export const AccordionContent = ({
  children,
  isActive = false,
}: {
  children: ReactNode;
  isActive?: boolean;
}) => {
  const [contentHeight, setContentHeight] = useState(0);
  const animatedHeight = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(10);
  const [measured, setMeasured] = useState(false);

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
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });

      if (isActive) {
        textOpacity.value = withDelay(
          100,
          withTiming(1, { duration: 450, easing: Easing.inOut(Easing.ease) })
        );
        textTranslateY.value = withDelay(
          50,
          withTiming(0, { duration: 250, easing: Easing.out(Easing.quad) })
        );
      } else {
        textOpacity.value = withTiming(0, { duration: 150 });
        textTranslateY.value = withTiming(10, { duration: 150 });
      }
    }
  }, [isActive, measured, contentHeight]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
    opacity: measured ? 1 : 0,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  return (
    <>
      {!measured && (
        <View style={styles.measuringContainer} onLayout={onLayout}>
          {children}
        </View>
      )}

      <Animated.View style={[styles.content, containerAnimatedStyle]}>
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
