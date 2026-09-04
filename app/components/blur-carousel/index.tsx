import { View, Text, StyleSheet, Image } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { SymbolView } from "expo-symbols";
import { BlurCarousel } from "@/components/molecules/blur-carousel";
import { LinearGradient } from "expo-linear-gradient";
import { Showcase } from "~/showcase";

export default function App() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    Coolvetica: require("@/assets/fonts/CoolveticaLt-Regular.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
  });

  const DATA = [
    {
      id: "1",
      image:
        "https://i.pinimg.com/736x/c9/80/43/c9804386cb3c92cac8007cc31e153fd5.jpg",
    },
    {
      id: "2",
      image:
        "https://i.pinimg.com/736x/de/3c/2e/de3c2e5530f3fec62d2b12a932837e67.jpg",
    },
    {
      id: "3",
      image:
        "https://i.pinimg.com/736x/31/21/6b/31216b6d04a85edbca8b36a0849e43e1.jpg",
    },
  ];

  return (
    <Showcase>
      <View style={styles.container}>
        <StatusBar style="light" />

        <BlurCarousel
          data={DATA}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{
                  uri: item.image,
                }}
                style={StyleSheet.absoluteFill}
              />
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
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: "700",
    color: "#fff",
  },
  card: {
    width: "100%",
    height: 390,
    borderRadius: 8,
    overflow: "hidden",
    padding: 24,
    justifyContent: "space-between",
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  cardMiddle: {
    gap: 8,
  },
  cardTitle: {
    fontSize: 44,
    fontWeight: "600",
    color: "#fff",
  },
  cardSubtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
  },
  cardDescription: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    lineHeight: 20,
    marginTop: 4,
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  statBox: {
    gap: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
  },
  statLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
  },
  arrowButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
});
