import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import { Polaroid } from "@/components/pieces/polaroid";
import { Showcase } from "~/showcase";

const PHOTO = {
  uri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
};

export default function App() {
  return (
    <Showcase>
      <View style={styles.container}>
        <StatusBar style="light" />

        <Polaroid width={272} tilt={-3} onPress={() => {}}>
          <Polaroid.Tape width={104} height={26} tilt={-4} />
          <Polaroid.Photo
            source={PHOTO}
            alt="An empty shoreline at golden hour"
            aspectRatio={1}
          />
          <Polaroid.Footer>
            <Polaroid.Caption>Low tide, no one around</Polaroid.Caption>
            <Polaroid.Meta>Aug 2026</Polaroid.Meta>
          </Polaroid.Footer>
        </Polaroid>
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
});
