import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  withRepeat,
  withTiming,
  useSharedValue,
  withSequence,
  withDelay,
  interpolateColor,
} from "react-native-reanimated";

import type { RefreshControlProps } from "../../base/RefreshControl.props";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const MaterialRefreshIndicator: React.FC<RefreshControlProps> = ({
  pullDistance,
  isRefreshing,
  refreshTriggerDistance,
}) => {
  const rotation = useSharedValue(0);
  const circleScale = useSharedValue(0);

  React.useEffect(() => {
    if (isRefreshing.value) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 1500 }),
        -1,
        false
      );

      // Pulsating animation for the circle
      circleScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 700 }),
          withTiming(1, { duration: 700 })
        ),
        -1,
        true
      );
    } else {
      rotation.value = 0;
      circleScale.value = 0;
    }

    return () => {
      rotation.value = 0;
      circleScale.value = 0;
    };
  }, [isRefreshing.value]);

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        pullDistance.value,
        [0, refreshTriggerDistance * 0.3],
        [0, 1],
        Extrapolation.CLAMP
      ),
      transform: [
        {
          translateY: interpolate(
            pullDistance.value,
            [0, refreshTriggerDistance],
            [0, refreshTriggerDistance * 0.2],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  const circleWrapperStyle = useAnimatedStyle(() => {
    const progress = isRefreshing.value
      ? 1
      : interpolate(
          pullDistance.value,
          [0, refreshTriggerDistance],
          [0, 1],
          Extrapolation.CLAMP
        );

    return {
      transform: [
        { rotate: isRefreshing.value ? `${rotation.value}deg` : "0deg" },
        { scale: isRefreshing.value ? circleScale.value : progress },
      ],
    };
  });

  const arcStyle = useAnimatedStyle(() => {
    // Arc completion based on pull distance
    const dashOffset = isRefreshing.value
      ? 0
      : interpolate(
          pullDistance.value,
          [0, refreshTriggerDistance],
          [156, 0], // 156 is approximately the circumference of a circle with radius 25
          Extrapolation.CLAMP
        );

    return {
      strokeDashoffset: dashOffset,
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        pullDistance.value,
        [refreshTriggerDistance * 0.5, refreshTriggerDistance],
        [0, 1],
        Extrapolation.CLAMP
      ),
      color: isRefreshing.value ? "#4285F4" : "#666",
    };
  });

  return (
    <Animated.View style={[styles.materialContainer, containerStyle]}>
      <Animated.View style={[styles.circleWrapper, circleWrapperStyle]}>
        <View style={styles.circleBg} />
        <Animated.View style={[styles.arcWrapper, arcStyle]}>
          <View style={styles.materialSpinner}>
            <Animated.View style={styles.circleProgress}>
              <Svg height="50" width="50" viewBox="0 0 50 50">
                <AnimatedCircle
                  cx="25"
                  cy="25"
                  r="20"
                  stroke="#4285F4"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray="156"
                  style={arcStyle}
                  strokeLinecap="round"
                />
              </Svg>
            </Animated.View>
          </View>
        </Animated.View>
      </Animated.View>

      <Animated.Text style={[styles.materialText, textStyle]}>
        {isRefreshing.value
          ? "Refreshing"
          : pullDistance.value >= refreshTriggerDistance
            ? "Release"
            : "Pull to refresh"}
      </Animated.Text>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  // Spinner Refresh Styles
  spinnerContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  spinner: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#3b82f6",
    borderTopColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  spinnerCircle: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3b82f6",
    top: -4,
    left: 11,
  },
  spinnerText: {
    marginTop: 8,
    fontSize: 14,
    color: "#555",
  },

  // Material Refresh Styles
  materialContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  circleWrapper: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  circleBg: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(66, 133, 244, 0.1)",
  },
  arcWrapper: {
    position: "absolute",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  materialSpinner: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  circleProgress: {
    width: 50,
    height: 50,
  },
  materialText: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
  },

  // Character Refresh Styles
  characterContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  character: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
  },
  eye: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#333",
    top: 12,
  },
  leftEye: {
    left: 10,
  },
  rightEye: {
    right: 10,
  },
  mouth: {
    position: "absolute",
    width: 10,
    height: 3,
    backgroundColor: "#333",
    borderRadius: 2,
    bottom: 12,
  },
  characterText: {
    marginTop: 8,
    fontSize: 14,
    color: "#555",
  },

  // Loading Dots Styles
  dotsContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#3b82f6",
    margin: 3,
  },
  dotsText: {
    marginTop: 8,
    fontSize: 14,
    color: "#555",
  },

  // Arrow Refresh Styles
  arrowContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  arrowCircle: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  arrow: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  arrowSymbol: {
    fontSize: 20,
    color: "#3b82f6",
    fontWeight: "bold",
  },
  arrowText: {
    marginTop: 8,
    fontSize: 14,
    color: "#555",
  },
});
