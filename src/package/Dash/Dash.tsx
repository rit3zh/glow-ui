import * as React from "react";
import { View, StyleProp, ViewStyle, StyleSheet } from "react-native";
import { getDashStyle, isStyleRow } from "@/utils/dash/row/index";

export interface DashProps {
  style?: StyleProp<ViewStyle>;
  dashStyle?: StyleProp<ViewStyle>;
  dashGap?: number;
  dashColor?: string;
  dashLength?: number;
  dashThickness?: number;
}

const Dash: React.FC<DashProps> = ({
  style,
  dashGap = 2,
  dashLength = 4,
  dashThickness = 2,
  dashColor = "#000",
  dashStyle,
}) => {
  const [width, setWidth] = React.useState<number>(0);
  const [height, setHeight] = React.useState<number>(0);
  const isRow = isStyleRow(style);
  const length = isRow ? width : height;
  const n = Math.ceil(length / (dashGap + dashLength));

  const calculatedDashStyles = getDashStyle({
    style,
    dashGap,
    dashLength,
    dashThickness,
    dashColor,
  });

  const arr: React.ReactElement[] = [];
  for (let index = 0; index < n; index++) {
    arr.push(<View key={index} style={[calculatedDashStyles, dashStyle]} />);
  }

  const measure = ({
    nativeEvent: {
      layout: { width: LayoutWidth = 0, height: LayoutHeight = 0 } = {},
    } = {},
  }) => {
    setWidth(LayoutWidth);
    setHeight(LayoutHeight);
  };

  return (
    <View
      onLayout={measure}
      style={[style, isRow ? styles.row : styles.column]}
    >
      {arr}
    </View>
  );
};

export default Dash;

const styles = StyleSheet.create({
  row: { flexDirection: "row" },
  column: { flexDirection: "column" },
});
