import { View, StyleSheet, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { ParallaxCarousel } from "@/components/molecules/parallax-carousel";
import { Showcase } from "~/showcase";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const _width = SCREEN_WIDTH - 50;
const _height = SCREEN_HEIGHT * 0.4;

export default function App() {
  const ITEMS: string[] = [
    "https://i.pinimg.com/1200x/26/11/c9/2611c911b2ea6973ccef470af453a9ea.jpg",
    "https://i.pinimg.com/736x/93/ff/e1/93ffe1c47dc5c08dc272da66982dba3a.jpg",
    "https://i.pinimg.com/736x/b5/52/c0/b552c0c8ca264d52ee3345725415d616.jpg",
    "https://i.pinimg.com/1200x/ef/f8/d1/eff8d19dcb81015b44ee7caa09583926.jpg",
  ];

  return (
    <Showcase>
      <View style={styles.container}>
        <StatusBar style="inverted" />

        <ParallaxCarousel
          data={ITEMS.map((v) => ({ image: { uri: v } }))}
          renderItem={() => <></>}
          itemHeight={_height}
          itemWidth={_width}
          parallaxIntensity={1}
        />
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
});
