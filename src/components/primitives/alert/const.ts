import type { ComponentProps } from "react";
import type { Feather } from "@expo/vector-icons";

import type { IAlertPalette, TAlertTheme, TAlertVariant } from "./types";

const ALERT_THEME: Record<TAlertTheme, Record<TAlertVariant, IAlertPalette>> = {
  dark: {
    default: {
      bg: "#18181B",
      border: "rgba(255,255,255,0.08)",
      icon: "#D4D4D8",
      iconBg: "rgba(255,255,255,0.08)",
      title: "#FAFAFA",
      description: "#A1A1AA",
    },
    destructive: {
      bg: "#1F1315",
      border: "rgba(248,113,113,0.22)",
      icon: "#F87171",
      iconBg: "rgba(248,113,113,0.14)",
      title: "#FECACA",
      description: "#E7A8A8",
    },
    success: {
      bg: "#12211A",
      border: "rgba(74,222,128,0.22)",
      icon: "#4ADE80",
      iconBg: "rgba(74,222,128,0.14)",
      title: "#BBF7D0",
      description: "#9CC7AC",
    },
    warning: {
      bg: "#221B0F",
      border: "rgba(251,191,36,0.24)",
      icon: "#FBBF24",
      iconBg: "rgba(251,191,36,0.14)",
      title: "#FDE68A",
      description: "#CBB98C",
    },
  },
  light: {
    default: {
      bg: "#F4F4F5",
      border: "rgba(0,0,0,0.08)",
      icon: "#3F3F46",
      iconBg: "rgba(0,0,0,0.06)",
      title: "#18181B",
      description: "#52525B",
    },
    destructive: {
      bg: "#FEF2F2",
      border: "rgba(239,68,68,0.2)",
      icon: "#DC2626",
      iconBg: "rgba(239,68,68,0.1)",
      title: "#991B1B",
      description: "#B91C1C",
    },
    success: {
      bg: "#F0FDF4",
      border: "rgba(34,197,94,0.2)",
      icon: "#16A34A",
      iconBg: "rgba(34,197,94,0.1)",
      title: "#166534",
      description: "#15803D",
    },
    warning: {
      bg: "#FFFBEB",
      border: "rgba(245,158,11,0.2)",
      icon: "#D97706",
      iconBg: "rgba(245,158,11,0.1)",
      title: "#92400E",
      description: "#B45309",
    },
  },
};

const ALERT_VARIANT_ICON: Record<
  TAlertVariant,
  ComponentProps<typeof Feather>["name"]
> = {
  default: "info",
  destructive: "alert-triangle",
  success: "check-circle",
  warning: "alert-triangle",
};

export { ALERT_THEME, ALERT_VARIANT_ICON };
