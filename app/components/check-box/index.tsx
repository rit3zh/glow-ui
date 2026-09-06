import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { Checkbox } from "@/components";
import { Showcase } from "~/showcase";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function CheckBoxScreen() {
  const [checked, setChecked] = useState(false);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = useCallback(() => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 300, mass: 0.5 });
  }, [scale]);

  const onPressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 250, mass: 0.5 });
  }, [scale]);

  const onPress = useCallback(() => setChecked((prev) => !prev), []);

  return (
    <Showcase>
      <View style={styles.stage}>
        <View style={styles.demo}>
          <AnimatedPressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked }}
            hitSlop={12}
            onPress={onPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            style={animatedStyle}
          >
            <View style={styles.checkBoxContainer}>
              <Checkbox
                checked={checked}
                showBorder={false}
                checkmarkColor="#fff"
                size={50}
                stroke={4}
              />
            </View>
          </AnimatedPressable>
        </View>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  checkBoxContainer: {
    width: 45,
    height: 45,
    backgroundColor: "#242424",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  demo: { gap: 12, alignItems: "flex-start" },
});
