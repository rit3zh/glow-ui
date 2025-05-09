import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import type { WhatsNewItemContainerProps } from "../WhatsNew.type";

const { width } = Dimensions.get("window");
const dynamicGap = width * 0.03;

export const WhatsNewItemContainer: React.FC<WhatsNewItemContainerProps> = ({
  children,
}) => {
  const childrenArray = React.Children.toArray(children);
  const first = childrenArray[0];
  const rest = childrenArray.slice(1);

  return (
    <View style={[styles.wrapper]}>
      <View style={[styles.row, { columnGap: dynamicGap + 5 }]}>
        {first}
        <View style={styles.rest}>{rest}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    paddingHorizontal: dynamicGap,
    paddingVertical: dynamicGap,
    marginBottom: dynamicGap,
    marginLeft: dynamicGap,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rest: {},
});
