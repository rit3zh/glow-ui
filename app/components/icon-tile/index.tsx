import { IconTile } from "@/components";
import {
  LayersIcon,
  Notification03Icon,
  AiBrowserIcon,
  Sparkle,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Showcase } from "~/showcase";

const _size: number = 45;
const _cornerRadius: number = 16;
export default function IconTileScreen() {
  return (
    <Showcase>
      <View style={styles.container}>
        <View style={styles.row}>
          <IconTile.Root size={_size} cornerRadius={_cornerRadius}>
            <IconTile.Icon>
              <HugeiconsIcon icon={Notification03Icon} color="#fff" />
            </IconTile.Icon>
          </IconTile.Root>

          <IconTile.Root size={_size} tone="gray" cornerRadius={_cornerRadius}>
            <IconTile.Icon>
              <HugeiconsIcon icon={LayersIcon} color="#fff" />
            </IconTile.Icon>
          </IconTile.Root>

          <IconTile.Root size={_size} tone="red" cornerRadius={_cornerRadius}>
            <IconTile.Icon>
              <HugeiconsIcon icon={AiBrowserIcon} color="#fff" />
            </IconTile.Icon>
          </IconTile.Root>

          <IconTile.Root
            size={_size}
            tone="orange"
            cornerRadius={_cornerRadius}
          >
            <IconTile.Icon>
              <HugeiconsIcon icon={Sparkle} color="#fff" />
            </IconTile.Icon>
          </IconTile.Root>
        </View>
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  content: { padding: 16, gap: 16 },
  title: { color: "#fff", fontSize: 22, fontWeight: "600" },
  demo: { gap: 12 },
});
