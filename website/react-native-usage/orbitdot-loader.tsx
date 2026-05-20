import { View, Text, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { SymbolView } from "expo-symbols";
import { DisclosureGroup } from "@/components/molecules/disclosure-group";
import DynamicText from "@/components/molecules/dynamic-text";
import { DynamicTextItem } from "@/components/molecules/dynamic-text/types";
import GooeyText from "@/components/molecules/gooey-text";
import { CircleLoadingIndicator, OrbitDotLoader } from "@/components";
import { CircularLoader } from "@/components/molecules/Loaders/circular";

export default function App() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
  });

  const OPTIONS = [
    { label: "Edit", icon: "pencil" },
    { label: "Duplicate", icon: "doc.on.doc" },
    { label: "Share", icon: "square.and.arrow.up" },
    { label: "Delete", icon: "trash", destructive: true },
  ];

  const GOOEY_TEXTS: string[] = ["REACTICX", "IS", "AWESOME!"];

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.content}>
        <OrbitDotLoader numDots={3} size={40} />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 90,
    justifyContent: "center",
    alignItems: "center",
    gap: 0,
  },
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
