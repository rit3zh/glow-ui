import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  ToastProviderWithViewport,
  useToast,
  Toast,
} from "@/components/molecules";
import {
  Feather,
  MaterialIcons,
  Ionicons,
  AntDesign,
} from "@expo/vector-icons";

function SuccessToast() {
  return (
    <View style={{}}>
      <View
        style={{
          marginBottom: 10,
        }}
      >
        <AntDesign name="checkcircle" size={18} color="#10B981" />
        <Text style={styles.customToastTitle}>Success</Text>
      </View>
      <Text style={[styles.customToastMessage, { bottom: 10 }]}>
        Your changes have been saved successfully.
      </Text>
    </View>
  );
}

function LoadingToast() {
  return (
    <View style={styles.customToast}>
      <View style={styles.customToastHeader}>
        <MaterialIcons name="hourglass-empty" size={18} color="#8B5CF6" />
        <Text style={styles.customToastTitle}>Processing</Text>
      </View>
      <Text style={styles.customToastMessage}>
        Please wait while we process your request...
      </Text>
    </View>
  );
}

function HookExampleScreen() {
  const toast = useToast();

  const showProgressToast = () => {
    const id = toast.show(<LoadingToast />, {
      duration: 0,
      action: {
        label: "Cancel",
        onPress: () => {
          toast.dismiss(id);
          Toast.show("Operation cancelled", {
            type: "warning",
            action: {
              label: "Retry",
              onPress: () => console.log("Retry pressed"),
            },
          });
        },
      },
    });

    setTimeout(() => {
      toast.update(id, <SuccessToast />, {
        type: "success",
        duration: 4000,
        action: undefined,
      });
    }, 3000);
  };

  return (
    <TouchableOpacity style={styles.button} onPress={showProgressToast}>
      <Feather name="refresh-cw" size={16} color="#E5E7EB" />
      <Text style={styles.buttonText}>Show Progress Toast</Text>
    </TouchableOpacity>
  );
}

function ToastDemoContent() {
  const showDefaultToast = () => {
    Toast.show("This is a default notification message.", {
      duration: 4000,
    });
  };

  const showSuccessToast = () => {
    Toast.show("Your profile has been updated successfully!", {
      type: "success",
      duration: 4000,
      action: {
        label: "View",
        onPress: () => console.log("View profile"),
      },
    });
  };

  const showErrorToast = () => {
    Toast.show("Failed to save changes. Please try again.", {
      type: "error",
      duration: 5000,
      action: {
        label: "Retry",
        onPress: () => console.log("Retry action"),
      },
    });
  };

  const showWarningToast = () => {
    Toast.show("Your session will expire in 5 minutes.", {
      type: "warning",
      duration: 6000,
      action: {
        label: "Extend",
        onPress: () => console.log("Extend session"),
      },
    });
  };

  const showInfoToast = () => {
    Toast.show("New features are now available in settings.", {
      type: "info",
      duration: 4000,
      action: {
        label: "Learn more",
        onPress: () => console.log("Learn more"),
      },
    });
  };

  const showCustomToast = () => {
    Toast.show(<SuccessToast />, {
      duration: 5000,
      position: "top",
    });
  };

  const showTopToast = () => {
    Toast.show("This toast appears from the top!", {
      position: "top",
      duration: 3000,
    });
  };

  const showPersistentToast = () => {
    Toast.show("This toast stays until dismissed.", {
      duration: 0,
      action: {
        label: "Dismiss",
        onPress: () => console.log("Dismissed"),
      },
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Toast Notifications</Text>
        <Text style={styles.subtitle}>
          Beautifully designed toast components for React Native
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Types</Text>
        <Text style={styles.sectionDescription}>
          Standard toast notifications with different semantic types
        </Text>

        <View style={styles.grid}>
          <TouchableOpacity style={styles.button} onPress={showDefaultToast}>
            <Feather name="message-circle" size={16} color="#E5E7EB" />
            <Text style={styles.buttonText}>Default</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={showSuccessToast}>
            <AntDesign name="checkcircle" size={16} color="#10B981" />
            <Text style={styles.buttonText}>Success</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={showErrorToast}>
            <MaterialIcons name="error-outline" size={16} color="#EF4444" />
            <Text style={styles.buttonText}>Error</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={showWarningToast}>
            <Feather name="alert-triangle" size={16} color="#F59E0B" />
            <Text style={styles.buttonText}>Warning</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={showInfoToast}>
            <Feather name="info" size={16} color="#3B82F6" />
            <Text style={styles.buttonText}>Info</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Advanced Usage</Text>
        <Text style={styles.sectionDescription}>
          Custom components, positioning, and interactive features
        </Text>

        <View style={styles.grid}>
          <TouchableOpacity style={styles.button} onPress={showCustomToast}>
            <Feather name="code" size={16} color="#8B5CF6" />
            <Text style={styles.buttonText}>Custom Component</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={showTopToast}>
            <Feather name="arrow-up" size={16} color="#06B6D4" />
            <Text style={styles.buttonText}>Top Position</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={showPersistentToast}>
            <Ionicons name="infinite" size={16} color="#EC4899" />
            <Text style={styles.buttonText}>Persistent</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hook Example</Text>
        <Text style={styles.sectionDescription}>
          Using the useToast hook for programmatic control
        </Text>

        <HookExampleScreen />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Tap any toast notification to dismiss it early
        </Text>
      </View>
    </ScrollView>
  );
}

export default function ToastDemo() {
  return (
    <SafeAreaProvider>
      <ToastProviderWithViewport>
        <ToastDemoContent />
      </ToastProviderWithViewport>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0B",
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#9CA3AF",
    lineHeight: 24,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#F3F4F6",
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 20,
    lineHeight: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1F2937",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 140,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#E5E7EB",
  },
  customToast: {
    padding: 4,
  },
  customToastHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 8,
  },
  customToastTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  customToastMessage: {
    color: "#D1D5DB",
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    paddingVertical: 32,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});
