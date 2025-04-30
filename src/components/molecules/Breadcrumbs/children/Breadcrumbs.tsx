import React from "react";
import { View, StyleSheet } from "react-native";
import type { BreadcrumbsProps } from "../Breadcrumbs.types";

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  children,
  style,
}) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
});
