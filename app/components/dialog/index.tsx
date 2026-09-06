import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { Dialog } from "@/components";
import { Showcase } from "~/showcase";

type Direction = "top" | "bottom" | "left" | "right";

const DIRECTIONS: Direction[] = ["top", "bottom", "left", "right"];

export default function DialogScreen() {
  const [from, setFrom] = useState<Direction>("top");
  const [controlled, setControlled] = useState(false);

  return (
    <Showcase>
      <View style={styles.content}>
        <View style={styles.row}>
          {DIRECTIONS.map((direction) => (
            <Pressable
              key={direction}
              onPress={() => setFrom(direction)}
              style={[styles.chip, from === direction && styles.chipActive]}
            >
              <Text
                style={[
                  styles.chipText,
                  from === direction && styles.chipTextActive,
                ]}
              >
                {direction}
              </Text>
            </Pressable>
          ))}
        </View>

        <Dialog.Root theme="dark">
          <Dialog.Trigger>
            <View style={styles.trigger}>
              <Feather name="trash-2" size={16} color="#F6F3EC" />
              <Text style={styles.triggerText}>Delete item</Text>
            </View>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay intensity={32} />

            <Dialog.Content from={from}>
              <Dialog.Header>
                <Dialog.Title>Delete item?</Dialog.Title>
                <Dialog.Description>
                  This permanently removes the item and everything attached to
                  it. This action cannot be undone.
                </Dialog.Description>
              </Dialog.Header>

              <Dialog.Footer>
                <Dialog.Close asChild>
                  <Pressable style={[styles.btn, styles.cancelBtn]}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </Pressable>
                </Dialog.Close>

                <Dialog.Close asChild>
                  <Pressable style={[styles.btn, styles.deleteBtn]}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </Pressable>
                </Dialog.Close>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <Dialog.Root
          open={controlled}
          onOpenChange={setControlled}
          theme="light"
        >
          <Dialog.Trigger>
            <View style={[styles.trigger, styles.triggerGhost]}>
              <Feather name="sun" size={16} color="#9A958A" />
              <Text style={styles.triggerGhostText}>Light, controlled</Text>
            </View>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay />

            <Dialog.Content from={from}>
              <View style={styles.headerRow}>
                <Dialog.Header>
                  <Dialog.Title>Weekly digest</Dialog.Title>
                  <Dialog.Description>
                    Open state lives in the screen, so anything can drive it.
                  </Dialog.Description>
                </Dialog.Header>
                <Dialog.Close />
              </View>

              <Dialog.Footer>
                <Pressable
                  onPress={() => setControlled(false)}
                  style={[styles.btn, styles.deleteBtn]}
                >
                  <Text style={styles.deleteText}>Got it</Text>
                </Pressable>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  row: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 12,
    height: 30,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#171716",
  },
  chipActive: {
    backgroundColor: "#2B2A25",
  },
  chipText: {
    color: "rgba(154,149,138,0.72)",
    fontSize: 13,
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#F6F3EC",
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#2B2A25",
  },
  triggerGhost: {
    backgroundColor: "transparent",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(246,243,236,0.14)",
  },
  triggerText: {
    color: "#F6F3EC",
    fontSize: 14,
    fontWeight: "600",
  },
  triggerGhostText: {
    color: "#9A958A",
    fontSize: 14,
    fontWeight: "600",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    height: 38,
    borderRadius: 12,
  },
  cancelBtn: {
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  cancelText: {
    color: "#D4D4D8",
    fontSize: 14,
    fontWeight: "600",
  },
  deleteBtn: {
    backgroundColor: "#DC2626",
  },
  deleteText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
