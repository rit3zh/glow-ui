import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import type { BreadcrumbItemProps } from "../Breadcrumbs.types";

export const BreadcrumbsItem: React.FC<BreadcrumbItemProps> = ({
  children,
  onPress,
  isCurrent,
  tint = "#888",
  currentTint = "#000",
  className,
}) => {
  const content = (
    <Text
      className={`${className}`}
      style={[
        isCurrent
          ? { color: currentTint, fontWeight: "500" }
          : {
              color: tint,
            },
      ]}
    >
      {children}
    </Text>
  );

  return onPress && !isCurrent ? (
    <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity>
  ) : (
    content
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 4,
  },
  link: {
    color: "#007AFF",
  },
  current: {
    fontWeight: "600",
    color: "#000",
  },
});
