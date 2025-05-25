import React, { useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import type { ExpandableButtonProps } from "./ExpandableButton.types";
import { LinearGradient } from "expo-linear-gradient";

export const ExpandableButton: React.FC<ExpandableButtonProps> = ({
  title,
  isLoading,
  onPress,
  width = 200,
  height = 48,
  backgroundColor = "#3B82F6",
  textColor = "white",
  fontSize = 16,
  icon,
  iconSize = 18,
  iconColor,
  borderRadius,
  gradientColors,
  style,
  textStyle,
  withPressAnimation = true,
  loadingComponent,
  loadingIndicatorColor = "white",
  animationConfig = {
    damping: 15,
    stiffness: 150,
    duration: 300,
  },
  disabled = false,
}): React.JSX.Element => {
  // Animation values
  const animatedWidth = useSharedValue<number>(width);
  const animatedScale = useSharedValue<number>(1);
  const animatedOpacity = useSharedValue<number>(1);

  // Update width on loading state change
  useEffect(() => {
    animatedWidth.value = withSpring<number>(isLoading ? height : width, {
      damping: animationConfig.damping,
      stiffness: animationConfig.stiffness,
    });
  }, [isLoading, width, height, animatedWidth, animationConfig]);

  // Calculate default border radius if not provided
  const calculatedBorderRadius = borderRadius ?? height / 2;

  // Animated styles
  const animatedStyle = useAnimatedStyle<ViewStyle>(() => ({
    width: animatedWidth.value,
    borderRadius: withTiming(isLoading ? height / 2 : calculatedBorderRadius, {
      duration: animationConfig.duration,
    }),
    transform: [{ scale: animatedScale.value }],
    opacity: animatedOpacity.value,
  }));

  // Handle press animation
  const handlePressIn = () => {
    if (withPressAnimation && !disabled && !isLoading) {
      animatedScale.value = withTiming(0.95, { duration: 100 });
    }
  };

  const handlePressOut = () => {
    if (withPressAnimation && !disabled && !isLoading) {
      animatedScale.value = withTiming(1, { duration: 200 });
    }
  };

  // Determine the content to render
  const renderContent = () => {
    if (isLoading) {
      return (
        loadingComponent || (
          <ActivityIndicator color={loadingIndicatorColor} size="small" />
        )
      );
    }

    return (
      <>
        {icon && (
          <Feather
            name={icon}
            size={iconSize}
            color={iconColor || textColor}
            style={{ marginRight: 8 }}
          />
        )}
        <Text
          style={[styles.text, { color: textColor, fontSize }, textStyle]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
      </>
    );
  };

  // Render with or without gradient
  const wrappedButton = gradientColors ? (
    <Animated.View style={[animatedStyle]}>
      <LinearGradient
        colors={gradientColors as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.gradientContainer,
          {
            height,
            width: "100%",
            borderRadius: isLoading ? height / 2 : calculatedBorderRadius,
          },
          style,
        ]}
      >
        {renderContent()}
      </LinearGradient>
    </Animated.View>
  ) : (
    <Animated.View
      style={[
        styles.button,
        {
          height,
          backgroundColor: backgroundColor,
        },
        animatedStyle,
        style,
      ]}
    >
      {renderContent()}
    </Animated.View>
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading || disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={({ pressed }) => [
        styles.pressable,
        Platform.OS === "ios" && pressed && styles.pressed,
      ]}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isLoading || disabled }}
    >
      {wrappedButton}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    alignSelf: "flex-start",
  },
  pressed: {
    opacity: 0.9,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    overflow: "hidden",
  },
  gradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    overflow: "hidden",
    height: "100%",
    width: "100%",
  },
  text: {
    fontWeight: "600",
  },
});
