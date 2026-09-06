import React, { useMemo } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { createCompoundComponent } from "@/utils/create-compound-component";
import { AlertContext, useAlert } from "./context";
import { ALERT_THEME, ALERT_VARIANT_ICON } from "./const";
import type {
  IAlertContent,
  IAlertContextValue,
  IAlertDescription,
  IAlertIcon,
  IAlertRoot,
  IAlertTitle,
} from "./types";

const AlertRoot: React.FC<IAlertRoot> = ({
  children,
  variant = "default",
  theme = "dark",
  style,
}): React.JSX.Element => {
  const palette = ALERT_THEME[theme][variant];

  const ctx = useMemo<IAlertContextValue>(
    () => ({ variant, palette }),
    [variant, palette],
  );

  return (
    <AlertContext.Provider value={ctx}>
      <View
        style={[
          styles.root,
          { backgroundColor: palette.bg, borderColor: palette.border },
          style,
        ]}
      >
        {children}
      </View>
    </AlertContext.Provider>
  );
};

const AlertIcon: React.FC<IAlertIcon> = ({ children }): React.JSX.Element => {
  const { variant, palette } = useAlert("Alert.Icon");

  return (
    <View style={[styles.icon, { backgroundColor: palette.iconBg }]}>
      {children ?? (
        <Feather name={ALERT_VARIANT_ICON[variant]} size={15} color={palette.icon} />
      )}
    </View>
  );
};

const AlertContent: React.FC<IAlertContent> = ({
  children,
  style,
}): React.JSX.Element => {
  useAlert("Alert.Content");
  return <View style={[styles.content, style]}>{children}</View>;
};

const AlertTitle: React.FC<IAlertTitle> = ({
  children,
  style,
}): React.JSX.Element => {
  const { palette } = useAlert("Alert.Title");
  return (
    <Text style={[styles.title, { color: palette.title }, style]}>
      {children}
    </Text>
  );
};

const AlertDescription: React.FC<IAlertDescription> = ({
  children,
  style,
}): React.JSX.Element => {
  const { palette } = useAlert("Alert.Description");
  return (
    <Text style={[styles.description, { color: palette.description }, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    padding: 14,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: { elevation: 3 },
    }),
  },
  icon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: 3,
    paddingTop: 3,
  },
  title: {
    fontSize: 14.5,
    fontWeight: "600",
    letterSpacing: -0.1,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
});

const Alert = createCompoundComponent("Alert", AlertRoot, {
  Root: AlertRoot,
  Icon: AlertIcon,
  Content: AlertContent,
  Title: AlertTitle,
  Description: AlertDescription,
});

export {
  Alert,
  AlertRoot,
  AlertIcon,
  AlertContent,
  AlertTitle,
  AlertDescription,
};
export default Alert;
export type {
  IAlertRoot,
  IAlertIcon,
  IAlertContent,
  IAlertTitle,
  IAlertDescription,
  TAlertVariant,
  TAlertTheme,
} from "./types";
