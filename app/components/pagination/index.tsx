import { View, StyleSheet, Dimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";

import { Pagination } from "@/components";
import { Showcase } from "~/showcase";

export default function App() {
  return (
    <Showcase>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar style="inverted" />

        <Pagination
          activeIndex={0}
          dotSize={8}
          inactiveColor="#3f3f46"
          activeColor="#f4f4f5"
          currentColor="#f4f4f5"
          borderRadius={4}
          dotContainer={4}
          containerStyle={{
            backgroundColor: "#171717",
            padding: 12,
            borderRadius: 12,
          }}
          totalItems={4}
        />
      </GestureHandlerRootView>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0a0a",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
