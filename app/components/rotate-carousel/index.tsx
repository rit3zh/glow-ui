import { View, StyleSheet, Image, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { RotateCarousel } from "@/components/molecules/rotate-carousel";
import { Showcase } from "~/showcase";

export default function App() {
  const POSTERS: string[] = [
    "https://i.pinimg.com/1200x/5a/ad/c6/5aadc6ef06807b24de9d0ea236c28978.jpg",
    "https://i.pinimg.com/736x/ea/9f/97/ea9f9778de29809187e40b6b12f3ca28.jpg",
    "https://i.pinimg.com/736x/c7/ad/93/c7ad937da5f3796492a4ce378db61700.jpg",
    "https://i.pinimg.com/736x/d8/af/cc/d8afcc936c977bab53cec723a2f2fc1c.jpg",
  ];

  return (
    <Showcase>
      <View style={styles.container}>
        <StatusBar style="light" />

        <RotateCarousel
          data={POSTERS.map((uri) => ({ image: { uri } }))}
          renderItem={({ item }) => (
            <Image source={item.image} style={styles.posterImage} />
          )}
          rotatePercentage={150}
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
    paddingHorizontal: 25,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.5)",
    marginTop: 2,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  posterImage: {
    width: 250,
    height: 390,
    borderRadius: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
  },
});
