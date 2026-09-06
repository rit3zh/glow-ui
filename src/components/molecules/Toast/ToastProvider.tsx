import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Toaster } from "./Toaster";
import type { IToastProvider } from "./Toast.types";

function ToastProvider({ children, ...toasterProps }: IToastProvider) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {children}
        <Toaster {...toasterProps} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export { ToastProvider };
