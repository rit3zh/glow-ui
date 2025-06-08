import { View, Text } from "react-native";
import React from "react";
import type { CenterTypes } from "./Center.types";

export const Center: React.FC<CenterTypes> = ({
  children,
  ...props
}): React.ReactNode & React.JSX.Element => {
  return (
    <View
      {...props}
      className={"items-center justify-center" + props.className}
    >
      {children}
    </View>
  );
};
