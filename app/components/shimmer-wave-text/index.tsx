import { View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { ShimmerWaveText } from "@/components/base/shimmer-wave-text";
import { Showcase } from "~/showcase";

export default function App() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
  });

  return (
    <Showcase>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar style="light" />
        <View>
          <View style={styles.content}>
            <ShimmerWaveText
              text="Try Reacticx you will not regret it!"
              textColor="#212121"
              textStyle={{
                fontFamily: fontLoaded ? "SfProRounded" : undefined,
                fontSize: 25,
              }}
              shimmerConfig={{
                duration: 2200,
                width: 0.7,
                colors: [
                  "transparent",
                  "rgba(255, 138, 61, 0.25)",
                  "rgba(255, 106, 0, 0.85)",
                  "rgba(255, 210, 138, 1)",
                  "rgba(255, 106, 0, 0.5)",
                  "transparent",
                ],
              }}
              floatConfig={{
                distance: 12,

                scaleAmount: 0.25,
                characterDelay: 4,
              }}
            />
          </View>
        </View>
      </GestureHandlerRootView>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    alignItems: "center",
    justifyContent: "center",
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
