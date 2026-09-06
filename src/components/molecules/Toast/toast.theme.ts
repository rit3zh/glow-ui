import { createContext, useContext } from "react";
import { StyleSheet } from "react-native";

import { TOAST_RADIUS } from "./toast.constants";
import type { TToastColors, TToastType } from "./Toast.types";

const darkColors: TToastColors = {
  card: "#1A1A1C",
  border: "rgba(255, 255, 255, 0.08)",
  foreground: "#F5F5F7",
  mutedForeground: "#8E8E96",
  primaryForeground: "#0A0A0B",
  subtle: "rgba(255, 255, 255, 0.06)",
  destructive: "#FF5A52",
  success: "#34D27B",
  info: "#2FA8FF",
  warning: "#FFB23E",
  shadow: "#000000",
};

const lightColors: TToastColors = {
  card: "#FFFFFF",
  border: "rgba(0, 0, 0, 0.06)",
  foreground: "#0A0A0B",
  mutedForeground: "#6B6B73",
  primaryForeground: "#FFFFFF",
  subtle: "rgba(0, 0, 0, 0.05)",
  destructive: "#E5484D",
  success: "#18A957",
  info: "#0B84FF",
  warning: "#E08600",
  shadow: "#0A0A0B",
};

function getToastAccent(colors: TToastColors): Record<TToastType, string> {
  return {
    default: colors.foreground,
    success: colors.success,
    info: colors.info,
    warning: colors.warning,
    loading: colors.mutedForeground,
    error: colors.destructive,
  };
}

function createToastStyles(colors: TToastColors) {
  return StyleSheet.create({
    region: {
      position: "absolute",
    },
    toastWrapper: {
      position: "absolute",
      left: 0,
      right: 0,
    },
    toast: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: TOAST_RADIUS,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      backgroundColor: colors.card,
      shadowColor: colors.shadow,
      shadowOpacity: 0.45,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 10 },
      elevation: 10,
    },
    inner: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    icon: {
      alignItems: "center",
      justifyContent: "center",
    },
    content: {
      flex: 1,
      gap: 3,
    },
    title: {
      color: colors.foreground,
      fontSize: 14,
      fontWeight: "700",
      lineHeight: 19,
    },
    description: {
      color: colors.mutedForeground,
      fontSize: 13,
      fontWeight: "500",
      lineHeight: 18,
    },
    actions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    actionButton: {
      paddingVertical: 7,
      paddingHorizontal: 13,
      borderRadius: 10,
      backgroundColor: colors.foreground,
    },
    actionLabel: {
      color: colors.card,
      fontSize: 13,
      fontWeight: "700",
    },
    cancelButton: {
      paddingVertical: 7,
      paddingHorizontal: 13,
      borderRadius: 10,
      backgroundColor: colors.subtle,
    },
    cancelLabel: {
      color: colors.foreground,
      fontSize: 13,
      fontWeight: "500",
    },
    closeButton: {
      width: 22,
      height: 22,
      borderRadius: 11,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.subtle,
    },
    swipeAction: {
      position: "absolute",
      top: 0,
      bottom: 0,
      overflow: "hidden",
    },
    swipeActionSlot: {
      position: "absolute",
      top: 0,
      bottom: 0,
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
    },
    swipeActionLabel: {
      fontSize: 12,
      fontWeight: "600",
      letterSpacing: 0.1,
    },
  });
}

type TToastStyles = ReturnType<typeof createToastStyles>;

interface IToastThemeValue {
  colors: TToastColors;
  accents: Record<TToastType, string>;
  styles: TToastStyles;
}

const defaultThemeValue: IToastThemeValue = {
  colors: darkColors,
  accents: getToastAccent(darkColors),
  styles: createToastStyles(darkColors),
};

const ToastThemeContext = createContext<IToastThemeValue>(defaultThemeValue);

function useToastTheme(): IToastThemeValue {
  return useContext(ToastThemeContext);
}

export {
  createToastStyles,
  darkColors,
  defaultThemeValue,
  getToastAccent,
  lightColors,
  ToastThemeContext,
  useToastTheme,
};
export type { IToastThemeValue, TToastStyles };
