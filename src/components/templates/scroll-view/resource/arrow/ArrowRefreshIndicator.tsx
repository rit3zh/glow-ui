import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { RefreshControlProps } from "../../base/RefreshControl.props";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg from "react-native-svg";

export const ArrowRefreshIndicator: React.FC<RefreshControlProps> = ({
  pullDistance,
  isRefreshing,
  refreshTriggerDistance,
}) => {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    if (isRefreshing.value) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 1000 }),
        -1,
        false
      );
    } else {
      rotation.value = 0;
    }

    return () => {
      rotation.value = 0;
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
    };
  });

  const arrowStyle = useAnimatedStyle(() => {
    // Transform arrow into loading spinner
    const rotate = isRefreshing.value
      ? `${rotation.value}deg`
      : `${interpolate(
          pullDistance.value,
          [0, refreshTriggerDistance],
          [0, 180],
          Extrapolation.CLAMP
        )}deg`;

    return {
      transform: [
        { rotate },
        {
          scale: interpolate(
            pullDistance.value,
            [0, refreshTriggerDistance],
            [0.8, 1.2],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  const progressStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      pullDistance.value,
      [0, refreshTriggerDistance],
      [0, 1],
      Extrapolation.CLAMP
    );

    // Circle progress animation
    return {
      strokeDashoffset: isRefreshing.value
        ? 0
        : interpolate(progress, [0, 1], [100, 0], Extrapolation.CLAMP),
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
    };
  });

  return (
    <Animated.View style={[styles.arrowContainer, containerStyle]}>
      <Animated.View style={[styles.arrowCircle]}>
        <Svg height="50" width="50" viewBox="0 0 50 50">
          <Animated
            cx="25"
            cy="25"
            r="20"
            stroke="#3b82f6"
            strokeWidth="2"
            fill="transparent"
            strokeDasharray="100"
            style={progressStyle}
          />
        </Svg>

        <Animated.View style={[styles.arrow, arrowStyle]}>
          {isRefreshing.value ? (
            <View style={styles.spinner} />
          ) : (
            <Text style={styles.arrowSymbol}>↓</Text>
          )}
        </Animated.View>
      </Animated.View>

      <Animated.Text style={[styles.arrowText, textStyle]}>
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
