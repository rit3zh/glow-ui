import { Text, View } from "react-native";
import * as React from "react";

interface TrailingIconProps {
  children: React.ReactNode;
}

export const TrailingIcon: React.FC<TrailingIconProps> &
  React.FunctionComponent<TrailingIconProps> = ({
  children,
}): React.ReactNode & React.JSX.Element => {
  return <View className="items-center justfy-center">{children}</View>;
};
