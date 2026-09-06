import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { FadeText } from "@/components/organisms/fade-text";
import { Showcase } from "~/showcase";

export default function App(): React.JSX.Element {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
    Coolvetica: require("@/assets/fonts/Coolvetica-Rg.otf"),
  });

  const INPUTS: string[] = [
    "Reacticx is awesome!",
    "UI components made easy.",
    "Build stunning apps fast.",
    "Customizable and flexible.",
    "Join the Reacticx community!",
  ];

  return (
    <Showcase>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar style="light" />

        <FadeText
          inputs={INPUTS}
          duration={3500}
          wordDelay={300}
          blurIntensity={[30, 20, 0]}
          scaleRange={[0.98, 1]}
          blurTint="systemUltraThinMaterialDark"
          textAlign="left"
          style={{
            fontFamily: fontLoaded ? "SfProRounded" : undefined,
            fontSize: 20,
          }}
        />
      </GestureHandlerRootView>
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

  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },

  subtitle: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    marginTop: 2,
  },

  body: {
    marginTop: 12,
    color: "rgba(255,255,255,0.75)",
    fontSize: 14,
    lineHeight: 20,
  },

  trigger: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },

  menu: {
    backgroundColor: "#fff",
  },

  itemText: {
    fontSize: 15,
    color: "#111",
  },

  destructive: {
    color: "#dc2626",
  },
});
