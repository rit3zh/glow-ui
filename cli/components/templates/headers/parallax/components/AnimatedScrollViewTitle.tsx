import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import React from "react";
import { AnimatedScrollViewTitleProps } from "../types";

export const AnimatedScrollViewTitle: React.FC<
  AnimatedScrollViewTitleProps
> = ({ children, size }: AnimatedScrollViewTitleProps): React.ReactNode => {
  const { width } = useWindowDimensions();
  const maxWidth = 0.5 * width;

  return (
    <View
      style={{
        ...styles.container,
      }}
    >
      <Text
        numberOfLines={2}
        style={[
          styles.text,
          {
            maxWidth: maxWidth,
            fontSize: size ? size : 35,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  text: {
    color: "white",

    fontWeight: "700",

    textAlign: "left",
  },
});
