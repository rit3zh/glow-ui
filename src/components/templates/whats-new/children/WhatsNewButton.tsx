import { View, Text, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { WhatsNewButtonProps } from "../WhatsNew.type";

const { width, height } = Dimensions.get("window");

export const WhatsNewButton: React.FC<WhatsNewButtonProps> = ({
  children,
  tint = "#1084fc",
}: WhatsNewButtonProps): React.ReactNode => {
  return (
    <View style={style.coreContainer}>
      <View
        style={[
          style.container,
          {
            backgroundColor: tint,
          },
        ]}
      >
        <Text style={style.text}>{children}</Text>
      </View>
    </View>
  );
};
const style = StyleSheet.create({
  coreContainer: {
    flex: 1,
    height: height * 0.4,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    height: 58,
    width: width * 0.9,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
