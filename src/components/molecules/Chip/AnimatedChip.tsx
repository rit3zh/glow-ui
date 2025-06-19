import { SymbolView } from "expo-symbols";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  withSpring,
} from "react-native-reanimated";
import type { AnimatedChipProps } from "./Chip.types";

export const AnimatedChip = ({
  label,
  icon,
  isActive,
  onPress,
  activeIcon,
  activeColor,
}: AnimatedChipProps) => {
  const progress = useSharedValue<number>(isActive ? 1 : 0);
  const iconOpacity = useSharedValue<number>(isActive ? 1 : 0);
  useEffect(() => {
    progress.value = withTiming<number>(isActive ? 1 : 0, { duration: 500 });
    iconOpacity.value = withTiming<number>(isActive ? 1 : 0.5, {
      duration: 500,
    });
  }, [isActive]);

  const animatedContainerStyle = useAnimatedStyle<ViewStyle>(() => {
    return {
      width: withSpring(isActive ? 140 : 50, {
        damping: 90,
        velocity: 2,
        stiffness: 180,
      }),

      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        ["#333333", activeColor!],
      ),
    };
  });

  const animatedIconOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: iconOpacity.value,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      transform: [
        {
          translateX: withTiming(isActive ? 0 : -8, { duration: 200 }),
        },
      ],
    };
  });

  return (
    <Pressable onPress={onPress}>
      <Animated.View style={[styles.chip, animatedContainerStyle]}>
        <Animated.View style={[animatedIconOpacityStyle]}>
          <SymbolView
            size={18}
            name={isActive && activeIcon ? activeIcon : icon}
            tintColor={isActive ? "#FFFFFF" : "#AAAAAA"}
          />
        </Animated.View>
        {isActive && (
          <Animated.View>
            <Animated.View style={[styles.labelWrapper, animatedTextStyle]}>
              <Animated.Text style={styles.label}>{label}</Animated.Text>
            </Animated.View>
          </Animated.View>
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    // padding: 12,
  },
  chip: {
    height: 40,
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  labelWrapper: {
    marginLeft: 8,
    minWidth: 60,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
});
