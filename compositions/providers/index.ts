import type { ComponentType, PropsWithChildren } from "react";
import {
  NavigationProvider,
  AppThemeProvider,
  GestureProvider,
  BottomSheetProvider,
  PressableRootProvider,
} from "../../providers/app-providers";
import { composeProviders } from "../../utils/react-native/compose-providers";

const AppProviders: ComponentType<PropsWithChildren> = composeProviders<
  ComponentType<PropsWithChildren>[]
>(
  NavigationProvider,
  AppThemeProvider,
  GestureProvider,
  BottomSheetProvider,
  PressableRootProvider,
);

export { AppProviders };
