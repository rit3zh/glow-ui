import { View } from "react-native";
import React from "react";
import type { VerticalDividerProps } from "./Divider.types";

const HEIGHT = 30;
const WIDTH = 2.3;
const BORDER_RADIUS = 10;
const MARGIN = 15;

export const VerticalDivider: React.FC<VerticalDividerProps> = ({
  children,
}: VerticalDividerProps): React.JSX.Element => {
  const validChildren = React.Children.toArray(children);

  if (validChildren.length < 2) {
    console.warn('"VerticalDivider" requires at least 2 children.');
    return <>{children}</>;
  }

  return (
    <View className="flex-row items-center">
      {validChildren.map((child, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <View
              style={{
                width: WIDTH,
                height: HEIGHT,
                borderRadius: BORDER_RADIUS,
                backgroundColor: "#7d7d7d",
                margin: MARGIN,
              }}
            />
          )}
          {child}
        </React.Fragment>
      ))}
    </View>
  );
};
