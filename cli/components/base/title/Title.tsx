import { View, Text, StyleSheet } from "react-native";
import React from "react";
import type { TitleProps } from "./Title.types";

export const Title: React.FC<TitleProps> = ({
  children,
  size = 18,
  style,
}): React.ReactNode => {
  return (
    <View>
      <Text
        style={[
          styles.text,
          style,
          {
            fontSize: size ? size : 18,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontWeight: "bold",
    color: "#ffffff",
  },
});
