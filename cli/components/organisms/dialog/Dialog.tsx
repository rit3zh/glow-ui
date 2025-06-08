import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  StyleProp,
  TextStyle,
} from "react-native";

// Types
interface DialogContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface DialogProps {
  children: ReactNode;
}

interface DialogTriggerProps {
  children: ReactNode;
  asChild?: boolean;
}

interface DialogContentProps {
  children: ReactNode;
  className?: string;
}

interface DialogHeaderProps {
  children: ReactNode;
}

interface DialogTitleProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}

interface DialogDescriptionProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}

interface DialogFooterProps {
  children: ReactNode;
}

interface DialogCloseProps {
  children: ReactNode;
  asChild?: boolean;
}

// Context
const DialogContext = createContext<DialogContextType | undefined>(undefined);

const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within a Dialog");
  }
  return context;
};

// Styles
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  content: {
    backgroundColor: "#09090b",
    borderRadius: 12,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: "#27272a",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fafafa",
    marginBottom: 4,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: "#a1a1aa",
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 24,
  },
  button: {},
  primaryButton: {
    backgroundColor: "#fafafa",
    borderColor: "#fafafa",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    // borderColor: "#27272a",
  },
  primaryButtonText: {
    color: "#09090b",
    fontSize: 14,
    fontWeight: "500",
  },
  secondaryButtonText: {
    color: "#fafafa",
    fontSize: 14,
    fontWeight: "500",
  },
});

// Components
export const Dialog: React.FC<DialogProps> = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

export const DialogTrigger: React.FC<DialogTriggerProps> = ({
  children,
  asChild,
}) => {
  const { setOpen } = useDialog();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onPress: () => setOpen(true),
    } as any);
  }

  return (
    <TouchableOpacity onPress={() => setOpen(true)}>
      {children}
    </TouchableOpacity>
  );
};

export const DialogContent: React.FC<DialogContentProps> = ({ children }) => {
  const { open, setOpen } = useDialog();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));
  const [translateYAnim] = useState(new Animated.Value(50));
  const [overlayFadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    if (open) {
      // Opening animation - fade in up
      Animated.parallel([
        Animated.timing(overlayFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 65,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(translateYAnim, {
          toValue: 0,
          tension: 65,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Closing animation - fade out down
      Animated.parallel([
        Animated.timing(overlayFadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 30,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [open]);

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => setOpen(false)}
    >
      <Animated.View style={[styles.overlay, { opacity: overlayFadeAnim }]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => setOpen(false)}
        />
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
            },
          ]}
        >
          <Pressable>{children}</Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export const DialogHeader: React.FC<DialogHeaderProps> = ({ children }) => {
  return <View style={styles.header}>{children}</View>;
};

export const DialogTitle: React.FC<DialogTitleProps> = ({
  children,
  style,
}) => {
  return <Text style={[styles.title, style]}>{children}</Text>;
};

export const DialogDescription: React.FC<DialogDescriptionProps> = ({
  children,
  style,
}) => {
  return <Text style={[styles.description, style]}>{children}</Text>;
};

export const DialogFooter: React.FC<DialogFooterProps> = ({ children }) => {
  return <View style={styles.footer}>{children}</View>;
};

export const DialogClose: React.FC<DialogCloseProps> = ({
  children,
  asChild,
}) => {
  const { setOpen } = useDialog();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onPress: () => setOpen(false),
    } as any);
  }

  return (
    <TouchableOpacity
      style={[styles.button, styles.secondaryButton]}
      onPress={() => setOpen(false)}
    >
      {typeof children === "string" ? (
        <Text style={styles.secondaryButtonText}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};
