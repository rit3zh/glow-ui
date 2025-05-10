import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  interpolate,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle } from "react-native-svg";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 40;
const CARD_HEIGHT = 140;

const Sparkles = () => {
  const sparkleY = useSharedValue(0);
  const sparkleOpacity = useSharedValue(1);

  useEffect(() => {
    sparkleY.value = withRepeat(withTiming(1, { duration: 3000 }), -1, false);
    sparkleOpacity.value = withRepeat(
      withTiming(0, { duration: 1500 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(sparkleY.value, [0, 1], [CARD_HEIGHT, -20]);
    return {
      transform: [{ translateY }],
      opacity: sparkleOpacity.value,
    };
  });

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, animatedStyle, { left: CARD_WIDTH / 2 }]}
      pointerEvents="none"
    >
      <Svg height="20" width="20">
        <Circle cx="10" cy="10" r="2" fill="#fff" />
        <Circle cx="6" cy="14" r="1.5" fill="#aaa" />
        <Circle cx="14" cy="6" r="1" fill="#ccc" />
      </Svg>
    </Animated.View>
  );
};

export const ShimmerCard = () => {
  const shimmerTranslate = useSharedValue(-1);

  useEffect(() => {
    shimmerTranslate.value = withRepeat(
      withTiming(1.5, { duration: 2000 }),
      -1,
      false
    );
  }, []);

  const animatedShimmerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      shimmerTranslate.value,
      [-1, 1],
      [-CARD_WIDTH, CARD_WIDTH]
    );

    return {
      transform: [{ translateX }],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Shimmer Layer */}
        <Animated.View style={[StyleSheet.absoluteFill, animatedShimmerStyle]}>
          <LinearGradient
            colors={["transparent", "rgba(255,255,255,0.4)", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              StyleSheet.absoluteFill,
              { width: CARD_WIDTH, height: CARD_HEIGHT },
            ]}
          />
        </Animated.View>

        {/* Sparkles Layer */}
        <Sparkles />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: "#1e1e1e",
    overflow: "hidden",
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  iconPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#333",
    marginRight: 16,
  },
  textBlock: {
    flex: 1,
    justifyContent: "center",
  },
  line: {
    height: 12,
    backgroundColor: "#333",
    borderRadius: 6,
    marginBottom: 10,
  },
});
