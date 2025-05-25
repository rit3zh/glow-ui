import React from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToast } from "./context/ToastContext";
import { Toast } from "./Toast";

export const ToastViewport: React.FC = () => {
  const { toasts } = useToast();
  const insets = useSafeAreaInsets();

  const topToasts = toasts.filter((toast) => toast.options.position === "top");
  const bottomToasts = toasts.filter(
    (toast) => toast.options.position === "bottom"
  );

  return (
    <>
      <View
        style={[
          styles.viewport,
          styles.topViewport,
          {
            paddingTop: insets.top + 10,
          },
        ]}
      >
        {topToasts.map((toast, index) => (
          <Toast key={toast.id} toast={toast} index={index} />
        ))}
      </View>
      <View
        style={[
          styles.viewport,
          styles.bottomViewport,
          {
            paddingBottom: insets.bottom + 10,
          },
        ]}
      >
        {bottomToasts.map((toast, index) => (
          <Toast key={toast.id} toast={toast} index={index} />
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    width: "90%",
    maxWidth: 400,
    alignSelf: "center",
    marginVertical: 4,
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  icon: {
    color: "#fff",
    fontSize: 18,
    marginRight: 12,
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginLeft: 8,
  },
  actionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  viewport: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  topViewport: {
    top: 0,
  },
  bottomViewport: {
    bottom: 0,
  },
});
