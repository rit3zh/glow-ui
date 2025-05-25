import { Text } from "react-native";
import * as React from "react";

interface SubTitleProps {
  children: React.ReactNode;
}

export const SubTitle: React.FC<SubTitleProps> &
  React.FunctionComponent<SubTitleProps> = ({
  children,
}): React.ReactNode & React.JSX.Element => {
  return <Text className="text-gray-300 text-sm">{children as string}</Text>;
};
