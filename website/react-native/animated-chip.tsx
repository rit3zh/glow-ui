import React, { useEffect } from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolateColor,
  Easing,
  interpolate,
} from "react-native-reanimated";
import type { AnimatedChipProps } from "./Chip.types";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";

export const AnimatedChip = ({
  label,
  icon,
  isActive,
  onPress,
  activeColor,
  labelColor,
  inActiveBackgroundColor,
}: AnimatedChipProps) => {
  const progress = useSharedValue<number>(isActive ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring<number>(isActive ? 1 : 0, {});
  }, [isActive]);

  const animatedContainerStyle = useAnimatedStyle<
    Required<
      Partial<
        Pick<ViewStyle, "width" | "paddingHorizontal" | "backgroundColor">
      >
    >
  >(() => {
    return {
      width: withSpring<number>(isActive ? 160 : 50, {}),
      paddingHorizontal: 12,
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [inActiveBackgroundColor ?? "#333333", activeColor!],
      ),
    };
  });

  const animatedTextStyle = useAnimatedStyle<
    Partial<Required<Pick<ViewStyle, "opacity" | "transform">>>
  >(() => {
    return {
      opacity: withTiming<number>(isActive ? 1 : 0, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      transform: [
        {
          translateX: withTiming(isActive ? 0 : -15, {
            duration: 300,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          }),
        },
        {
          scale: withTiming(isActive ? 1 : 0.85, {
            duration: 300,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          }),
        },
      ],
    };
  });

  const iconStylez = useAnimatedStyle<
    Partial<Required<Pick<ViewStyle, "transform">>>
  >(() => {
    return {
      transform: [
        {
          translateX: interpolate(progress.value, [0, 1], [-8, -5]),
        },
      ],
    };
  });

  const handlePress = () => {
    impactAsync(ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable onPress={handlePress}>
      <Animated.View style={[styles.chip, animatedContainerStyle]}>
        <Animated.View style={[styles.iconWrapper, iconStylez]}>
          {icon()}
        </Animated.View>
        <Animated.View
          style={[styles.labelWrapper, animatedTextStyle]}
          pointerEvents={isActive ? "auto" : "none"}
        >
          <Animated.Text
            style={[styles.label, { color: labelColor ?? "#FFFFFF" }]}
            numberOfLines={1}
          >
            {label}
          </Animated.Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  chip: {
    height: 50,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "center",
    overflow: "hidden",
  },
  iconWrapper: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,

    marginLeft: 10,
  },
  labelWrapper: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 0,
  },
});
