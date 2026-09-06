import { StyleSheet } from "react-native";
import React, { Fragment, memo } from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { IShowcase } from "./interface";

const Showcase: React.FC<React.PropsWithChildren & IShowcase> &
  React.FunctionComponent<React.PropsWithChildren & IShowcase> = memo(
  ({
    children,
    disableBackButton,
  }: React.PropsWithChildren & IShowcase):
    | (React.ReactNode & React.JSX.Element & React.ReactElement)
    | null => {
    const insets = useSafeAreaInsets();
    return (
      <Fragment>
        <Stack.Screen
          options={{
            headerBackVisible: !disableBackButton ?? true,
            headerShown: true,
            headerTitle: "",
            headerTransparent: true,
          }}
        />

        <GestureHandlerRootView
          style={[
            styles.container,
            {
              paddingTop: insets.top,
            },
          ]}
        >
          {children}
        </GestureHandlerRootView>
      </Fragment>
    );
  },
);

export { Showcase };

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0a" },
});
