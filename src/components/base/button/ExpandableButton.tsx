import React, { useEffect } from "react";
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import type { ExpandableButtonProps } from "./ExpandableButton.types";

export const ExpandableButton: React.FC<ExpandableButtonProps> = ({
  title,
  isLoading,
  onPress,
  width = 200,
  height = 48,
}): React.JSX.Element & React.ReactNode => {
  const animatedWidth = useSharedValue<number>(width);

  useEffect(() => {
    animatedWidth.value = withSpring<number>(isLoading ? height : width, {
      damping: 15,
      stiffness: 150,
    });
  }, [isLoading, width, height, animatedWidth]);

  const animatedStyle = useAnimatedStyle<ViewStyle>(() => ({
    width: animatedWidth.value,
    borderRadius: animatedWidth.value / 2,
  }));

  return (
    <Pressable onPress={onPress} disabled={isLoading}>
      <Animated.View style={[styles.button, { height }, animatedStyle]}>
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.text}>{title}</Text>
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
