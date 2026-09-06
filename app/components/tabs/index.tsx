import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { Tabs } from "@/components";
import { Showcase } from "~/showcase";

type TabIcon = React.ComponentProps<typeof Feather>["name"];

function TabItem({
  active,
  icon,
  label,
  value,
}: {
  active: string;
  icon: TabIcon;
  label: string;
  value: string;
}) {
  return (
    <Tabs.Trigger
      value={value}
      style={{
        paddingHorizontal: 12,
        height: 28,
      }}
      labelStyle={{
        fontSize: 13.7,
      }}
    >
      {label}
    </Tabs.Trigger>
  );
}

export default function TabsScreen() {
  const [segmented, setSegmented] = useState("inbox");
  return (
    <Showcase>
      <View style={styles.content}>
        <Tabs.Root value={segmented} onValueChange={setSegmented} style={{}}>
          <Tabs.List
            size="default"
            style={{
              borderRadius: 99,
            }}
          >
            <TabItem
              active={segmented}
              icon="inbox"
              label="Inbox"
              value="inbox"
            />
            <TabItem
              active={segmented}
              icon="star"
              label="Starred"
              value="starred"
            />
            <TabItem
              active={segmented}
              icon="archive"
              label="Archive"
              value="archive"
            />
          </Tabs.List>
        </Tabs.Root>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  demo: {
    gap: 12,
  },
  caption: {
    color: "#6D7480",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.2,
    textTransform: "uppercase",
  },
  body: {
    color: "#9A958A",
    fontSize: 14,
  },
  stretch: {
    alignSelf: "stretch",
  },
});
