import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { DialogTitleProps } from "../Dialog.types";

export const DialogTitle: React.FC<DialogTitleProps> = ({
  children,
  style,
}: DialogTitleProps): React.ReactNode & React.JSX.Element => {
  return (
    <View>
      <Text
        className="text-white"
        style={[styles.title, style]}
        numberOfLines={2}
      >
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
