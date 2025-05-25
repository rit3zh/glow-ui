import React from "react";
import { View, Image, Text, Pressable, StyleSheet } from "react-native";
import type { AvatarGroupProps } from "./Avatar.types";

export const Avatar: React.FC<AvatarGroupProps> = ({
  image,
  size = 40,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => onPress?.(image?.name!)}>
        {image.uri ? (
          <Image
            source={{ uri: image.uri }}
            style={[
              styles.avatar,
              { width: size, height: size, borderRadius: size / 2 },
            ]}
          />
        ) : (
          <View
            style={[
              styles.fallback,
              { width: size, height: size, borderRadius: size / 2 },
            ]}
          >
            <Text style={[styles.fallbackText, { fontSize: size / 2 }]}>
              {image.name?.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {},
  fallback: {
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  fallbackText: {
    color: "#fff",
    fontWeight: "600",
  },
});
