import { StyleProp, StyleSheet, ViewStyle } from "react-native";

interface DashStyleProps {
  style?: StyleProp<ViewStyle>;
  dashGap: number;
  dashLength: number;
  dashThickness: number;
  dashColor: string;
}

const stylesStore: Record<string, ViewStyle> = {};

export const isStyleRow = (
  style?: StyleProp<ViewStyle> | undefined
): boolean => {
  const flatStyle = StyleSheet.flatten(style || {});
  return flatStyle.flexDirection !== "column";
};

const getDashStyleId = (
  { dashGap, dashLength, dashThickness, dashColor }: DashStyleProps,
  isRow: boolean
): string =>
  `${dashGap}-${dashLength}-${dashThickness}-${dashColor}-${isRow ? "row" : "column"}`;

const createDashStyleSheet = (
  { dashGap, dashLength, dashThickness, dashColor }: DashStyleProps,
  isRow: boolean
): ViewStyle => {
  const idStyle = StyleSheet.create({
    style: {
      width: isRow ? dashLength : dashThickness,
      height: isRow ? dashThickness : dashLength,
      marginRight: isRow ? dashGap : 0,
      marginBottom: isRow ? 0 : dashGap,
      backgroundColor: dashColor,
    },
  });
  return idStyle.style;
};

export const getDashStyle = ({
  style,
  dashGap,
  dashLength,
  dashThickness,
  dashColor,
}: DashStyleProps): ViewStyle => {
  const isRow = isStyleRow(style);
  const id = getDashStyleId(
    { dashGap, dashLength, dashThickness, dashColor, style },
    isRow
  );

  if (!stylesStore[id]) {
    stylesStore[id] = createDashStyleSheet(
      { dashGap, dashLength, dashThickness, dashColor, style },
      isRow
    );
  }

  return stylesStore[id];
};
