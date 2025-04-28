import { View, Text } from "react-native";
import React from "react";
import { RowProps } from "./Row.types";

export const Row: React.FC<RowProps> = ({
  children,
  spacing = 5,
  style,
}): React.JSX.Element & React.ReactNode => {
  return (
    <View className="flex-row" style={[{ gap: spacing }, style]}>
      {children}
    </View>
  );
};
