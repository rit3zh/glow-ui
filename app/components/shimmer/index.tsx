import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { ShimmerGroup, Shimmer } from "@/components";
import { useState } from "react";
import { Showcase } from "~/showcase";
import type { ShimmerPreset } from "@/components/molecules/Shimmer/Shimmer.types";

const PRESETS: ShimmerPreset[] = ["dark", "light", "twitter", "neutral"];

const CUSTOM_COLORS = [
  "rgba(88, 28, 135, 1)",
  "rgba(147, 51, 234, 1)",
  "rgba(232, 121, 249, 1)",
  "rgba(147, 51, 234, 1)",
  "rgba(88, 28, 135, 1)",
];

export default function App(_$_: Record<string, unknown>) {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
  });

  const [preset, setPreset] = useState<ShimmerPreset>("dark");
  const display = fontLoaded ? "HelveticaNowDisplay" : undefined;
  const text = fontLoaded ? "SfProRounded" : undefined;

  return (
    <Showcase>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar style="light" />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.title, { fontFamily: display }]}>Shimmer</Text>
          <Text style={[styles.subtitle, { fontFamily: text }]}>
            Placeholder skeletons while content loads.
          </Text>

          <View style={styles.presetRow}>
            {PRESETS.map((item) => {
              const active = item === preset;
              return (
                <Pressable
                  key={item}
                  onPress={() => setPreset(item)}
                  style={[styles.presetChip, active && styles.presetChipActive]}
                >
                  <Text
                    style={[
                      styles.presetLabel,
                      active && styles.presetLabelActive,
                      { fontFamily: text },
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.sectionLabel, { fontFamily: text }]}>Card</Text>
          <View style={styles.card}>
            <ShimmerGroup
              preset={preset}
              duration={1200}
              opacity={0.7}
              variant="shimmer"
            >
              <Shimmer style={styles.cover} />
              <View style={styles.cardBody}>
                <Shimmer style={styles.lineLg} />
                <Shimmer style={styles.lineMd} />
                <Shimmer style={styles.lineSm} />
              </View>
            </ShimmerGroup>
          </View>

          <Text style={[styles.sectionLabel, { fontFamily: text }]}>List</Text>
          <View style={styles.card}>
            <ShimmerGroup preset={preset} duration={1200}>
              {[0, 1, 2].map((row) => (
                <View key={row} style={styles.listRow}>
                  <Shimmer style={styles.avatar} />
                  <View style={styles.listRowText}>
                    <Shimmer style={styles.lineMd} />
                    <Shimmer style={styles.lineSm} />
                  </View>
                  <Shimmer style={styles.trailing} />
                </View>
              ))}
            </ShimmerGroup>
          </View>

          <Text style={[styles.sectionLabel, { fontFamily: text }]}>
            Variants
          </Text>
          <View style={styles.card}>
            <View style={styles.variantRow}>
              <View style={styles.variantCell}>
                <Shimmer
                  preset={preset}
                  variant="shimmer"
                  duration={1200}
                  style={styles.tile}
                />
                <Text style={[styles.caption, { fontFamily: text }]}>
                  shimmer
                </Text>
              </View>
              <View style={styles.variantCell}>
                <Shimmer
                  preset={preset}
                  variant="pulse"
                  duration={1200}
                  style={styles.tile}
                />
                <Text style={[styles.caption, { fontFamily: text }]}>
                  pulse
                </Text>
              </View>
            </View>
          </View>

          <Text style={[styles.sectionLabel, { fontFamily: text }]}>
            Custom colors
          </Text>
          <View style={styles.card}>
            <ShimmerGroup
              preset="custom"
              shimmerColors={CUSTOM_COLORS}
              duration={1400}
            >
              <Shimmer style={styles.customTile} />
              <Shimmer style={styles.customLineLg} />
              <Shimmer style={styles.customLineMd} />
            </ShimmerGroup>
          </View>

          <Text style={[styles.sectionLabel, { fontFamily: text }]}>
            Directions
          </Text>
          <View style={styles.card}>
            <ShimmerGroup preset={preset} duration={1200}>
              <Shimmer direction="leftToRight" style={styles.bar} />
              <Shimmer direction="rightToLeft" style={styles.bar} />
              <Shimmer direction="topToBottom" style={styles.bar} />
              <Shimmer direction="bottomToTop" style={styles.bar} />
            </ShimmerGroup>
          </View>
        </ScrollView>
      </GestureHandlerRootView>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 64,
  },
  title: {
    fontSize: 30,
    fontWeight: "600",
    color: "#fff",
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
    marginTop: 6,
  },
  presetRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 20,
  },
  presetChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  presetChipActive: {
    backgroundColor: "#fff",
  },
  presetLabel: {
    fontSize: 13,
    color: "#999",
  },
  presetLabelActive: {
    color: "#000",
  },
  sectionLabel: {
    fontSize: 12,
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 32,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#141414",
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  cover: {
    width: "100%",
    height: 140,
    borderRadius: 14,
  },
  cardBody: {
    gap: 10,
  },
  lineLg: {
    width: "80%",
    height: 18,
    borderRadius: 6,
  },
  lineMd: {
    width: "60%",
    height: 13,
    borderRadius: 5,
  },
  lineSm: {
    width: "40%",
    height: 13,
    borderRadius: 5,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  listRowText: {
    flex: 1,
    gap: 8,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  trailing: {
    width: 26,
    height: 26,
    borderRadius: 8,
  },
  variantRow: {
    flexDirection: "row",
    gap: 12,
  },
  variantCell: {
    flex: 1,
    gap: 8,
    alignItems: "center",
  },
  tile: {
    width: "100%",
    height: 72,
    borderRadius: 14,
  },
  caption: {
    fontSize: 11,
    color: "#666",
  },
  bar: {
    width: "100%",
    height: 34,
    borderRadius: 10,
  },
  customTile: {
    width: "100%",
    height: 72,
    borderRadius: 14,
    backgroundColor: "rgba(88, 28, 135, 1)",
  },
  customLineLg: {
    width: "80%",
    height: 18,
    borderRadius: 6,
    backgroundColor: "rgba(88, 28, 135, 1)",
  },
  customLineMd: {
    width: "60%",
    height: 13,
    borderRadius: 5,
    backgroundColor: "rgba(88, 28, 135, 1)",
  },
});
