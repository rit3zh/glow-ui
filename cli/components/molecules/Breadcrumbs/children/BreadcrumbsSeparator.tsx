import React from "react";
import { Text, StyleSheet } from "react-native";
import type { BreadcrumbsSeparatorProps } from "../Breadcrumbs.types";

export const BreadcrumbsSeparator: React.FC<BreadcrumbsSeparatorProps> = ({
  children = "/",
}) => {
  return <Text style={styles.separator}>{children}</Text>;
};

const styles = StyleSheet.create({
  separator: {
    marginHorizontal: 4,
    color: "#888",
  },
});
