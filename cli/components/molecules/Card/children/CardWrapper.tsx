import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { CardWrapperProps } from "../Card.types";

export const CardWrapper: React.FC<CardWrapperProps> = ({
  children,
  className,
  style,
}): React.ReactNode => {
  return (
    <View className="" style={[styles.container, style]}>
      <View className="justify-cente">{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",

    padding: 15,
    marginTop: 5,
  },
});
