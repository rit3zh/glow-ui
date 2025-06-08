import { StyleProp, Text, TextStyle, View } from "react-native";
import * as React from "react";

interface TitleProps {
  children: React.ReactNode;
  destructive?: boolean;
  style?: StyleProp<TextStyle>;
}

export const Title: React.FC<TitleProps> &
  React.FunctionComponent<TitleProps> = ({
  children,
  destructive,
  style = {},
  ...props
}): React.ReactNode & React.JSX.Element => {
  return (
    <Text
      className={
        destructive
          ? "text-[#3a3a3a] font-medium text-lg"
          : "text-white font-medium text-lg"
      }
      style={[
        style as TextStyle,
        {
          color: destructive ? "#EF4444" : "#ffffff",
        },
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};
