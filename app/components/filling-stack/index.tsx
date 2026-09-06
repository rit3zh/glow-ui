import { Image, StyleSheet, Dimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { FlingStack } from "@/components/molecules/filling-stack";
import { Showcase } from "~/showcase";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface Card {
  id: string;
  uri: string;
}

export default function App() {
  const cards: Card[] = [
    {
      id: "1",
      uri: "https://i.pinimg.com/1200x/5c/0d/2b/5c0d2b12da48712fc37b2a4f9dd949ce.jpg",
    },
    {
      id: "2",
      uri: "https://i.pinimg.com/1200x/9b/2b/b5/9b2bb5eb2ff945a846eb308571c16700.jpg",
    },
    {
      id: "3",
      uri: "https://i.pinimg.com/736x/c4/88/0b/c4880b0abfe3b5ea5628198041937048.jpg",
    },
    {
      id: "4",
      uri: "https://i.pinimg.com/736x/97/8a/47/978a47e58fe67e9bf6271228f4836050.jpg",
    },
  ];

  return (
    <Showcase>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar style="light" />

        <FlingStack
          data={cards}
          visibleCount={4}
          cardWidth={SCREEN_WIDTH - 48}
          cardHeight={480}
          useBlur={true}
          blurIntensity={25}
          tint="dark"
          renderItem={({ item }) => (
            <Image source={{ uri: item.uri }} style={styles.card} />
          )}
        />
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
  card: {
    flex: 1,
    width: "100%",
    borderRadius: 24,
  },
});
