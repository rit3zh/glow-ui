import React from "react";
import { StyleSheet, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { MorphFab, MorphFabDirection } from "@/components";
import { Showcase } from "~/showcase";

export default function MorphFabScreen() {
  return (
    <Showcase>
      <View style={styles.center}>
        <View style={styles.container}>
          <MorphFab.Root gooStrength={12} direction="up" spacing={20}>
            <MorphFab.Trigger size={62}>
              <Ionicons name="add" size={25} color="#171412" />
            </MorphFab.Trigger>

            <MorphFab.Item value="note" onSelect={() => {}}>
              <MorphFab.ItemIcon>
                <Feather name="edit-3" size={18} color="#171412" />
              </MorphFab.ItemIcon>
            </MorphFab.Item>

            <MorphFab.Item value="photo" onSelect={() => {}}>
              <MorphFab.ItemIcon>
                <Feather name="image" size={18} color="#171412" />
              </MorphFab.ItemIcon>
            </MorphFab.Item>

            <MorphFab.Item value="reminder" onSelect={() => {}}>
              <MorphFab.ItemIcon>
                <Feather name="bell" size={18} color="#171412" />
              </MorphFab.ItemIcon>
            </MorphFab.Item>
          </MorphFab.Root>
        </View>
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
  container: {},
});
