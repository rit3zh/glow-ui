import { View, Text, StyleSheet, TextStyle, StyleProp } from "react-native";
import React from "react";

interface SubTitleProps {
  children: React.ReactNode;
  className?: string;
  style?: StyleProp<TextStyle>;
}

export const SubTitle: React.FunctionComponent<SubTitleProps> = ({
  children,
  className,
  style,
}): React.ReactNode => {
  return (
    <Text
      className="font-medium text-gray-300 text-sm"
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
