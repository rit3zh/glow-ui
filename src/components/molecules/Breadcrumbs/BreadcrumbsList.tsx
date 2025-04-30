import React from "react";
import { View, StyleSheet } from "react-native";
import type { BreadcrumbsListProps } from "./Breadcrumbs.types";

export const BreadcrumbsList: React.FC<BreadcrumbsListProps> = ({
  children,
}) => {
  return <View style={styles.list}>{children}</View>;
};

const styles = StyleSheet.create({
  list: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
});
