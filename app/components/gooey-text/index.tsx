import { View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import GooeyText from "@/components/molecules/gooey-text";
import { Showcase } from "~/showcase";

export default function App() {
  const GOOEY_TEXTS: string[] = ["REACTICX", "IS", "AWESOME!"];

  return (
    <Showcase>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar style="light" />

        <View style={styles.content}>
          <GooeyText texts={GOOEY_TEXTS} color="white" fontSize={50} />
        </View>
      </GestureHandlerRootView>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {},
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
  },
  subtitle: {
    fontSize: 15,
    color: "#555",
  },
  card: {
    backgroundColor: "#141414",
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 20,
  },
  triggerContent: {
    padding: 16,
  },
  triggerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  triggerText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    marginBottom: 6,
  },
  itemText: {
    fontSize: 15,
    color: "#fff",
  },
  destructiveText: {
    color: "#ff453a",
  },
});
