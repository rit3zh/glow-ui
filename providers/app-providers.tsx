import * as React from "react";
import { DarkTheme } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ThemeMode, ThemeProvider } from "@/components/organisms/theme-switch";
import { ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import { PressableProvider } from "@/components/atoms/pressable";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";

const GestureProvider: React.FC<React.PropsWithChildren> = ({
  children,
}: React.PropsWithChildren): React.ReactNode & React.ReactElement => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    {children}
  </GestureHandlerRootView>
);

const BottomSheetProvider: React.FC<React.PropsWithChildren> = ({
  children,
}: React.PropsWithChildren): React.ReactNode & React.ReactElement => (
  <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
);

const NavigationProvider: React.FC<React.PropsWithChildren> = ({
  children,
}: React.PropsWithChildren): React.ReactNode & React.ReactElement => (
  <NavigationThemeProvider value={DarkTheme}>
    {children}
  </NavigationThemeProvider>
);

const AppThemeProvider: React.FC<React.PropsWithChildren> = ({
  children,
}: React.PropsWithChildren): React.ReactNode & React.ReactElement => (
  <ThemeProvider defaultTheme={ThemeMode.Dark}>{children}</ThemeProvider>
);

const PressableRootProvider: React.FC<React.PropsWithChildren> = ({
  children,
}: React.PropsWithChildren): React.ReactNode & React.ReactElement => (
  <PressableProvider
    initialOnPress={() => impactAsync(ImpactFeedbackStyle.Heavy)}
    defaultFeedback={{
      haptic: false,
      sound: true,
    }}
  >
    {children}
  </PressableProvider>
);

export {
  BottomSheetProvider,
  GestureProvider,
  NavigationProvider,
  AppThemeProvider,
  // AuraProvider,
  PressableRootProvider,
};
