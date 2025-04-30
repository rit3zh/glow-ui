import { Text, View } from "react-native";
import * as React from "react";

interface TitleViewProps {
  children: React.ReactNode;
}

export const Title: React.FC<TitleViewProps> &
  React.FunctionComponent<TitleViewProps> = ({
  children,
}): React.ReactNode & React.JSX.Element => {
  return <View className="flex-1 justify-center ml-4">{children}</View>;
};
