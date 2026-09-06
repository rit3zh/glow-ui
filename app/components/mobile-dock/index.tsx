import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Dock } from "@/components";
import { Showcase } from "~/showcase";

interface IMobileDockItems {
  uri: string;
  label?: string;
}

const DOCK_ITEMS: IMobileDockItems[] = [
  {
    uri: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/discord-round-color-icon.png",
    label: "Discord",
  },
  {
    uri: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/claude-ai-icon.png",
    label: "Claude",
  },
  {
    uri: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/spotify-icon.png",
    label: "Spotify",
  },
  {
    uri: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/facetime-ios-icon.png",
    label: "Facetime",
  },
  {
    uri: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/codex-icon.png",
    label: "Codex",
  },
];

const _SIZE = 40;
const _PEAK_SIZE = _SIZE * 2;
const _GAP = 5;
const _SPREAD = Math.ceil(_SIZE / 20);
const _HEIGHT = Math.round(_SIZE * 1.3);

export default function MobileDockScreen() {
  return (
    <Showcase>
      <View style={styles.wrapper}>
        <Dock
          size={_SIZE}
          peakSize={_PEAK_SIZE}
          gap={_GAP}
          spread={_SPREAD}
          showTip
          style={{
            borderRadius: 1000,
          }}
          height={_HEIGHT}
        >
          <Dock.Items>
            {DOCK_ITEMS.map((item, _: number) => (
              <Dock.Item key={_.toString()}>
                <Dock.Item.Image useBackgroundColor>
                  <Image source={{ uri: item.uri }} style={styles.image} />
                </Dock.Item.Image>
                <Dock.Item.Label>{item.label}</Dock.Item.Label>
              </Dock.Item>
            ))}
          </Dock.Items>
        </Dock>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },
  image: {
    width: 35,
    height: 35,
  },
});
