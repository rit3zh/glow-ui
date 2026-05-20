import { View, StyleSheet, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import Glow from "@/components/base/glow";
import Marquee from "@/components/base/marquee";
import { useFonts } from "expo-font";

export default function App() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
  });
  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" />
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
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    alignItems: "center",
    paddingTop: 100,
  },
  card: {
    width: 280,
    height: 56,
    backgroundColor: "#151515",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: { width: 20 },
  text: {
    fontSize: 35,
    color: "#fff",
  },
});
