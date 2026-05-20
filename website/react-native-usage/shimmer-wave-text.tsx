import { View, Text, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { useState } from "react";
import Ruler from "@/components/base/ruler";
import { ShimmerWaveText } from "@/components/base/shimmer-wave-text";

export default function App() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
  });

  const [value, setValue] = useState(18);

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" />
      <View style={{ marginTop: 100 }}>
        <View style={styles.content}>
          <ShimmerWaveText
            text="Try Reacticx you will not regret it!"
            textColor="#212121"
            textStyle={{
              fontFamily: fontLoaded ? "SfProRounded" : undefined,
              fontSize: 30,
            }}
          />
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    alignItems: "center",

    gap: 40,
  },
  content: {
    alignItems: "center",
    gap: 9,
  },
  label: {
    fontSize: 15,
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  value: {
    fontSize: 72,
    color: "#fff",
    fontWeight: "600",
  },
  unit: {
    fontSize: 24,
    color: "rgba(255,255,255,0.5)",
  },
});
