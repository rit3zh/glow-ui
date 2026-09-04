import { View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import EnergyOrb from "@/components/organisms/energy-orb";
import { Showcase } from "~/showcase";

export default function App(): React.JSX.Element {
  return (
    <Showcase>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar style="light" />

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <EnergyOrb
            width={300}
            intensity={0.8}
            height={300}
            colors={["#FFF3B0", "#FFD166", "#FFB703", "#FB8500"]}
          />
        </View>
      </GestureHandlerRootView>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",

    paddingHorizontal: 24,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 20,
    top: 120,
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
