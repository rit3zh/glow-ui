import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { GooeyPopover, GooeyPopoverSide } from "@/components";
import { Showcase } from "~/showcase";

export default function GooeyPopoverScreen() {
  return (
    <Showcase>
      <View style={styles.center}>
        <GooeyPopover.Root
          gooStrength={10}
          side={GooeyPopoverSide.Top}
          color="#f4f1ea"
        >
          <GooeyPopover.Trigger pressScale={0.92}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Deploy</Text>
            </View>
          </GooeyPopover.Trigger>

          <GooeyPopover.Content>
            <View style={styles.panel}>
              <Text style={styles.title}>Build 214</Text>
              <Text style={styles.body}>
                Pushed to TestFlight 2 minutes ago. Review notes before you ship
                it wider.
              </Text>
            </View>
          </GooeyPopover.Content>
        </GooeyPopover.Root>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  panel: {
    gap: 6,
    width: 240,
  },
  buttonText: { fontSize: 15, fontWeight: "600", color: "#171412" },
  title: { fontSize: 15, fontWeight: "700", color: "#171412" },
  body: { fontSize: 14, lineHeight: 20, color: "#6f6860" },
});
