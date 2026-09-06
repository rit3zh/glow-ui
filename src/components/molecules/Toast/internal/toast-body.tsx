import { Pressable, Text, View } from "react-native";

import { useToastTheme } from "../toast.theme";
import type { IToastBody } from "../Toast.types";
import { CloseIcon } from "./toast-icons";
import { renderContent } from "./toast-item.utils";

function ToastBody({
  toast,
  iconNode,
  type,
  dismissible,
  closeButton,
  icons,
  titleStyle,
  descriptionStyle,
  onCancel,
  onAction,
  onClose,
}: IToastBody) {
  const { colors, styles } = useToastTheme();

  if (toast.jsx) return <>{toast.jsx}</>;

  return (
    <>
      {iconNode != null ? <View style={styles.icon}>{iconNode}</View> : null}

      <View style={styles.content}>
        {toast.title != null ? (
          <Text style={[styles.title, titleStyle]}>
            {renderContent(toast.title)}
          </Text>
        ) : null}
        {toast.description != null ? (
          <Text style={[styles.description, descriptionStyle]}>
            {renderContent(toast.description)}
          </Text>
        ) : null}
      </View>

      {toast.cancel || toast.action ? (
        <View style={styles.actions}>
          {toast.cancel ? (
            <Pressable style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelLabel}>{toast.cancel.label}</Text>
            </Pressable>
          ) : null}
          {toast.action ? (
            <Pressable style={styles.actionButton} onPress={onAction}>
              <Text style={styles.actionLabel}>{toast.action.label}</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      {closeButton && dismissible && type !== "loading" ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          style={styles.closeButton}
          onPress={onClose}
        >
          {icons?.close ?? <CloseIcon color={colors.mutedForeground} />}
        </Pressable>
      ) : null}
    </>
  );
}

export { ToastBody };
