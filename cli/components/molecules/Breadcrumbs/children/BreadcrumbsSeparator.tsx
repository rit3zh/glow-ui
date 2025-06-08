import React from "react";
import { Text, StyleSheet, View } from "react-native";
import type { BreadcrumbsSeparatorProps } from "../Breadcrumbs.types";

export const BreadcrumbsSeparator: React.FC<BreadcrumbsSeparatorProps> = ({
  children = "/",
}) => {
  return (
    <View style={styles.separator}>
      {children ? children : <Text style={{ color: "#888" }}>{children}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  separator: {
    marginHorizontal: 4,
    color: "#888",
  },
});
