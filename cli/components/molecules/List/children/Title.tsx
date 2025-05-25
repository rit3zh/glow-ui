import { Text, View } from "react-native";
import * as React from "react";

interface TitleProps {
  children: React.ReactNode;
  destructive?: boolean;
}

export const Title: React.FC<TitleProps> &
  React.FunctionComponent<TitleProps> = ({
  children,
  destructive,
}): React.ReactNode & React.JSX.Element => {
  return (
    <Text
      className={
        destructive
          ? "text-red-500 font-medium text-lg"
          : "text-white font-medium text-lg"
      }
    >
      {children}
    </Text>
  );
};
