import { StatusBar } from "expo-status-bar";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { AnimatedChip } from "@/components";
import { Showcase } from "~/showcase";

const FILTERS: {
  value: string;
  label: string;
  icon: SymbolViewProps["name"];
  color: string;
  tint: string;
}[] = [
  {
    value: "all",
    label: "All",
    icon: "square.grid.2x2.fill",
    color: "#ffffff",
    tint: "#000000",
  },
  {
    value: "music",
    label: "Music",
    icon: "music.note",
    color: "#ff375f",
    tint: "#ffffff",
  },
  {
    value: "videos",
    label: "Videos",
    icon: "play.fill",
    color: "#5e5ce6",
    tint: "#ffffff",
  },
];

export default function App() {
  const [filter, setFilter] = useState<string | number>("all");

  return (
    <Showcase>
      <View style={styles.container}>
        <StatusBar style="light" />

        <AnimatedChip.Group value={filter} onValueChange={setFilter}>
          {FILTERS.map(({ value, label, icon, color, tint }) => (
            <AnimatedChip.Item key={value} value={value} activeColor={color}>
              <AnimatedChip.Icon>
                {({ selected }) => (
                  <SymbolView
                    name={icon}
                    size={18}
                    tintColor={selected ? tint : "#5c5c60"}
                    resizeMode="scaleAspectFit"
                  />
                )}
              </AnimatedChip.Icon>
              <AnimatedChip.Label color={tint}>{label}</AnimatedChip.Label>
            </AnimatedChip.Item>
          ))}
        </AnimatedChip.Group>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0a0a0a",
  },
});
