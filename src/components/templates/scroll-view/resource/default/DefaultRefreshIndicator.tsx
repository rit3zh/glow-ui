import React from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  interpolateColor,
  withTiming,
  withSequence,
  withDelay,
} from "react-native-reanimated";
import { RefreshControlComponent } from "../../base/RefreshControl.props";

export const DefaultRefreshIndicator: RefreshControlComponent = ({
  progress,
  isPulling,
  isRefreshing,
  threshold,
  pullDistance,
  refreshTriggerDistance,
  maxPullDistance,
  refreshCompleted = false, // Add support for refreshCompleted state
}) => {
  const spinValue = useSharedValue(0);
  const successAnimValue = useSharedValue(0);

  // Spin animation during refreshing
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (isRefreshing.value) {
        spinValue.value = (spinValue.value + 10) % 360;
      }
    }, 50);
    return () => clearInterval(interval);
  }, [isRefreshing.value]);

  // Success animation when refresh completes
  React.useEffect(() => {
    if (refreshCompleted) {
      // Animate success indicator
      successAnimValue.value = withSequence(
        withTiming(1, { duration: 300 }),
        withDelay(500, withTiming(0, { duration: 300 }))
      );
    } else {
      successAnimValue.value = 0;
    }
  }, [refreshCompleted]);

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

    // Determine rotation based on state
    let rotate;
    if (refreshCompleted) {
      // Stop spinning when completed
      rotate = `${spinValue.value}deg`;
    } else if (isRefreshing.value) {
      // Continue spinning during refresh
      rotate = `${spinValue.value}deg`;
    } else {
      // Rotate based on pull distance
      rotate = `${interpolate(
        pullDistance.value,
        [0, refreshTriggerDistance],
        [0, 180],
        Extrapolation.CLAMP
      )}deg`;
    }

    // Determine color based on state and pull distance
    const color = refreshCompleted
      ? "#4CAF50" // Success green color
      : interpolateColor(
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
    const color = refreshCompleted
      ? "#4CAF50" // Success green color
      : interpolateColor(
          pullDistance.value,
          [0, refreshTriggerDistance - 10, refreshTriggerDistance],
          ["#999", "#666", "#000"]
        );

    return { color };
  });

  // Success checkmark animation
  const checkmarkStyle = useAnimatedStyle(() => {
    return {
      opacity: successAnimValue.value,
      transform: [
        {
          scale: interpolate(successAnimValue.value, [0, 0.5, 1], [0, 1.2, 1]),
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.refreshContainer, containerStyle]}>
      {refreshCompleted ? (
        <>
          <Animated.Text style={[styles.refreshIcon, iconStyle]}>
            ✓
          </Animated.Text>
          <Animated.Text style={[styles.refreshText, textStyle]}>
            Refresh completed
          </Animated.Text>
          <Animated.View style={[styles.successIndicator, checkmarkStyle]} />
        </>
      ) : (
        <>
          <Animated.Text style={[styles.refreshIcon, iconStyle]}>
            ⭮
          </Animated.Text>
          <Animated.Text style={[styles.refreshText, textStyle]}>
            {isRefreshing.value
              ? "Refreshing..."
              : pullDistance.value >= refreshTriggerDistance
                ? "Release to refresh"
                : "Pull to refresh"}
          </Animated.Text>
        </>
      )}
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
  successIndicator: {
    position: "absolute",
    right: -20,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#4CAF50",
  },
});
