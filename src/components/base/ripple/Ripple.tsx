import React, { useState, cloneElement, isValidElement } from "react";
import { View, LayoutChangeEvent } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import type { TouchableRippleProps } from "./Ripple.types";

export const TouchableRipple: React.FC<TouchableRippleProps> = ({
  children,
  onPress,
  onLongPress,
  rippleColor = "rgba(0,0,0,0.2)",
  duration = 400,
  borderRadius = 0,
  style = {},
}) => {
  const [layout, setLayout] = useState({ width: 0, height: 0 });

  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rippleX = useSharedValue(0);
  const rippleY = useSharedValue(0);
  const isLongPressing = useSharedValue(false);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout({ width, height });
  };

  const gesture = Gesture.Tap()
    .onStart((e) => {
      // Detect the press position
      rippleX.value = e.x;
      rippleY.value = e.y;
      scale.value = 0;
      opacity.value = 1;

      // Start the ripple animation from the press point
      scale.value = withTiming(1, { duration });
      opacity.value = withTiming(0, { duration });
    })
    .onEnd(() => {
      if (onPress) runOnJS(onPress)();
    });

  // Long press gesture logic
  const longPressGesture = Gesture.LongPress()
    .onStart(() => {
      isLongPressing.value = true;
      // Maintain ripple starting position and scale up for long press
      scale.value = withTiming(1.5, { duration }); // Increase size during long press
      opacity.value = withTiming(0.3, { duration }); // Adjust opacity

      if (onLongPress) runOnJS(onLongPress)();
    })
    .onEnd(() => {
      isLongPressing.value = false;
      // Restore the animation when the press is released
      scale.value = withTiming(0, { duration });
      opacity.value = withTiming(0, { duration });
    });

  const animatedStyle = useAnimatedStyle(() => {
    const size = Math.max(layout.width, layout.height) * 2;
    return {
      position: "absolute",
      width: size,
      height: size,
      top: rippleY.value - size / 2,
      left: rippleX.value - size / 2,
      backgroundColor: rippleColor,
      borderRadius: size / 2,
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  if (!isValidElement(children)) {
    console.error(
      "TouchableRipple expects a single valid React element as child.",
    );
    return null;
  }

  return (
    <GestureDetector gesture={Gesture.Race(gesture, longPressGesture)}>
      <View onLayout={onLayout}>
        <View
          style={
            [
              {
                overflow: "hidden",
                borderRadius,
              },
              style,
            ] as any
          }
        >
          {cloneElement(children, {
            ...(children.props as any),
          })}

          <Animated.View pointerEvents="none" style={animatedStyle} />
        </View>
      </View>
    </GestureDetector>
  );
};
