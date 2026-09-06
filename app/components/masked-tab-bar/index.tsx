import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaskedTabBar } from "@/components";
import { Showcase } from "~/showcase";

const TABS = [
  { value: "home", label: "Home", icon: "home" },
  { value: "search", label: "Search", icon: "search" },
  { value: "profile", label: "Profile", icon: "person" },
] as const;

export default function MaskedTabBarScreen() {
  const [tab, setTab] = useState<string>("search");

  return (
    <Showcase>
      <View style={styles.center}>
        <MaskedTabBar
          value={tab}
          onValueChange={setTab}
          radius={99}
          style={styles.bar}
          palette={{
            pill: "#f2f2f2",
            active: "#000000",
            inactive: "#7d7d7d",
          }}
        >
          <MaskedTabBar.List>
            {TABS.map(({ value, label, icon }) => (
              <MaskedTabBar.Trigger key={value} value={value}>
                <MaskedTabBar.Icon>
                  {/* `active` is true in the copy the pill reveals, so each
                      icon fills in as the pill slides over it. Outline and
                      filled Ionicons share a box, so the two layers stay
                      aligned. */}
                  {({ color, size, active }) => (
                    <Ionicons
                      name={active ? icon : `${icon}-outline`}
                      size={size}
                      color={color}
                    />
                  )}
                </MaskedTabBar.Icon>
                <MaskedTabBar.Label>{label}</MaskedTabBar.Label>
              </MaskedTabBar.Trigger>
            ))}
          </MaskedTabBar.List>
        </MaskedTabBar>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  bar: {
    backgroundColor: "#171717",
  },
});
