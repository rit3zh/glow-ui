import { StyleProp, Text, TextStyle } from "react-native";
import * as React from "react";

interface SubTitleProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export const SubTitle: React.FC<SubTitleProps> &
  React.FunctionComponent<SubTitleProps> = ({
  children,
  style = {},
}): React.ReactNode & React.JSX.Element => {
  return (
    <Text
      className="text-gray-300 text-sm"
      style={[style as StyleProp<TextStyle>]}
    >
      {children as string}
    </Text>
  );
};
