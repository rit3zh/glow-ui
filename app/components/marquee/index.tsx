import { View, StyleSheet, Text, Dimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import Marquee from "@/components/base/marquee";
import { useFonts } from "expo-font";
import { Showcase } from "~/showcase";
import { LinearGradient } from "expo-linear-gradient";

const WIDTH = Dimensions.get("window").width;

export default function App() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
  });

  return (
    <Showcase>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.marqueeContainer}>
          <Marquee>
            <Text
              style={[
                styles.text,
                {
                  fontFamily: fontLoaded ? "SfProRounded" : undefined,
                },
              ]}
            >
              ⋆ ✦ ⋆
            </Text>

            <View style={styles.divider} />

            <Text
              style={[
                styles.text,
                {
                  fontFamily: fontLoaded ? "SfProRounded" : undefined,
                },
              ]}
            >
              Reacticx
            </Text>
          </Marquee>

          {/* Left fade */}
          <LinearGradient
            pointerEvents="none"
            colors={["#0a0a0a", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.leftGradient}
          />

          {/* Right fade */}
          <LinearGradient
            pointerEvents="none"
            colors={["transparent", "#0a0a0a"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.rightGradient}
          />
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
  },

  marqueeContainer: {
    width: WIDTH,
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    overflow: "hidden",
  },

  leftGradient: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 100,
    zIndex: 2,
  },

  rightGradient: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 100,
    zIndex: 2,
  },

  divider: {
    width: 20,
  },

  text: {
    fontSize: 35,
    color: "#fff",
  },
});
