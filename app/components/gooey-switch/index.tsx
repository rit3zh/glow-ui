import { View, Text, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { SymbolView } from "expo-symbols";
import { CountdownTimer } from "@/components/micro-interactions/countdown";
import { Ionicons } from "@expo/vector-icons";
import { FlexiButton } from "@/components/micro-interactions/flexi-button";
import GooeySwitch from "@/components/micro-interactions/gooey-switch";
import { Showcase } from "~/showcase";

export default function App() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
    Coolvetica: require("@/assets/fonts/Coolvetica-Rg.otf"),
  });

  const launchDate = new Date("2026-07-20T14:30:00");

  return (
    <Showcase>
      <View style={styles.container}>
        <StatusBar style="light" />

        <View style={styles.content}>
          <GooeySwitch
            activeColor="#e8861e"
            size={200}
            trackColor="#1a1a1a"
            gooey={35}
            deformation={{
              squishY: 0.5,
              stretchX: 1.2,
            }}
          />
        </View>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  date: {
    fontSize: 15,
    color: "#333",
    marginTop: 8,
  },
});
