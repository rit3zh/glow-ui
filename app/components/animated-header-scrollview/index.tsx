import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AnimatedHeaderScrollView } from "@/components/organisms/animated-header-scrollview";

const ROWS = [1, 2, 3, 4];
const TILES = [1, 2, 3, 4];

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.root}>
        <StatusBar style="light" />

        <AnimatedHeaderScrollView
          largeTitle="Overview"
          largeHeaderTitleStyle={styles.largeTitle}
          largeHeaderSubtitleStyle={styles.largeSubtitle}
          smallHeaderTitleStyle={styles.smallTitle}
        >
          <View style={styles.hero} />

          <View style={styles.row}>
            <View style={[styles.tile, styles.fill]} />
            <View style={[styles.tile, styles.fill]} />
          </View>

          <View style={styles.section}>
            {ROWS.map((row) => (
              <View key={row} style={styles.listRow}>
                <View style={styles.dot} />
                <View style={styles.fill}>
                  <View style={[styles.bar, styles.barWide]} />
                  <View style={[styles.bar, styles.barNarrow]} />
                </View>
              </View>
            ))}
          </View>

          <View style={styles.grid}>
            {TILES.map((tile) => (
              <View key={tile} style={styles.gridTile} />
            ))}
          </View>

          <View style={styles.block} />
        </AnimatedHeaderScrollView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const SURFACE = "#131315";
const SURFACE_SOFT = "#1D1D20";
const GAP = 12;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
  },
  fill: {
    flex: 1,
  },
  largeTitle: {
    fontSize: 40,
    fontWeight: "700",
    letterSpacing: -0.8,
  },
  largeSubtitle: {
    fontSize: 14,
  },
  smallTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  hero: {
    height: 300,
    borderRadius: 24,
    backgroundColor: SURFACE,
    marginBottom: GAP,
  },
  row: {
    flexDirection: "row",
    gap: GAP,
    marginBottom: GAP,
  },
  tile: {
    height: 110,
    borderRadius: 20,
    backgroundColor: SURFACE,
  },
  section: {
    borderRadius: 24,
    backgroundColor: SURFACE,
    paddingVertical: 6,
    marginBottom: GAP,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  dot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: SURFACE_SOFT,
  },
  bar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: SURFACE_SOFT,
  },
  barWide: {
    width: "62%",
  },
  barNarrow: {
    width: "34%",
    marginTop: 8,
    opacity: 0.6,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GAP,
    marginBottom: GAP,
  },
  gridTile: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 20,
    backgroundColor: SURFACE,
  },
  block: {
    height: 260,
    borderRadius: 24,
    backgroundColor: SURFACE,
  },
});
