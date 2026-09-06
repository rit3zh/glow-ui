import ElasticSlider from "@/components/micro-interactions/elastic-slider";
import React, { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Showcase } from "~/showcase";
import { Ionicons } from "@expo/vector-icons";

export default function ElasticSliderScreen() {
  const [val, setVal] = useState<number>(34);
  return (
    <Showcase>
      <View style={styles.container}>
        <ElasticSlider.Root
          defaultValue={val}
          style={{
            width: Dimensions.get("window").width - 220,
          }}
          onValueChange={setVal}
        >
          <ElasticSlider.Leading>
            <Ionicons name="volume-low" size={24} color="#fff" />
          </ElasticSlider.Leading>
          <ElasticSlider.Track>
            <ElasticSlider.Fill color="#fff" />
          </ElasticSlider.Track>
          <ElasticSlider.Trailing>
            <Ionicons name="volume-high" size={24} color="#fff" />
          </ElasticSlider.Trailing>
        </ElasticSlider.Root>
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
});
