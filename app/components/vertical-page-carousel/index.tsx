import { StyleSheet, Dimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { VerticalPageCarousel } from "@/components/molecules/vertical-page-carousel";
import { Showcase } from "~/showcase";

const { height } = Dimensions.get("window");

const DATA = [
  {
    id: "1",

    image: {
      uri: "https://i.pinimg.com/736x/f7/46/8a/f7468ac89a0b558b429233a2e550bd69.jpg",
    },
  },
  {
    id: "2",

    image: {
      uri: "https://i.pinimg.com/736x/76/d4/52/76d452fd92b8568cb5348043d103ebe2.jpg",
    },
  },
  {
    id: "3",

    image: {
      uri: "https://i.pinimg.com/736x/03/d0/4d/03d04dfcce3f4ed865078b54aa9d5610.jpg",
    },
  },
  {
    id: "4",

    image: {
      uri: "https://i.pinimg.com/736x/df/33/ae/df33ae9af50600c896b8d67914c96c12.jpg",
    },
  },
];

export default function App() {
  return (
    <Showcase>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar style="light" />

        <VerticalPageCarousel
          data={DATA}
          itemHeight={height * 0.65}
          cardMargin={14}
          pagingEnabled
          cardSpacing={6}
          scaleRange={[0.88, 1, 0.88]}
          opacityRange={[0.6, 1, 0.6]}
          renderItem={(...props) => <></>}
        />
      </GestureHandlerRootView>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
  },
  info: {
    padding: 24,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  year: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 6,
  },
  name: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 4,
  },
  artist: {
    fontSize: 15,
    color: "rgba(255,255,255,0.7)",
  },
});
