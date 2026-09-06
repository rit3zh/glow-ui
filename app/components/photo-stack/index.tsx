import React from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import { PhotoStack } from "@/components/pieces/photo-stack";
import { Showcase } from "~/showcase";

const PHOTOS = [
  {
    uri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
    caption: "Shoreline",
  },
  {
    uri: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop",
    caption: "Pine trail",
  },
  {
    uri: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800&auto=format&fit=crop",
    caption: "Low fog",
  },
];

export default function App() {
  return (
    <Showcase>
      <View style={styles.container}>
        <StatusBar style="light" />

        <PhotoStack size={196} lift={14} offsets={[-56, 0, 56]}>
          {PHOTOS.map(({ uri, caption }) => (
            <PhotoStack.Item key={caption} onPress={() => {}}>
              <PhotoStack.Photo source={{ uri }} alt={caption} />
              <PhotoStack.Caption>{caption}</PhotoStack.Caption>
            </PhotoStack.Item>
          ))}
        </PhotoStack>
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
