import React from "react";
import { StyleSheet, View, Text, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaskedView from "@react-native-masked-view/masked-view";
import BlurView from "@sbaiahmed1/react-native-blur";
import { CinematicCarousel } from "@/components/molecules/cinematic-carousel";
import { Showcase } from "~/showcase";

const SCREEN_WIDTH: number = Dimensions.get("window").width;

interface Item {
  id: string;
  title: string;
  color: string;
  image?: string;
}

const DATA: Item[] = [
  {
    id: "1",
    title: "First Item",
    color: "#FF5733",
    image: "https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg",
  },
  {
    id: "2",
    title: "Second Item",
    color: "#33FF57",
    image: "https://images.pexels.com/photos/1559825/pexels-photo-1559825.jpeg",
  },
  {
    id: "3",
    title: "Third Item",
    color: "#3357FF",
    image: "https://images.pexels.com/photos/2377432/pexels-photo-2377432.jpeg",
  },
  {
    id: "4",
    title: "Fourth Item",
    color: "#F333FF",
    image: "https://images.pexels.com/photos/753339/pexels-photo-753339.jpeg",
  },
];

const WIDTH = 300;
const HEIGHT = 200;

const App = () => {
  const renderItem: React.FC<any> = ({
    item,
    index,
  }: {
    item: Item;
    index: number;
  }): React.JSX.Element => {
    return (
      <>
        {/* @ts-ignore  */}
        <View
          style={{
            width: WIDTH,
            height: HEIGHT,

            overflow: "hidden",
          }}
        >
          <Image
            style={{
              width: "100%",
              height: "100%",
            }}
            source={{
              uri: item.image,
            }}
          />
        </View>
      </>
    );
  };

  return (
    <Showcase>
      <View style={styles.container}>
        <CinematicCarousel
          data={[...DATA]}
          renderItem={renderItem as any}
          spacing={10}
        />
      </View>
    </Showcase>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
});

export default App;
