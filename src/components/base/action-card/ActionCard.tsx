import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { ActionCardTypes } from "./ActionCard.types";

export const ActionCard: React.FunctionComponent<ActionCardTypes> &
  React.FC<ActionCardTypes> = ({
  title,
  tint,
  icon,
  width = 190,
  height = 100,
}): React.ReactNode & React.JSX.Element => {
  return (
    <View
      className="ml-0"
      style={[
        styles.container,
        {
          width: width,
          height: height,
        },
      ]}
    >
      {icon && icon()}
      <View className="mt-1">
        <Text
          numberOfLines={2}
          className="max-w-96 text-center"
          style={{
            color: "white",
            fontSize: 16,
            fontWeight: "medium",
          }}
        >
          {title}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#262626",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
    width: 250,
  },
});
