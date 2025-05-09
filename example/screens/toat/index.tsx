import React from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  ToastProviderWithViewport,
  useToast,
  Toast,
} from "@/components/molecules";

function SuccessToast() {
  return (
    <View style={styles.customToast}>
      <Text style={styles.customToastTitle}>Success!</Text>
      <Text style={styles.customToastMessage}>
        Your action has been completed.
      </Text>
    </View>
  );
}

function HookExampleScreen() {
  const toast = useToast();

  const showToastWithHook = () => {
    const id = toast.show("Loading...", {
      action: {
        label: "Cancel",
        onPress: () => alert("Cancel pressed"),
      },
    });

    setTimeout(() => {
      toast.update(id, "Operation completed!", { type: "success" });
    }, 2000);
  };

  return (
    <Button
      title="Show Toast with Hook (with update)"
      onPress={showToastWithHook}
    />
  );
}

function HomeScreen() {
  const showSimpleToast = () => {
    Toast.show("This is a simple toast message!", { duration: 3000 });
  };

  const showSuccessToast = () => {
    Toast.show("Operation completed successfully!", {
      type: "success",
      duration: 3000,
      action: {
        label: "Undo",
        onPress: () => console.log("Undo pressed"),
      },
    });
  };

  const showErrorToast = () => {
    Toast.show("Something went wrong!", { type: "error", duration: 3000 });
  };

  const showWarningToast = () => {
    Toast.show("Warning! This action can't be undone.", {
      type: "warning",
      duration: 3000,
    });
  };

  const showInfoToast = () => {
    Toast.show("Did you know? You can tap on toasts to dismiss them.", {
      type: "info",
      duration: 3000,
    });
  };

  const showCustomComponentToast = () => {
    Toast.show(<SuccessToast />, { duration: 5000, position: "top" });
  };

  const showTopToast = () => {
    Toast.show("I appear from the top!", { position: "top", duration: 3000 });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Toast Examples</Text>

      <View style={styles.buttonGroup}>
        <Text style={styles.sectionTitle}>Basic Types</Text>
        <Button title="Default Toast" onPress={showSimpleToast} />
        <View style={styles.spacer} />
        <Button title="Success Toast" onPress={showSuccessToast} />
        <View style={styles.spacer} />
        <Button title="Error Toast" onPress={showErrorToast} />
        <View style={styles.spacer} />
        <Button title="Warning Toast" onPress={showWarningToast} />
        <View style={styles.spacer} />
        <Button title="Info Toast" onPress={showInfoToast} />
      </View>

      <View style={styles.buttonGroup}>
        <Text style={styles.sectionTitle}>Advanced Options</Text>
        <Button
          title="Custom Component Toast"
          onPress={showCustomComponentToast}
        />
        <View style={styles.spacer} />
        <Button title="Toast at Top" onPress={showTopToast} />
        <View style={styles.spacer} />
        <HookExampleScreen />
      </View>
    </View>
  );
}

export function App() {
  return (
    <SafeAreaProvider>
      <ToastProviderWithViewport>
        <HomeScreen />
      </ToastProviderWithViewport>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  buttonGroup: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  spacer: {
    height: 12,
  },
  customToast: {
    padding: 4,
  },
  customToastTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  customToastMessage: {
    color: "#fff",
    fontSize: 14,
  },
});
