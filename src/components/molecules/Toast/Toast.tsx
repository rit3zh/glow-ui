import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";
import type {
  Toast as ToastType,
  ToastType as ToastVariant,
} from "./Toast.types";
import { useToast } from "./context/ToastContext";

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
    toast.options.position === "top" ? -20 : 20
  );
  const scale = useSharedValue(0.95);
  const rotateZ = useSharedValue(toast.options.position === "top" ? -2 : 2);
  const viewRef = useRef<View>(null);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });
    translateY.value = withSpring(0, {
      damping: 12,
      stiffness: 100,
      mass: 1,
    });
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 100,
    });
    rotateZ.value = withTiming(0, { duration: 300 });

    if (toast.options.duration > 0) {
      const exitDelay = Math.max(0, toast.options.duration - 500);

      const exitAnimations = () => {
        opacity.value = withTiming(0, {
          duration: 300,
          easing: Easing.in(Easing.cubic),
        });
        translateY.value = withTiming(
          toast.options.position === "top" ? -20 : 20,
          { duration: 300, easing: Easing.in(Easing.cubic) }
        );
        scale.value = withTiming(0.95, {
          duration: 300,
          easing: Easing.in(Easing.cubic),
        });
      };

      setTimeout(exitAnimations, exitDelay);
    }
  }, [toast, opacity, translateY, scale, rotateZ]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { scale: scale.value },
        { rotateZ: `${rotateZ.value}deg` },
      ],
    };
  });

  const handlePress = () => {
    opacity.value = withTiming(0, { duration: 200 });
    translateY.value = withTiming(toast.options.position === "top" ? -20 : 20, {
      duration: 200,
    });
    scale.value = withTiming(0.95, { duration: 200 });

    setTimeout(() => {
      dismiss(toast.id);
      toast.options.onClose?.();
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
  viewport: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: 16,
  },
  topViewport: {
    top: 0,
  },
  bottomViewport: {
    bottom: 0,
  },
});
