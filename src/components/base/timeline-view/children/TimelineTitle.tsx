import { View, Text } from "react-native";
import React from "react";
import type { TimelineTitleProps } from "../TimelineView.types";

export const TimelineTitle: React.FC<TimelineTitleProps> = ({
  children,
}): React.ReactNode & React.JSX.Element => {
  return (
    <View>
      <Text className="text-white font-bold text-3xl">{children}</Text>
    </View>
  );
};
