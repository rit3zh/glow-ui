import React from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type GestureResponderEvent,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SymbolView } from "expo-symbols";
import {
  AnimationType,
  EasingType,
  ThemeProvider,
  useTheme,
} from "@/components/organisms/theme-switch";

function ThemeSwitchDemo() {
  const { colors, toggleTheme, isDark } = useTheme();

  const onPress = (event: GestureResponderEvent) => {
    void toggleTheme({
      animationType: AnimationType.CircularBlur,
      animationDuration: 1600,
      easing: EasingType.EaseInOut,
      touchX: event.nativeEvent.pageX,
      touchY: event.nativeEvent.pageY,
    });
  };

  return (
    <>
      <StatusBar animated style={isDark ? "light" : "dark"} />
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <Pressable onPress={onPress} hitSlop={16}>
          <SymbolView
            name={isDark ? "sun.max.fill" : "moon.fill"}
            tintColor={colors.text}
            size={58}
          />
        </Pressable>
      </View>
    </>
  );
}

export default function HomeScreen() {
  return (
    <ThemeProvider>
      <ThemeSwitchDemo />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
