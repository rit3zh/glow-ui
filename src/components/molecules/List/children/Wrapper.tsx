import { View } from "react-native";
import * as React from "react";

interface WrapperProps {
  children: React.ReactNode;
}

export const Wrapper: React.FC<WrapperProps> &
  React.FunctionComponent<WrapperProps> = ({
  children,
}): React.ReactNode & React.JSX.Element => {
  return (
    <View className="p-3">
      <View className="flex-row items-center">{children}</View>
    </View>
  );
};
