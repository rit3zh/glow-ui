import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import type { BreadcrumbsProps } from "./Breadcrumbs.types";

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  separator = <Text style={styles.separator}>/</Text>,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <View key={index} style={styles.breadcrumb}>
            {item.icon && <View style={styles.icon}>{item.icon}</View>}
            {item.onPress && !isLast && !item.isCurrent ? (
              <TouchableOpacity onPress={item.onPress}>
                <Text style={styles.link}>{item.label}</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.current}>{item.label}</Text>
            )}
            {!isLast && <View style={styles.separator}>{separator}</View>}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  breadcrumb: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 4,
  },
  separator: {
    marginHorizontal: 4,
  },
  link: {
    color: "#007AFF", // iOS link blue
  },
  current: {
    fontWeight: "600",
    color: "#000",
  },
});
