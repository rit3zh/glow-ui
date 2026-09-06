import { View, StyleSheet, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { ScaleCarousel } from "@/components/molecules/scale-carousel";
import { Showcase } from "~/showcase";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function App() {
  const ASSETS = [
    {
      image: {
        uri: "https://i.pinimg.com/1200x/93/c8/19/93c8191d97b73362caec53271c154a9c.jpg",
      },
    },
    {
      image: {
        uri: "https://i.pinimg.com/736x/89/43/67/8943673d96e94174bb633b937950af07.jpg",
      },
    },
    {
      image: {
        uri: "https://i.pinimg.com/736x/7a/1e/57/7a1e577da3a8a95c133bfb13f45e300f.jpg",
      },
    },
    {
      image: {
        uri: "https://i.pinimg.com/736x/e3/86/6d/e3866d518ea6f579fe5bbe84dccfb162.jpg",
      },
    },
  ];

  return (
    <Showcase>
      <View style={styles.container}>
        <StatusBar style="light" />

        <ScaleCarousel
          data={ASSETS}
          itemWidth={SCREEN_WIDTH}
          itemHeight={SCREEN_HEIGHT * 0.6}
          scaleRange={[1.8, 1, 1.8]}
          rotationRange={[20, 0, -20]}
          pagingEnabled
          renderItem={() => <></>}
        />
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
  },
});
