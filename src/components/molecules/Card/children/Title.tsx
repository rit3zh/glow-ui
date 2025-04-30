import { View, Text, StyleSheet, StyleProp, TextStyle } from "react-native";
import React from "react";

interface TitleProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export const Title: React.FunctionComponent<TitleProps> = ({
  children,
  style,
}): React.ReactNode => {
  return (
    <Text
      className={"font-bold text-gray-100 text-2xl"}
      numberOfLines={2}
      style={style}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "#fff",
    height: 80,
  },
});
