import {
  StyleSheet,
  Text,
  Pressable,
  type LayoutChangeEvent,
  type ViewStyle,
  type PressableProps,
  Platform,
} from "react-native";
import React, { useState, useCallback } from "react";
import Animated, {
  interpolate,
  Extrapolation,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedProps,
  type AnimatedProps,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { BlurView, type BlurViewProps } from "expo-blur";
import type { FlexiButtonProps } from "./types";

const AnimatedBlurView =
  Animated.createAnimatedComponent<BlurViewProps>(BlurView);
const AnimatedPressable =
  Animated.createAnimatedComponent<PressableProps>(Pressable);

const FlexiButton: React.FC<FlexiButtonProps> = ({
  onPress,
  collapsedWidth = 40,
  expandedWidth = 120,
  text = "Clear All",
  icon = "notifications",
  onDimensionsChange,
  backgroundColor = "rgba(255, 255, 255, 0.1)",
}: FlexiButtonProps) => {
  const progress = useSharedValue<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width, height, x, y } = event.nativeEvent.layout;
      onDimensionsChange?.({ width, height, x, y });
    },
    [onDimensionsChange],
  );

  const handlePress = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    progress.value = withSpring<number>(newState ? 1 : 0);
    onPress?.();
  };

  const animatedContainerStyle = useAnimatedStyle<ViewStyle>(() => {
    const width = interpolate(
      progress.value,
      [0, 1],
      [collapsedWidth, expandedWidth],
      Extrapolation.CLAMP,
    );
    return {
      width,
    };
  });

  const animatedBlurProps = useAnimatedProps<AnimatedProps<BlurViewProps>>(
    () => {
      const intensity = withSpring<number>(
        interpolate(
          progress.value,
          [0, 0.2, 0.3, 0.5, 1],
          [0, 10, 15, 25, 0],
          Extrapolation.CLAMP,
        ),
      );
      return {
        // @ts-ignore
        intensity,
      };
    },
  );

  const animatedIconStyle = useAnimatedStyle<ViewStyle>(() => {
    const scale = interpolate(
      progress.value,
      [0, 1],
      [1, 0.8],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      progress.value,
      [0, 0.3],
      [1, 0],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      progress.value,
      [0.1, 1],
      [0, 1],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      progress.value,
      [0, 1],
      [0.8, 1],
      Extrapolation.CLAMP,
    );

    return {
      opacity,
      transform: [
        {
          scale,
        },
      ],
    };
  });

  const animatedBlurViewStylez = useAnimatedStyle<ViewStyle>(() => {
    const blur = withSpring<number>(
      interpolate(
        progress.value,
        [0, 0.5, 1],
        [0, 4.5, 0],
        Extrapolation.CLAMP,
      ),
    );

    return {
      filter: [
        {
          blur,
        },
      ],
    };
  });

  return (
    <AnimatedPressable
      onPress={handlePress}
      onLayout={handleLayout}
      style={[
        styles.container,
        animatedContainerStyle,
        {
          backgroundColor: backgroundColor,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.content,
          Platform.OS === "android" && animatedBlurViewStylez,
        ]}
      >
        <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
          {typeof icon === "function" ? (
            icon()
          ) : (
            <Ionicons name={icon as any} size={18} color="#fff" />
          )}
        </Animated.View>
        <Animated.View style={[styles.textContainer, animatedTextStyle]}>
          <Text style={styles.text} numberOfLines={1}>
            {text}
          </Text>
        </Animated.View>
      </Animated.View>
      {Platform.OS === "ios" && (
        <AnimatedBlurView
          tint="dark"
          style={[StyleSheet.absoluteFillObject]}
          animatedProps={animatedBlurProps}
        />
      )}
    </AnimatedPressable>
  );
};

export { FlexiButton };

const styles = StyleSheet.create({
  container: {
    borderRadius: 99,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    height: 40,
  },
  content: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
