import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import { Image, Linking, Pressable, StyleSheet, Text } from "react-native";
import { useFocusEffect } from "expo-router";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import type { IAirBnbBottomSheetDiscount, ICloseIcon } from "./types";
import {
  BACKDROP_OPACITY,
  COLORS,
  CONTENT_BOTTOM_PADDING,
  DEFAULT_ACTION_LABEL,
  DEFAULT_ARTWORK_URI,
  DEFAULT_DESCRIPTION,
  DEFAULT_FOOTNOTE,
  DEFAULT_FOOTNOTE_LINK_LABEL,
  DEFAULT_FOOTNOTE_LINK_URL,
  DEFAULT_TITLE,
  SHEET_CORNER_RADIUS,
} from "./const";

const CloseIcon: React.FC<ICloseIcon> = ({
  size = 18,
  color = COLORS.ink,
}: ICloseIcon) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 6L18 18M18 6L6 18"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
    />
  </Svg>
);

const AirBnbBottomSheetDiscount: React.FC<IAirBnbBottomSheetDiscount> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  actionLabel = DEFAULT_ACTION_LABEL,
  footnote = DEFAULT_FOOTNOTE,
  footnoteLinkLabel = DEFAULT_FOOTNOTE_LINK_LABEL,
  footnoteLinkUrl = DEFAULT_FOOTNOTE_LINK_URL,
  artwork = { uri: DEFAULT_ARTWORK_URI },
  openOnFocus = true,
  onActionPress,
  onClose,
}: IAirBnbBottomSheetDiscount) => {
  const sheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const [isMounted, setIsMounted] = useState<boolean>(openOnFocus);
  const [isClosePressed, setIsClosePressed] = useState<boolean>(false);
  const [isActionPressed, setIsActionPressed] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      if (openOnFocus) setIsMounted(true);
      return () => {
        sheetRef.current?.close();
        setIsMounted(false);
      };
    }, [openOnFocus]),
  );

  const handleClose = useCallback((): void => {
    sheetRef.current?.close();
  }, []);

  const handleChange = useCallback(
    (index: number): void => {
      if (index !== -1) return;
      setIsMounted(false);
      onClose?.();
    },
    [onClose],
  );

  const handleClosePressIn = useCallback(
    (): void => setIsClosePressed(true),
    [],
  );
  const handleClosePressOut = useCallback(
    (): void => setIsClosePressed(false),
    [],
  );

  const handleActionPressIn = useCallback(
    (): void => setIsActionPressed(true),
    [],
  );
  const handleActionPressOut = useCallback(
    (): void => setIsActionPressed(false),
    [],
  );

  const handleFootnoteLinkPress = useCallback((): void => {
    if (footnoteLinkUrl) void Linking.openURL(footnoteLinkUrl);
  }, [footnoteLinkUrl]);

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
      handleComponent={null}
      backgroundStyle={styles.background}
      style={styles.sheet}
    >
      <BottomSheetView style={contentStyle}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={12}
          onPress={handleClose}
          onPressIn={handleClosePressIn}
          onPressOut={handleClosePressOut}
          style={[
            styles.closeButton,
            isClosePressed ? styles.closeButtonPressed : null,
          ]}
        >
          <CloseIcon />
        </Pressable>

        <Image source={artwork} style={styles.artwork} resizeMode="contain" />

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          onPress={onActionPress}
          onPressIn={handleActionPressIn}
          onPressOut={handleActionPressOut}
          style={[styles.action, isActionPressed ? styles.actionPressed : null]}
        >
          <Text style={styles.actionLabel} numberOfLines={1}>
            {actionLabel}
          </Text>
        </Pressable>

        <Text style={styles.footnote}>
          {footnote}
          {footnoteLinkLabel ? (
            <Text style={styles.footnoteLink} onPress={handleFootnoteLinkPress}>
              {footnoteLinkLabel}
            </Text>
          ) : null}
        </Text>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  sheet: {
    shadowColor: "#000000",
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -6 },
    elevation: 16,
  },
  background: {
    backgroundColor: COLORS.sheet,
    borderTopLeftRadius: SHEET_CORNER_RADIUS,
    borderTopRightRadius: SHEET_CORNER_RADIUS,
  },
  content: {
    alignSelf: "stretch",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  closeButton: {
    position: "absolute",
    top: 14,
    right: 16,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonPressed: {
    backgroundColor: COLORS.overlayPressed,
  },
  artwork: {
    width: 148,
    height: 148,
    marginTop: 24,
    marginBottom: 30,
  },
  title: {
    alignSelf: "stretch",
    maxWidth: 370,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "700",
    letterSpacing: -0.8,
    color: COLORS.ink,
    textAlign: "center",
  },
  description: {
    alignSelf: "stretch",
    marginTop: 16,
    fontSize: 16,
    lineHeight: 22,
    color: COLORS.muted,
    textAlign: "center",
  },
  action: {
    alignSelf: "stretch",
    marginTop: 28,
    height: 60,
    borderRadius: 16,
    backgroundColor: COLORS.action,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  actionPressed: {
    backgroundColor: COLORS.actionPressed,
  },
  actionLabel: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.2,
    color: COLORS.ink,
  },
  footnote: {
    marginTop: 20,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.subtle,
    textAlign: "center",
  },
  footnoteLink: {
    color: COLORS.subtle,
    textDecorationLine: "underline",
  },
});

export { AirBnbBottomSheetDiscount };
export default memo(AirBnbBottomSheetDiscount);
