import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import type { IAirBnbBottomSheetNotice, ICloseIcon } from "./types";
import {
  ARTWORK_SIZE,
  BACKDROP_OPACITY,
  COLORS,
  CONTENT_BOTTOM_PADDING,
  CONTENT_HORIZONTAL_PADDING,
  DEFAULT_ACTION_LABEL,
  DEFAULT_ARTWORK_URI,
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
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

const AirBnbBottomSheetNotice: React.FC<IAirBnbBottomSheetNotice> = ({
  title = DEFAULT_TITLE,
  actionLabel = DEFAULT_ACTION_LABEL,
  artwork = { uri: DEFAULT_ARTWORK_URI },
  hideCloseButton = false,
  openOnFocus = true,
  onActionPress,
  onClose,
}: IAirBnbBottomSheetNotice) => {
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
        {hideCloseButton ? null : (
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
        )}

        <View style={styles.header}>
          <Image
            source={artwork}
            style={styles.artwork}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />

          <Text style={styles.title}>{title}</Text>
        </View>

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
    paddingHorizontal: CONTENT_HORIZONTAL_PADDING,
    paddingTop: 4,
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 14,
    zIndex: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonPressed: {
    backgroundColor: COLORS.closePressed,
  },
  header: {
    alignItems: "center",
    paddingTop: 22,
  },
  artwork: {
    width: ARTWORK_SIZE,
    height: ARTWORK_SIZE,
  },
  title: {
    alignSelf: "center",
    marginTop: 34,
    fontSize: 21,
    maxWidth: 260,
    lineHeight: 28,
    fontWeight: "700",
    letterSpacing: -0.4,
    color: COLORS.ink,
    textAlign: "center",
  },
  action: {
    alignSelf: "stretch",
    marginTop: 30,
    height: 52,
    borderRadius: 10,
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
    fontWeight: "600",
    letterSpacing: -0.2,
    color: COLORS.actionLabel,
  },
});

export { AirBnbBottomSheetNotice };
export type { IAirBnbBottomSheetNotice, ICloseIcon } from "./types";
export default memo(AirBnbBottomSheetNotice);
