import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { CircularCarousel } from "@/components/molecules/circular-carousel";
import { LinearGradient } from "expo-linear-gradient";
import { Showcase } from "~/showcase";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function App() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
    StretchPro: require("@/assets/fonts/StretchPro.otf"),
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const DATA = [
    {
      id: "1",
      name: "MY DEAR MELANCHOLY",
      artist: "The Weeknd",
      year: "2018",
      image:
        "https://i.pinimg.com/1200x/18/e6/e8/18e6e8e2d2b8c5b4dd77a4ae705bf96a.jpg",
    },
    {
      id: "2",
      name: "RANDOM ACCESS MEMORIES",
      artist: "Daft Punk",
      year: "2013",
      image:
        "https://i.pinimg.com/1200x/91/52/b2/9152b2dc174934279cda4509b0931434.jpg",
    },
    {
      id: "3",
      name: "CURRENTS",
      artist: "Tame Impala",
      year: "2015",
      image:
        "https://i.pinimg.com/1200x/1e/38/7f/1e387f131098067f7a9be0bc68b0b6f2.jpg",
    },
    {
      id: "4",
      name: "PLASTIC BEACH",
      artist: "Gorillaz",
      year: "2010",
      image:
        "https://i.pinimg.com/736x/43/e0/e0/43e0e0a542c0ccfbc5cf1b802bcf2d66.jpg",
    },
  ];

  return (
    <Showcase>
      <View style={styles.container}>
        <StatusBar style="inverted" />

        <CircularCarousel
          data={DATA}
          itemWidth={SCREEN_WIDTH * 0.7_5}
          spacing={1}
          onIndexChange={setCurrentIndex}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.cardImage} />
            </View>
          )}
        />
      </View>
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
    paddingHorizontal: 24,
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
    height: 300,
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
