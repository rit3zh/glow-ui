import { StatusBar } from "expo-status-bar";
import React from "react";
import { Stack } from "expo-router";
import { Appearance, ScrollView } from "react-native";
import { ThemeProvider, DarkTheme } from "@react-navigation/native";

Appearance.setColorScheme("dark");
export default function RootLayout() {
  return (
    <React.Fragment>
      <StatusBar />
      <ThemeProvider value={DarkTheme}>
        <Stack />
      </ThemeProvider>
    </React.Fragment>
  );
}
