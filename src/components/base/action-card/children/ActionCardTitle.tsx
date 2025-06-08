import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { ActionCardTitleTypes } from "../ActionCard.types";

export const ActionCardTitle: React.FC<ActionCardTitleTypes> &
  React.FunctionComponent<ActionCardTitleTypes> = ({
  children,
  className,
  style,
}): React.ReactNode => {
  return (
    <View className="mt-3">
      <Text
        className={`${className} text-white font-bold text-xl`}
        style={style}
      >
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({});
