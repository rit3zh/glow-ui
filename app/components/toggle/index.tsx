import { Toggle } from "@/components";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Showcase } from "~/showcase";
import { Feather } from "@expo/vector-icons";
export default function ToggleScreen() {
  return (
    <Showcase>
      <View style={styles.container}>
        <Toggle.Root size="lg" theme="dark" defaultPressed>
          <Toggle.Icon>
            <Feather name="package" size={18} color="#F6F3EC" />
          </Toggle.Icon>
        </Toggle.Root>
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
  content: { padding: 16, gap: 16 },
  title: { color: "#fff", fontSize: 22, fontWeight: "600" },
  demo: { gap: 12 },
});
