import { View, StyleSheet, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { TiltCarousel } from "@/components/molecules/tilt-carousel";
import { Showcase } from "~/showcase";

interface Assets {
  id: string;
  image: string;
}

export default function App() {
  const assets: Assets[] = [
    {
      id: "1",
      image:
        "https://i.pinimg.com/736x/91/a0/a4/91a0a4756be808262204296419e4635f.jpg",
    },
    {
      id: "2",
      image:
        "https://i.pinimg.com/736x/6d/f2/9f/6df29f242774e30c3dd095d172660c27.jpg",
    },
    {
      id: "3",
      image:
        "https://i.pinimg.com/736x/88/f7/37/88f73757cd9b00c5999c375ac78a8bfb.jpg",
    },
    {
      id: "4",
      image:
        "https://i.pinimg.com/736x/1c/4c/bd/1c4cbd48124d6bc46694acbe4b9e23cd.jpg",
    },
  ];

  return (
    <Showcase>
      <View style={styles.container}>
        <StatusBar style="light" />

        <View style={styles.carouselContainer}>
          <TiltCarousel
            data={assets}
            itemWidth={350}
            itemHeight={500}
            marginHorizontal={20}
            rotationAngle={30}
            translateYValue={55}
            useBlur={true}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  carouselContainer: {
    marginTop: 0,
  },
  card: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1a1a1a",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
