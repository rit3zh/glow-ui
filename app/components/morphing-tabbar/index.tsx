import { View, StyleSheet, Dimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { useState } from "react";
import { MorphicTabBar } from "@/components/molecules/morphing-tabbar";
import { Showcase } from "~/showcase";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function App() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
    StretchPro: require("@/assets/fonts/StretchPro.otf"),
  });

  return (
    <Showcase>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar style="inverted" />

        <View style={styles.header}>
          <MorphicTabBar
            light={{
              tabBackground: "#ffffff",
              inactiveText: "#000000",
              activeText: "#000000",
              shadowColor: "rgba(255, 255, 255, 0.2)",
              glassBackground: "rgba(255, 255, 255, 0.1)",
            }}
          >
            <MorphicTabBar.List>
              <MorphicTabBar.Trigger value="/home">
                <MorphicTabBar.Label>Home</MorphicTabBar.Label>
              </MorphicTabBar.Trigger>
              <MorphicTabBar.Trigger value="/search">
                <MorphicTabBar.Label>Search</MorphicTabBar.Label>
              </MorphicTabBar.Trigger>
              <MorphicTabBar.Trigger value="/profile">
                <MorphicTabBar.Label>Profile</MorphicTabBar.Label>
              </MorphicTabBar.Trigger>
              <MorphicTabBar.Trigger value="/settings">
                <MorphicTabBar.Label>Settings</MorphicTabBar.Label>
              </MorphicTabBar.Trigger>
            </MorphicTabBar.List>
          </MorphicTabBar>
        </View>
      </GestureHandlerRootView>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 70,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    color: "#fff",
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 12,
    color: "#aaa",
  },
  headerRight: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "100%",
    height: 340,
    borderRadius: 24,
    overflow: "hidden",
  },
  cardImage: {
    width: 300,
    height: "100%",
    resizeMode: "cover",
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  cardContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    gap: 8,
  },
  albumName: {
    fontSize: 16,
    color: "#fff",
    letterSpacing: 1,
  },
  artistRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  artistText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  yearText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
  },
  footer: {
    paddingHorizontal: 24,
    marginTop: 32,
    gap: 20,
  },
  nowPlaying: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#141414",
    padding: 12,
    borderRadius: 16,
  },
  nowPlayingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  nowPlayingImage: {
    width: 48,
    height: 48,
    borderRadius: 10,
  },
  nowPlayingInfo: {
    flex: 1,
    gap: 2,
  },
  nowPlayingTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  nowPlayingArtist: {
    fontSize: 12,
    color: "#666",
  },
  nowPlayingControls: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  dotIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#333",
  },
  dotIndicatorActive: {
    width: 20,
    backgroundColor: "#fff",
  },
});
