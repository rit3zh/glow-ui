import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

import { Avatar } from "@/components";
import { Showcase } from "~/showcase";
const _width = Dimensions.get("window").width;
const AVATARS = [
  {
    type: "image",
    uri: "https://i.pinimg.com/736x/80/ac/d5/80acd5ac3a51f818c0ac1f7d0a1455e5.jpg",
  },

  {
    type: "fallback",
    seed: "reacticx_1",
  },
  {
    type: "image",
    uri: "https://i.pinimg.com/1200x/2c/36/44/2c364466678be55dfacfe65c673844c1.jpg",
  },
  {
    type: "fallback",
    seed: "reacticx_2",
  },
  {
    type: "image",
    uri: "https://i.pinimg.com/736x/42/f3/1d/42f31dcc9262e01039b730054a81ee54.jpg",
  },
  {
    type: "fallback",
    seed: "reacticx_3",
  },
];
const _size: number = _width * 0.125;

export default function AvatarScreen() {
  return (
    <Showcase>
      <View style={styles.stage}>
        <View style={styles.row}>
          {AVATARS.map((v, i) => (
            <Avatar.Root key={i.toString()} size={_size}>
              {v.type === "fallback" ? (
                <Avatar.Fallback seed={v.seed} />
              ) : (
                <Avatar.Image
                  source={{
                    uri: v.uri,
                  }}
                />
              )}
            </Avatar.Root>
          ))}
        </View>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    gap: 16,
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  caption: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    lineHeight: 18,
  },
});
