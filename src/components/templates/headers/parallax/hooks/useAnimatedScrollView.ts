import { useRef } from "react";
import { Animated } from "react-native";
import { HEADER_HEIGHT } from "../constants";

export const useAnimateScrollView = (
  imageHeight: number,
  disableScale?: boolean
) => {
  const scroll = useRef(new Animated.Value(0)).current;

  const scale = scroll.interpolate({
    inputRange: [-imageHeight, 0, imageHeight],
    outputRange: [2.5, 1, 1],
    extrapolate: "clamp",
  });

  const translateYDown = scroll.interpolate({
    inputRange: [-imageHeight, 0, imageHeight],
    outputRange: [-imageHeight * 0.6, 0, imageHeight * 0.5],
    extrapolate: "clamp",
  });

  const translateYUp = scroll.interpolate({
    inputRange: [-imageHeight, 0, imageHeight],
    outputRange: [imageHeight * 0.3, 0, 0],
    extrapolate: "clamp",
  });

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scroll } } }],
    { useNativeDriver: true }
  );

  return [
    scroll,
    onScroll,
    disableScale ? 1 : scale,
    translateYDown,
    translateYUp,
  ] as const;
};
