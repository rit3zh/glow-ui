import React, { useEffect } from "react";
import {
  Dimensions,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
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
  runOnJS,
} from "react-native-reanimated";
import {
  GestureDetector,
  Gesture,
  PanGesture,
} from "react-native-gesture-handler";
import { PaginationProps } from "./Pagination.types";

const ACTIVE_COLOR: string = "#c4c4c4";
const INACTIVE_COLOR: string = "#363636";
const CURRENT_COLOR: string = `#b724d4`;
const DOT_SIZE: number = 10;
const BORDER_RADIUS: number = 100;
const DOT_CONTAINER = 24;
const INITIAL_CONTAINER_STYLE: ViewStyle = {
  backgroundColor: "#9a3df2",
};
const { width } = Dimensions.get("window");

export function Pagination<T extends PaginationProps>(
  props: T & ViewProps
): React.ReactElement {
  const {
    activeIndex,
    totalItems,
    dotSize = props.dotSize ?? DOT_SIZE,
    inactiveColor = props.inactiveColor ?? INACTIVE_COLOR,
    activeColor = props.activeColor ?? ACTIVE_COLOR,
    currentColor = props.currentColor ?? CURRENT_COLOR,
    borderRadius: borderRadius = props.borderRadius ?? BORDER_RADIUS,
    dotContainer: dotContainer = props.dotContainer ?? DOT_CONTAINER,
    onIndexChange,
    containerStyle = props.containerStyle ?? INITIAL_CONTAINER_STYLE,
  } = props;

  const clampedActiveIndex = Math.min(Math.max(activeIndex, 0), totalItems - 1);

  const scale = useSharedValue<number>(1);
  const index_ = useSharedValue<number>(clampedActiveIndex);

  useEffect(() => {
    const _shapedIndex = (index_.value = Math.min(
      Math.max(activeIndex, 0),
      totalItems - 1
    ));
    if (onIndexChange) {
      onIndexChange(_shapedIndex);
    }
  }, [activeIndex, totalItems]);

  const longPressGesture: PanGesture = Gesture.Pan()
    .onStart(() => {
      scale.value = withTiming<number>(1.2, { duration: 150 });
    })
    .onUpdate((e) => {
      const index = Math.floor(e.absoluteX / (width / totalItems));
      if (index >= 0 && index < totalItems) {
        index_.value = index;
        if (onIndexChange) {
          runOnJS(onIndexChange)(index);
        }
      }
    })
    .onEnd(() => {
      scale.value = withTiming<number>(1, { duration: 150 });
    })
    .onFinalize(() => {
      scale.value = withTiming<number>(1, { duration: 150 });
    });

  const animatedStyle = useAnimatedStyle<ViewStyle>(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const animation = useDerivedValue<number>(() => {
    return withTiming<number>(index_.value, {
      easing: Easing.linear,
      duration: 300,
    });
  });

  return (
    <GestureDetector gesture={longPressGesture}>
      <Animated.View style={[animatedStyle]} {...props}>
        <View style={{ flexDirection: "row" }}>
          <Indicator
            animation={animation}
            dotContainer={dotContainer}
            containerStyle={containerStyle as StyleProp<ViewStyle>}
            radius={borderRadius}
          />
          {[...Array(totalItems).keys()].map((index) => (
            <Dot
              key={`index-${index}`}
              index={index}
              animation={animation}
              activeColor={activeColor}
              inactiveColor={inactiveColor}
              currentColor={currentColor}
              dotSize={dotSize}
              borderRadius={borderRadius}
              dotContainer={dotContainer}
            />
          ))}
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

function Indicator({
  animation,
  dotContainer,
  radius,
  containerStyle,
}: {
  animation: SharedValue<number>;
  dotContainer?: number;
  radius?: number;
  containerStyle?: StyleProp<ViewStyle>;
}) {
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
      opacity: withTiming<number>(opacity, {
        duration: 200,
        easing: Easing.linear,
      }),
    };
  });

  return (
    <Animated.View
      style={[
        {
          height: dotContainer,
          position: "absolute",
          left: 0,
          top: 0,
          borderRadius: radius,
        },
        containerStyle,
        indicatorAnimatedStyle,
      ]}
    />
  );
}

function Dot<T extends {}>({
  index,
  animation,
  inactiveColor = INACTIVE_COLOR,
  activeColor = ACTIVE_COLOR,
  currentColor = CURRENT_COLOR,
  dotSize = DOT_SIZE,
  borderRadius = BORDER_RADIUS,
}: {
  index: number;
  animation: SharedValue<number>;
  inactiveColor?: string;
  activeColor?: string;
  currentColor?: string;
  dotSize?: number;
  borderRadius?: number;
  dotContainer?: number;
}) {
  const animatedDotContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        animation.value,
        [index - 1, index, index + 1],
        [inactiveColor, activeColor, currentColor]
      ),
    };
  });

  return (
    <Animated.View style={styles.dotContainer}>
      <Animated.View
        style={[
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            borderRadius: borderRadius,
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

    backgroundColor: "#000",
    marginHorizontal: 5,
  },
});
