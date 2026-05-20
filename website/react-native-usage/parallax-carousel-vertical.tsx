import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import {
  ParallaxCarousel,
  ParallaxCarouselItemProps,
  ParallaxCarouselItem,
} from "@/components/molecules/parallax-carousel/index";
const { width, height } = Dimensions.get("window");

interface MyCarouselItem extends ParallaxCarouselItem {
  id: string;
  title: string;
}

const data: MyCarouselItem[] = [
  {
    id: "1",
    image: {
      uri: "https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=800&q=80",
    },
    title: "Mountain Vista",
  },
  {
    id: "2",
    image: {
      uri: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
    },
    title: "Ocean Waves",
  },
  {
    id: "3",
    image: {
      uri: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&q=80",
    },
    title: "City Lights",
  },
];

const App = () => {
  return (
    <View style={styles.container}>
      <ParallaxCarousel
        data={data}
        keyExtractor={(item) => item.id}
        itemWidth={width}
        itemHeight={height * 0.7}
        spacing={20}
        parallaxIntensity={0.7}
        renderItem={({ item }) => (
          <View style={styles.overlay}>
            <Text style={styles.title}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  overlay: {
    position: "absolute",
    bottom: 30,
    left: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
});
