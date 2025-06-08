import { View, Text, StyleSheet } from "react-native";
import React from "react";
import type { ActionCardSubtitleTypes } from "../ActionCard.types";

export const ActionCardSubtitle: React.FC<ActionCardSubtitleTypes> &
  React.FunctionComponent<ActionCardSubtitleTypes> = ({
  children,
  className,
  style,
}): React.ReactNode => {
  return (
    <View className="mt-1">
      <Text
        className={`${className} text-[#737373] text-[12.9px] text-center`}
        style={style}
      >
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({});
