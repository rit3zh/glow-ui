import React from "react";
import { View, Image, Text, Pressable, StyleSheet } from "react-native";

export interface AvatarItem {
  id: string;
  uri?: string;
  name?: string;
}

interface AvatarGroupProps {
  avatars: AvatarItem[];
  size?: number;
  max?: number;
  overlap?: number;
  onPress?(id: string): void;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  size = 40,
  max = 5,
  overlap = 10,
  onPress,
}) => {
  const displayed = avatars.slice(0, max);
  const extraCount = avatars.length - max;

  return (
    <View style={styles.container}>
      {displayed.map((avatar, idx) => (
        <Pressable
          key={avatar.id}
          onPress={() => onPress?.(avatar.id)}
          style={{ marginLeft: idx === 0 ? 0 : -overlap }}
        >
          {avatar.uri ? (
            <Image
              source={{ uri: avatar.uri }}
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
                {avatar.name?.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </Pressable>
      ))}

      {extraCount > 0 && (
        <View
          style={[
            styles.extra,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              marginLeft: -overlap,
            },
          ]}
        >
          <Text style={[styles.extraText, { fontSize: size / 2 }]}>
            +{extraCount}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    borderWidth: 2,
    borderColor: "#fff",
  },
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
  extra: {
    backgroundColor: "#888",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  extraText: {
    color: "#fff",
    fontWeight: "600",
  },
});
