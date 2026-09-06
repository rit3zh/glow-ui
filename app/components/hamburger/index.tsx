import { HamburgerIcon } from "@/components/micro-interactions/hamburger";
import React, { useCallback } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Showcase } from "~/showcase";

const _size: number = 150;

export default function HamburgerScreen() {
  const progress = useSharedValue<number>(0);
  const onPress = useCallback(() => {
    progress.value = withTiming(progress.value === 1 ? 0 : 1);
  }, []);
  return (
    <Showcase>
      <View style={styles.container}>
        <HamburgerIcon
          progress={progress}
          color="#fff"
          onPress={onPress}
          size={_size}
        />
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
});
