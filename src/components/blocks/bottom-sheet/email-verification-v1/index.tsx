import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import type { IEmailIcon, IEmailVerificationBottomSheet } from "./types";
import {
  BACKDROP_OPACITY,
  COLORS,
  CONTENT_BOTTOM_PADDING,
  CONTENT_HORIZONTAL_PADDING,
  DEFAULT_ACTION_LABEL,
  DEFAULT_DESCRIPTION,
  DEFAULT_EMAIL,
  DEFAULT_SECONDARY_LABEL,
  DEFAULT_TITLE,
  ENVELOPE_BODY_PATH,
  ENVELOPE_FLAP_PATH,
  ENVELOPE_VIEW_BOX,
  SHEET_CORNER_RADIUS,
} from "./const";

const EmailIcon: React.FC<IEmailIcon> = ({
  size = 22,
  color = COLORS.envelope,
}: IEmailIcon) => (
  <Svg width={size} height={size} viewBox={ENVELOPE_VIEW_BOX}>
    <Path fill={color} d={ENVELOPE_BODY_PATH} />
    <Path fill={color} d={ENVELOPE_FLAP_PATH} />
  </Svg>
);

const EmailVerificationBottomSheet: React.FC<IEmailVerificationBottomSheet> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  email = DEFAULT_EMAIL,
  actionLabel = DEFAULT_ACTION_LABEL,
  secondaryLabel = DEFAULT_SECONDARY_LABEL,
  hideSecondaryAction = false,
  openOnFocus = true,
  onActionPress,
  onSecondaryPress,
  onClose,
}: IEmailVerificationBottomSheet) => {
  const sheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const [isMounted, setIsMounted] = useState<boolean>(openOnFocus);
  const [isActionPressed, setIsActionPressed] = useState<boolean>(false);
  const [isSecondaryPressed, setIsSecondaryPressed] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      if (openOnFocus) setIsMounted(true);
      return () => {
        sheetRef.current?.close();
        setIsMounted(false);
      };
    }, [openOnFocus]),
  );

  const handleChange = useCallback(
    (index: number): void => {
      if (index !== -1) return;
      setIsMounted(false);
      onClose?.();
    },
    [onClose],
  );

  const handleActionPressIn = useCallback(
    (): void => setIsActionPressed(true),
    [],
  );
  const handleActionPressOut = useCallback(
    (): void => setIsActionPressed(false),
    [],
  );

  const handleSecondaryPressIn = useCallback(
    (): void => setIsSecondaryPressed(true),
    [],
  );
  const handleSecondaryPressOut = useCallback(
    (): void => setIsSecondaryPressed(false),
    [],
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={BACKDROP_OPACITY}
        pressBehavior="close"
      />
    ),
    [],
  );

  const contentStyle = useMemo(
    () => [
      styles.content,
      { paddingBottom: CONTENT_BOTTOM_PADDING + insets.bottom },
    ],
    [insets.bottom],
  );

  if (!isMounted) return null;

  return (
    <BottomSheet
      ref={sheetRef}
      index={0}
      enablePanDownToClose
      enableDynamicSizing
      onChange={handleChange}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.handleIndicator}
      backgroundStyle={styles.background}
      style={styles.sheet}
    >
      <BottomSheetView style={contentStyle}>
        <View style={styles.header}>
          <View style={styles.tile}>
            <EmailIcon />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          {email ? <Text style={styles.email}>{email}</Text> : null}
        </View>

        <View style={styles.divider} />

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={actionLabel}
            onPress={onActionPress}
            onPressIn={handleActionPressIn}
            onPressOut={handleActionPressOut}
            style={[
              styles.action,
              isActionPressed ? styles.actionPressed : null,
            ]}
          >
            <Text style={styles.actionLabel} numberOfLines={1}>
              {actionLabel}
            </Text>
          </Pressable>

          {hideSecondaryAction ? null : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={secondaryLabel}
              onPress={onSecondaryPress}
              onPressIn={handleSecondaryPressIn}
              onPressOut={handleSecondaryPressOut}
              style={[
                styles.secondary,
                isSecondaryPressed ? styles.secondaryPressed : null,
              ]}
            >
              <Text style={styles.secondaryLabel} numberOfLines={1}>
                {secondaryLabel}
              </Text>
            </Pressable>
          )}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  sheet: {
    shadowColor: "#000000",
    shadowOpacity: 0.16,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -6 },
    elevation: 16,
  },
  background: {
    backgroundColor: COLORS.sheet,
    borderTopLeftRadius: SHEET_CORNER_RADIUS,
    borderTopRightRadius: SHEET_CORNER_RADIUS,
  },
  handleIndicator: {
    backgroundColor: COLORS.handle,
    width: 36,
    height: 5,
  },
  content: {
    alignSelf: "stretch",
    paddingTop: 24,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: CONTENT_HORIZONTAL_PADDING,
    paddingBottom: 26,
  },
  tile: {
    width: 46,
    height: 46,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.tileBorder,
    backgroundColor: COLORS.tile,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  title: {
    marginTop: 18,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "700",
    letterSpacing: -0.4,
    color: COLORS.ink,
    textAlign: "center",
  },
  description: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 21,
    color: COLORS.muted,
    textAlign: "center",
  },
  email: {
    marginTop: 2,
    fontSize: 15,
    lineHeight: 21,
    color: COLORS.ink,
    textAlign: "center",
  },
  divider: {
    alignSelf: "stretch",
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.divider,
  },
  actions: {
    paddingHorizontal: CONTENT_HORIZONTAL_PADDING,
    paddingTop: 22,
  },
  action: {
    alignSelf: "stretch",
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.action,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  actionPressed: {
    backgroundColor: COLORS.actionPressed,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.2,
    color: COLORS.actionLabel,
  },
  secondary: {
    alignSelf: "stretch",
    marginTop: 8,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryPressed: {
    backgroundColor: COLORS.secondaryPressed,
  },
  secondaryLabel: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: -0.2,
    color: COLORS.ink,
  },
});

export { EmailVerificationBottomSheet };
export type { IEmailIcon, IEmailVerificationBottomSheet } from "./types";
export default memo(EmailVerificationBottomSheet);
