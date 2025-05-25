import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { DialogDescriptionProps } from "../Dialog.types";

export const DialogDescription: React.FC<DialogDescriptionProps> = ({
  children,
  style,
}: DialogDescriptionProps): React.ReactNode & React.JSX.Element => {
  return (
    <View>
      <Text style={[styles.description, style]} numberOfLines={2}>
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  description: {
    fontSize: 16,
    color: "#babababa",
    marginBottom: 16,
    bottom: 2.5,
  },
});
