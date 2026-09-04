import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { GooeySearchTabs } from "@/components";
import { Showcase } from "~/showcase";

const _TRIGGER_ICON_SIZE: number = 20;
const _ICON_SIZE: number = _TRIGGER_ICON_SIZE * 0.7_5;

export default function GooeySearchTabsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <Showcase>
      <View
        style={[
          styles.stage,
          {
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          },
        ]}
      >
        <GooeySearchTabs
          intensity={0.2}
          springConfig={{ damping: 12, stiffness: 150, mass: 0.5 }}
          colorScheme={{
            bg: "#1e1e1e",
            fg: "#f5f5f7",
            muted: "#8a8a90",
            indicator: "rgba(255,255,255,0.10)",
          }}
        >
          <GooeySearchTabs.Trigger>
            <Feather
              name="search"
              size={_TRIGGER_ICON_SIZE}
              color={"#f5f5f7"}
            />
          </GooeySearchTabs.Trigger>

          <GooeySearchTabs.Tabs>
            <GooeySearchTabs.Tab value="docs">
              <GooeySearchTabs.TabIcon>
                <Feather name="file-text" size={_ICON_SIZE} color="#f5f5f7" />
              </GooeySearchTabs.TabIcon>
              <GooeySearchTabs.TabLabel>Docs</GooeySearchTabs.TabLabel>
            </GooeySearchTabs.Tab>

            <GooeySearchTabs.Tab value="media">
              <GooeySearchTabs.TabIcon>
                <Feather name="image" size={_ICON_SIZE} color="#f5f5f7" />
              </GooeySearchTabs.TabIcon>
              <GooeySearchTabs.TabLabel>Media</GooeySearchTabs.TabLabel>
            </GooeySearchTabs.Tab>
          </GooeySearchTabs.Tabs>
        </GooeySearchTabs>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignItems: "center",
    justifyContent: "center",
  },
});
