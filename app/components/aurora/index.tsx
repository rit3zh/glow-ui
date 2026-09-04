import Aurora from "@/components/molecules/aurora";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Showcase } from "~/showcase";

export default function AuroraScreen() {
  return (
    <Showcase>
      <View style={styles.container}>
        <View
          style={{
            bottom: 80,
          }}
        >
          <Aurora />
        </View>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  content: { padding: 16, gap: 16 },
  title: { color: "#fff", fontSize: 22, fontWeight: "600" },
  demo: { gap: 12 },
});
