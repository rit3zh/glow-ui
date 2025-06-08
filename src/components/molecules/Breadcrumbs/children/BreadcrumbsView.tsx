import React from "react";
import { StyleSheet, View } from "react-native";
import type { BreadcrumbsSeparatorProps } from "../Breadcrumbs.types";

/**
 *
 * @deprecated
 */
export const BreadcrumbsView: React.FC<BreadcrumbsSeparatorProps> = ({
  children,
}) => {
  return <View style={styles.item}>{children}</View>;
};

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
  },
});
