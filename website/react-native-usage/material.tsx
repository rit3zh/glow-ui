import CircularList from "@/components/molecules/circular-list";
import MaterialCarousel from "@/components/molecules/material-carousel";
import VerticalWheel from "@/components/molecules/vertical-wheel";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

// Sample image URLs - replace with your own images
const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
];

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <MaterialCarousel
        data={SAMPLE_IMAGES}
        renderItem={(item, index) => (
          <>
            <Text
              style={{
                color: "#fff",
                fontSize: 24,
                fontWeight: "bold",
                textAlign: "center",
                marginTop: 10,
              }}
            >
              Item {index + 1}
            </Text>
          </>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#0a0e27",
    justifyContent: "center",
    alignItems: "center",
  },
});
