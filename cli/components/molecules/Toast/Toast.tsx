import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  Easing,
  interpolate,
  runOnJS,
  Layout,
} from "react-native-reanimated";
import type {
  Toast as ToastType,
  ToastType as ToastVariant,
} from "./Toast.types";
import { useToast } from "./context/ToastContext";

// Enable LayoutAnimation for Android
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface ToastProps {
  toast: ToastType;
  index: number;
  onHeightChange?: (id: string, height: number) => void;
}

const getBackgroundColor = (type: ToastVariant) => {
  switch (type) {
    case "success":
      return "#10B981";
    case "error":
      return "#EF4444";
    case "warning":
      return "#F59E0B";
    case "info":
      return "#3B82F6";
    default:
      return "#262626";
  }
};

const getIconForType = (type: ToastVariant) => {
  switch (type) {
    case "success":
      return "✓";
    case "error":
      return "✗";
    case "warning":
      return "⚠";
    case "info":
      return "ℹ";
    default:
      return "";
  }
};

export const Toast: React.FC<ToastProps> = ({ toast, index }) => {
  const prevContentRef = useRef<string | React.ReactNode | null>(null);
  const prevTypeRef = useRef<ToastVariant | null>(null);

  const { dismiss } = useToast();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(
    toast.options.position === "top" ? -20 : 20,
  );
  const scale = useSharedValue(0.95);
  const rotateZ = useSharedValue(toast.options.position === "top" ? -2 : 2);
  const height = useSharedValue(0);
  const viewRef = useRef<View>(null);

  // Calculate the offset based on index for stacking effect
  const getStackOffset = () => {
    const baseOffset = 8; // Base offset between toasts
    const maxOffset = 20; // Maximum offset
    const offset = Math.min(index * baseOffset, maxOffset);
    return toast.options.position === "top" ? -offset : offset;
  };

  const handleDismiss = () => {
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    });
    dismiss(toast.id);
    toast.options.onClose?.();
  };

  useEffect(() => {
    // Stagger the entrance animation based on index
    const delay = index * 50;

    // Configure layout animation for height changes
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });

    setTimeout(() => {
      opacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });

      translateY.value = withSpring(getStackOffset(), {
        damping: 20,
        stiffness: 150,
        mass: 0.6,
        velocity: 0.5,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
      });

      scale.value = withSpring(1, {
        damping: 20,
        stiffness: 150,
        mass: 0.6,
      });

      rotateZ.value = withTiming(0, {
        duration: 300,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });
    }, delay);

    if (toast.options.duration > 0) {
      const exitDelay = Math.max(0, toast.options.duration - 500);

      const exitAnimations = () => {
        opacity.value = withTiming(0, {
          duration: 250,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        });

        translateY.value = withTiming(
          toast.options.position === "top" ? -20 : 20,
          {
            duration: 250,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
          },
        );

        scale.value = withTiming(0.95, {
          duration: 250,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        });

        setTimeout(() => {
          runOnJS(handleDismiss)();
        }, 250);
      };

      setTimeout(exitAnimations, exitDelay);
    }
  }, [toast, opacity, translateY, scale, rotateZ, index]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { scale: scale.value },
        { rotateZ: `${rotateZ.value}deg` },
      ],
      zIndex: 1000 - index, // Higher index toasts appear behind
    };
  });

  const handlePress = () => {
    opacity.value = withTiming(0, {
      duration: 200,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });

    translateY.value = withTiming(toast.options.position === "top" ? -20 : 20, {
      duration: 200,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });

    scale.value = withTiming(0.95, {
      duration: 200,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });

    setTimeout(() => {
      handleDismiss();
    }, 200);
  };

  const backgroundColor = getBackgroundColor(toast.options.type);
  const icon = getIconForType(toast.options.type);

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        animatedStyle,
        {
          marginTop: index > 0 ? 8 : 0,
          marginBottom: index > 0 ? 0 : 8,
        },
      ]}
    >
      <Pressable
        style={[styles.toast, { backgroundColor }]}
        onPress={handlePress}
        android_ripple={{ color: "rgba(255, 255, 255, 0.1)" }}
      >
        {icon ? <Text style={styles.icon}>{icon}</Text> : null}
        <View style={styles.contentContainer}>
          {typeof toast.content === "string" ? (
            <Text style={styles.text}>{toast.content}</Text>
          ) : (
            toast.content
          )}
        </View>
        {toast.options.action && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              toast.options.action?.onPress!();
              dismiss(toast.id);
            }}
          >
            <Text style={styles.actionText}>{toast.options.action.label}</Text>
          </TouchableOpacity>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    width: "90%",
    maxWidth: 400,
    alignSelf: "center",
    marginVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
  },
  icon: {
    color: "#fff",
    fontSize: 20,
    marginRight: 12,
    fontWeight: "bold",
    textAlign: "center",
    width: 24,
  },
  contentContainer: {
    flex: 1,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 20,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginLeft: 12,
  },
  actionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
