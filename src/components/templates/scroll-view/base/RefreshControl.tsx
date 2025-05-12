import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { RefreshControlComponent } from "./RefreshControl.props";
import { useEffect } from "react";
const RefreshControl: RefreshControlComponent = ({
  progress,
  isPulling,
  isRefreshing,
  threshold,
  pullDistance,
  refreshTriggerDistance,
  maxPullDistance,
}) => {
  const spinValue = useSharedValue(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isRefreshing.value) {
        spinValue.value = (spinValue.value + 10) % 360;
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isRefreshing.value]);

  const containerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      pullDistance.value,
      [0, refreshTriggerDistance * 0.4, refreshTriggerDistance],
      [0, 0.6, 1],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      pullDistance.value,
      [0, maxPullDistance],
      [0, maxPullDistance * 0.5],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      pullDistance.value,
      [0, refreshTriggerDistance * 0.5, refreshTriggerDistance],
      [0.8, 1, 1.2],
      Extrapolation.CLAMP
    );

    const rotate = isRefreshing.value
      ? `${spinValue.value}deg`
      : `${interpolate(
          pullDistance.value,
          [0, refreshTriggerDistance],
          [0, 180],
          Extrapolation.CLAMP
        )}deg`;

    const color = interpolateColor(
      pullDistance.value,
      [0, refreshTriggerDistance - 10, refreshTriggerDistance],
      ["#999", "#666", "#000"]
    );

    return {
      transform: [{ scale }, { rotate }],
      color,
    };
  });

  const textStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      pullDistance.value,
      [0, refreshTriggerDistance - 10, refreshTriggerDistance],
      ["#999", "#666", "#000"]
    );

    return { color };
  });

  return (
    <Animated.View style={[styles.refreshContainer, containerStyle]}>
      <Animated.Text style={[styles.refreshIcon, iconStyle]}>⭮</Animated.Text>
      <Animated.Text style={[styles.refreshText, textStyle]}>
        {isRefreshing.value
          ? "Refreshing..."
          : pullDistance.value >= refreshTriggerDistance
            ? "Release to refresh"
            : "Pull to refresh"}
      </Animated.Text>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  refreshControlContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: "center",
  },
  refreshContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    flexDirection: "row",
  },
  refreshIcon: {
    fontSize: 24,
    marginRight: 8,
    fontWeight: "bold",
  },
  refreshText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
