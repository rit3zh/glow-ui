import React, { useState } from "react";
import { View, SafeAreaView, StyleSheet, Image } from "react-native";
import { BACKGROUND_COLOR } from "../../app.config";
import { ShimmerEffect } from "@/components/molecules/Shimmer/Shimmer";

export const Home: React.FC = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  return (
    <SafeAreaView style={styles.container}>
      <ShimmerEffect
        isLoading={isLoading}
        shimmerAngle={25}
        shimmerDuration={2000}
        shimmerWidth={0.5}
        blurTint="dark"
        blurIntensity={100}
      >
        <Image
          onLoadEnd={() =>
            setInterval(() => {
              setIsLoading(false);
            }, 4000)
          }
          source={{
            uri: "https://www.pixelstalk.net/wp-content/uploads/images6/Aesthetic-Dark-Wallpaper-HD-Lonely.jpg",
          }}
          style={{ width: 500, height: 200 }}
        />
      </ShimmerEffect>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
});
