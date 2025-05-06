import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Pressable,
} from "react-native";
import { SymbolView } from "expo-symbols"; // Chevron icon
import Animated, {
  withTiming,
  Easing,
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

// Accordion Trigger Component with Animated Chevron
export const AccordionTrigger = ({
  children,
  isActive,
  onToggle,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  onToggle?: () => void;
}) => {
  const rotate = useSharedValue(0); // Initial rotation value

  // Update rotation when isActive changes
  React.useEffect(() => {
    rotate.value = withTiming(isActive ? 180 : 0, {
      duration: 150,
      easing: Easing.inOut(Easing.ease),
    });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotate.value}deg` }],
    };
  });

  return (
    <Pressable onPress={onToggle} style={styles.trigger}>
      <View style={styles.triggerContent}>
        <Text style={[styles.triggerText]}>{children}</Text>
        <Animated.View style={[styles.chevronContainer, animatedStyle]}>
          <SymbolView name="chevron.down" size={12} tintColor="#fff" />
        </Animated.View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  trigger: {
    padding: 10,
    backgroundColor: "#000",
  },
  triggerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  triggerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  triggerActive: {
    fontWeight: "bold",
    color: "#007bff",
  },
  chevronContainer: {
    marginLeft: 10,
  },
});
