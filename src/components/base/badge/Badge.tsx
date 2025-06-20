/**
 * ╔════════════════════════════════════════════════════════╗
 * ║                                                        ║
 * ║   ✦ Badge Component  ✦                                ║
 * ║                                                        ║
 * ╠════════════════════════════════════════════════════════╣
 * ║  Author      : Ritesh “rit3zh”                        ║
 * ║  Created On  : April 27, 2025                          ║
 * ║  A versatile badge for status indicators,              ║
 * ║  notifications, and contextual labels in your UI       ║
 * ╚════════════════════════════════════════════════════════╝
 */

import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import * as constants from "@/constants/components/index";

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "notifications"
  | "pending";
import type { BorderRadiusKey } from "@/constants/components/index";

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: "sm" | "md" | "lg";
  radius?: BorderRadiusKey;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const variantStyles: Record<
  BadgeVariant,
  {
    backgroundColor: string;
    textColor: string;
    borderColor?: string;
    borderWidth?: number;
  }
> = {
  default: { backgroundColor: "#c6e8c5", textColor: "#374151" },
  success: { backgroundColor: "#D1FAE5", textColor: "#065F46" },
  warning: { backgroundColor: "#FEF3C7", textColor: "#92400E" },
  error: { backgroundColor: "#FEE2E2", textColor: "#991B1B" },
  pending: {
    backgroundColor: "#edeef8",
    textColor: "#312db8",
  },
  notifications: {
    backgroundColor: "transparent",
    textColor: "#dbdbdb",
    borderColor: "#e6e6e6",
    borderWidth: 0.3,
  },
};

const sizeStyles: Record<
  "sm" | "md" | "lg",
  { paddingVertical: number; paddingHorizontal: number; fontSize: number }
> = {
  sm: { paddingVertical: 4, paddingHorizontal: 8, fontSize: 10 },
  md: { paddingVertical: 7, paddingHorizontal: 15, fontSize: 16 },
  lg: { paddingVertical: 12, paddingHorizontal: 20, fontSize: 25 },
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "default",
  size = "md",
  style,
  textStyle,
  icon,
  radius = "md",
}) => {
  const vs = variantStyles[variant];
  const ss = sizeStyles[size];
  const rs = constants.borderRadiusStyles[radius];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: vs.backgroundColor,
          paddingVertical: ss.paddingVertical,
          paddingHorizontal: ss.paddingHorizontal,
          borderRadius: rs,
          borderColor: vs.borderColor,
          borderWidth: vs.borderWidth,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      {icon}
      {label ? (
        <Text
          style={[
            styles.text,
            { color: vs.textColor, fontSize: ss.fontSize },
            textStyle,
          ]}
        >
          {label}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {},
  text: {
    fontWeight: "500",
    marginLeft: 5,
  },
});
