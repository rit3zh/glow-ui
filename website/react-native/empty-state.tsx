import React, { createContext, ReactNode, useMemo } from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import type {
  IButton,
  IEmptyContent,
  IEmptyContextValue,
  IEmptyDescription,
  IEmptyHeader,
  IEmptyMedia,
  IEmptyProps,
  IEmptyTitle,
} from "./types";

const EmptyContext = createContext<IEmptyContextValue | undefined>(undefined);

// ==================== EMPTY COMPONENT ====================

export const Empty: React.FC<IEmptyProps> = ({
  children,
  variant = "default",
  style,
}) => {
  const contextValue = useMemo<IEmptyContextValue>(
    () => ({
      variant,
    }),
    [variant],
  );

  return (
    <EmptyContext.Provider value={contextValue}>
      <View
        style={[
          styles.empty,
          variant === "outline" && styles.emptyOutline,
          style,
        ]}
      >
        {children}
      </View>
    </EmptyContext.Provider>
  );
};

// ==================== EMPTY HEADER ====================

export const EmptyHeader: React.FC<IEmptyHeader> = ({ children, style }) => {
  return <View style={[styles.emptyHeader, style]}>{children}</View>;
};

// ==================== EMPTY MEDIA ====================

export const EmptyMedia: React.FC<IEmptyMedia> = ({
  children,
  variant = "icon",
  style,
}) => {
  return (
    <View
      style={[
        styles.emptyMedia,
        variant === "icon" && styles.emptyMediaIcon,
        style,
      ]}
    >
      {children}
    </View>
  );
};

// ==================== EMPTY TITLE ====================

export const EmptyTitle: React.FC<IEmptyTitle> = ({ children, style }) => {
  return <Text style={[styles.emptyTitle, style]}>{children}</Text>;
};

// ==================== EMPTY DESCRIPTION ====================

export const EmptyDescription: React.FC<IEmptyDescription> = ({
  children,
  style,
}) => {
  return <Text style={[styles.emptyDescription, style]}>{children}</Text>;
};

// ==================== EMPTY CONTENT ====================

export const EmptyContent: React.FC<IEmptyContent> = ({ children, style }) => {
  return <View style={[styles.emptyContent, style]}>{children}</View>;
};

// ==================== BUTTON COMPONENT ====================

export const EmptyButton: React.FC<IButton> = ({
  children,
  variant = "default",
  size = "md",
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === "outline" && styles.buttonOutline,
        size === "sm" && styles.buttonSm,
        size === "md" && styles.buttonMd,
        size === "lg" && styles.buttonLg,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {typeof children === "string" ? (
        <Text
          style={[
            styles.buttonText,
            variant === "outline" && styles.buttonTextOutline,
            size === "sm" && styles.buttonTextSm,
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

// ==================== ICON CLOUD COMPONENT ====================
const styles = StyleSheet.create({
  empty: {
    backgroundColor: "transparent",
    borderRadius: 16,
    padding: 48,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 400,
  } as ViewStyle,
  emptyOutline: {
    borderWidth: 2,
    borderColor: "#333333",
    borderStyle: "dashed",
  } as ViewStyle,

  // Empty header
  emptyHeader: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  } as ViewStyle,

  // Empty media
  emptyMedia: {
    marginBottom: 32,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  emptyMediaIcon: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,

  // Empty title
  emptyTitle: {
    fontSize: 28,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 16,
    textAlign: "center",
  } as TextStyle,

  // Empty description
  emptyDescription: {
    fontSize: 16,
    color: "#999999",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  } as TextStyle,

  // Empty content
  emptyContent: {
    marginTop: 32,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,

  // Button base
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  } as ViewStyle,
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#333333",
  } as ViewStyle,

  // Button sizes
  buttonSm: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  } as ViewStyle,
  buttonMd: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  } as ViewStyle,
  buttonLg: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  } as ViewStyle,

  // Button text
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
  } as TextStyle,
  buttonTextOutline: {
    color: "#ffffff",
  } as TextStyle,
  buttonTextSm: {
    fontSize: 12,
  } as TextStyle,
});
