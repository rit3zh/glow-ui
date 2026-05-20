import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import VerticalFlowCarousel from "@/components/molecules/vertical-flow-carousel";

const { width } = Dimensions.get("window");

const DATA = [
  {
    id: "1",
    title: "Mountain Peak",
    location: "Switzerland",
    image: "https://picsum.photos/id/29/800/600",
  },
  {
    id: "2",
    title: "Ocean Waves",
    location: "Maldives",
    image: "https://picsum.photos/id/28/800/600",
  },
  {
    id: "3",
    title: "Forest Trail",
    location: "Canada",
    image: "https://picsum.photos/id/15/800/600",
  },
  {
    id: "4",
    title: "Desert Dunes",
    location: "Morocco",
    image: "https://picsum.photos/id/33/800/600",
  },
];

export default function App() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" />

      <VerticalFlowCarousel
        data={DATA}
        itemHeight={210}
        rotationAngle={12}
        opacityInactive={0.5}
        scaleInactive={0.8}
        showBlur
        snapEnabled
        blurIntensity={20}
        contentContainerStyle={styles.carousel}
        renderItem={(item) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.overlay}>
              <Text
                style={[
                  styles.title,
                  fontLoaded && { fontFamily: "HelveticaNowDisplay" },
                ]}
              >
                {item.title}
              </Text>
              <Text
                style={[
                  styles.location,
                  fontLoaded && { fontFamily: "SfProRounded" },
                ]}
              >
                {item.location}
              </Text>
            </View>
          </View>
        )}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  carousel: {
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    width: width - 40,
    height: 280,
    borderRadius: 20,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  title: {
    fontSize: 22,
    color: "#fff",
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
  },
});
