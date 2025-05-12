import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View, ViewProps } from "react-native";
import Animated, {
  useDerivedValue,
  withTiming,
  Easing,
  SharedValue,
  useAnimatedStyle,
  interpolateColor,
  interpolate,
  Extrapolation,
  useSharedValue,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { PaginationProps } from "./Pagination.types";

const ACTIVE_COLOR: string = "#000";
const INACTIVE_COLOR: string = "#ccc";
const DOT_SIZE: number = 10;
const BORDER_RADIUS: number = 100;
const DOT_CONTAINER = 24;

const { width } = Dimensions.get("window");

export function Pagination<T extends PaginationProps>(
  props: T & ViewProps
): React.ReactElement {
  const { activeIndex, totalItems } = props;

  const clampedActiveIndex = Math.min(Math.max(activeIndex, 0), totalItems - 1);

  const scale = useSharedValue(1);
  const index_ = useSharedValue(clampedActiveIndex);

  useEffect(() => {
    index_.value = Math.min(Math.max(activeIndex, 0), totalItems - 1);
  }, [activeIndex, totalItems]);

  const longPressGesture = Gesture.Pan()
    .onStart(() => {
      scale.value = withTiming(1.2, { duration: 150 });
    })

    .onUpdate((e) => {
      const index = Math.floor(e.absoluteX / (width / totalItems));
      if (index >= 0 && index < totalItems) {
        index_.value = index;
      }
    })
    .onEnd(() => {
      scale.value = withTiming(1, { duration: 150 });
    })
    .onFinalize(() => {
      scale.value = withTiming(1, { duration: 150 });
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const animation = useDerivedValue(() => {
    return withTiming(index_.value, {
      easing: Easing.linear,
      duration: 300,
    });
  });

  return (
    <GestureDetector gesture={longPressGesture}>
      <Animated.View style={[animatedStyle]}>
        <View style={{ flexDirection: "row" }}>
          <Indicator animation={animation} />
          {[...Array(totalItems).keys()].map((index) => (
            <Dot key={`index-${index}`} index={index} animation={animation} />
          ))}
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

function Indicator({ animation }: { animation: SharedValue<number> }) {
  const indicatorAnimatedStyle = useAnimatedStyle(() => {
    const width = DOT_CONTAINER + DOT_CONTAINER * animation.value;
    const opacity = interpolate(
      animation.value,
      [0, 0.01],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      width,
      opacity: withTiming(opacity, {
        duration: 200,
        easing: Easing.linear,
      }),
    };
  });

  return (
    <Animated.View
      style={[
        {
          height: DOT_CONTAINER,
          position: "absolute",
          left: 0,
          top: 0,
          borderRadius: BORDER_RADIUS,
          backgroundColor: "green",
        },
        indicatorAnimatedStyle,
      ]}
    />
  );
}

function Dot({
  index,
  animation,
}: {
  index: number;
  animation: SharedValue<number>;
}) {
  const animatedDotContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        animation.value,
        [index - 1, index, index + 1],
        [INACTIVE_COLOR, ACTIVE_COLOR, INACTIVE_COLOR]
      ),
    };
  });

  return (
    <Animated.View style={styles.dotContainer}>
      <Animated.View
        style={[
          styles.dot,
          {
            width: DOT_SIZE,
            height: DOT_SIZE,
          },
          animatedDotContainerStyle,
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  dotContainer: {
    width: DOT_CONTAINER,
    height: DOT_CONTAINER,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 20,
    height: 10,
    borderRadius: BORDER_RADIUS,
    backgroundColor: "#000",
    marginHorizontal: 5,
  },
});
