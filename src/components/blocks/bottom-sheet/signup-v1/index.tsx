import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { G, Path } from "react-native-svg";
import type { IGlyph, ISignUpBottomSheet } from "./types";
import {
  APPLE_PATH,
  APPLE_VIEW_BOX,
  BACKDROP_OPACITY,
  BUTTON_GAP,
  BUTTON_HEIGHT,
  BUTTON_RADIUS,
  CLOSE_SIZE,
  COLORS,
  CONTENT_BOTTOM_PADDING,
  CONTENT_HORIZONTAL_PADDING,
  CONTENT_TOP_PADDING,
  DEFAULT_DESCRIPTION,
  DEFAULT_PRIMARY_LABEL,
  DEFAULT_SECONDARY_LABEL,
  DEFAULT_TITLE,
  GOOGLE_GROUP_TRANSFORM,
  GOOGLE_PATH,
  GOOGLE_VIEW_BOX,
  SHEET_BOTTOM_GAP,
  SHEET_CORNER_RADIUS,
  SHEET_HORIZONTAL_MARGIN,
  SPARKLE_PATH,
  SPARKLE_VIEW_BOX,
  TILE_RADIUS,
  TILE_SIZE,
} from "./const";

const SparkleGlyph: React.FC<IGlyph> = ({
  size = 32,
  color = COLORS.ink,
}: IGlyph) => (
  <Svg width={size} height={size} viewBox={SPARKLE_VIEW_BOX}>
    <Path fill={color} d={SPARKLE_PATH} />
  </Svg>
);

const AppleGlyph: React.FC<IGlyph> = ({
  size = 22,
  color = COLORS.ink,
}: IGlyph) => (
  <Svg width={size} height={size} viewBox={APPLE_VIEW_BOX}>
    <Path fill={color} d={APPLE_PATH} />
  </Svg>
);

const GoogleGlyph: React.FC<IGlyph> = ({
  size = 18,
  color = COLORS.ink,
}: IGlyph) => (
  <Svg width={size} height={size} viewBox={GOOGLE_VIEW_BOX}>
    <G transform={GOOGLE_GROUP_TRANSFORM}>
      <Path fill={color} d={GOOGLE_PATH} />
    </G>
  </Svg>
);

const CloseGlyph: React.FC<IGlyph> = ({
  size = 20,
  color = COLORS.closeMark,
}: IGlyph) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 6L18 18M18 6L6 18"
      stroke={color}
      strokeWidth={2.4}
      strokeLinecap="round"
    />
  </Svg>
);

const SignUpBottomSheet: React.FC<ISignUpBottomSheet> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  primaryLabel = DEFAULT_PRIMARY_LABEL,
  secondaryLabel = DEFAULT_SECONDARY_LABEL,
  hideProviders = false,
  hideCloseButton = false,
  openOnFocus = true,
  onPrimaryPress,
  onSecondaryPress,
  onApplePress,
  onGooglePress,
  onClose,
}: ISignUpBottomSheet) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (openOnFocus) sheetRef.current?.present();
      return () => sheetRef.current?.dismiss();
    }, [openOnFocus]),
  );

  const handleClose = useCallback((): void => {
    sheetRef.current?.dismiss();
  }, []);

  const handlePressOut = useCallback((): void => setPressedKey(null), []);

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

  const bottomInset = useMemo(
    () => insets.bottom - 16 + SHEET_BOTTOM_GAP,
    [insets.bottom],
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      detached
      bottomInset={bottomInset}
      enablePanDownToClose
      enableDynamicSizing
      onDismiss={onClose}
      backdropComponent={renderBackdrop}
      handleComponent={null}
      backgroundStyle={styles.background}
      style={styles.sheet}
    >
      <BottomSheetView style={styles.content}>
        <View style={styles.header}>
          <View style={styles.tile}>
            <SparkleGlyph />
          </View>

          {hideCloseButton ? null : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={12}
              onPress={handleClose}
              onPressIn={() => setPressedKey("close")}
              onPressOut={handlePressOut}
              style={[
                styles.close,
                pressedKey === "close" ? styles.closePressed : null,
              ]}
            >
              <CloseGlyph />
            </Pressable>
          )}
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={primaryLabel}
          onPress={onPrimaryPress}
          onPressIn={() => setPressedKey("primary")}
          onPressOut={handlePressOut}
          style={[
            styles.primary,
            pressedKey === "primary" ? styles.primaryPressed : null,
          ]}
        >
          <Text style={styles.primaryLabel} numberOfLines={1}>
            {primaryLabel}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={secondaryLabel}
          onPress={onSecondaryPress}
          onPressIn={() => setPressedKey("secondary")}
          onPressOut={handlePressOut}
          style={[
            styles.secondary,
            pressedKey === "secondary" ? styles.surfacePressed : null,
          ]}
        >
          <Text style={styles.secondaryLabel} numberOfLines={1}>
            {secondaryLabel}
          </Text>
        </Pressable>

        {hideProviders ? null : (
          <View style={styles.providers}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Continue with Apple"
              onPress={onApplePress}
              onPressIn={() => setPressedKey("apple")}
              onPressOut={handlePressOut}
              style={[
                styles.provider,
                pressedKey === "apple" ? styles.surfacePressed : null,
              ]}
            >
              <AppleGlyph />
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Continue with Google"
              onPress={onGooglePress}
              onPressIn={() => setPressedKey("google")}
              onPressOut={handlePressOut}
              style={[
                styles.provider,
                pressedKey === "google" ? styles.surfacePressed : null,
              ]}
            >
              <GoogleGlyph />
            </Pressable>
          </View>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  sheet: {
    marginHorizontal: SHEET_HORIZONTAL_MARGIN,
    shadowColor: "#000000",
    shadowOpacity: 0.16,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 8 },
    elevation: 16,
  },

  background: {
    backgroundColor: COLORS.sheet,
    borderRadius: SHEET_CORNER_RADIUS,
  },
  content: {
    alignSelf: "stretch",
    paddingHorizontal: CONTENT_HORIZONTAL_PADDING,
    paddingTop: CONTENT_TOP_PADDING,
    paddingBottom: CONTENT_BOTTOM_PADDING,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: 90,
    backgroundColor: COLORS.tile,
    alignItems: "center",
    justifyContent: "center",
  },
  close: {
    width: CLOSE_SIZE,
    height: CLOSE_SIZE,
    borderRadius: CLOSE_SIZE / 2,
    backgroundColor: COLORS.close,
    alignItems: "center",
    justifyContent: "center",
  },
  closePressed: {
    backgroundColor: COLORS.closePressed,
  },
  title: {
    alignSelf: "stretch",
    marginTop: 22,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "700",
    letterSpacing: -0.6,
    color: COLORS.ink,
  },
  description: {
    alignSelf: "stretch",
    marginTop: 8,
    fontSize: 15.5,
    lineHeight: 21,
    color: COLORS.muted,
  },
  primary: {
    alignSelf: "stretch",
    marginTop: 20,
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_RADIUS,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  primaryPressed: {
    backgroundColor: COLORS.primaryPressed,
  },
  primaryLabel: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.3,
    color: COLORS.primaryLabel,
  },
  secondary: {
    alignSelf: "stretch",
    marginTop: BUTTON_GAP,
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_RADIUS,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  secondaryLabel: {
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.3,
    color: COLORS.ink,
  },
  surfacePressed: {
    backgroundColor: COLORS.surfacePressed,
  },
  providers: {
    flexDirection: "row",
    gap: BUTTON_GAP,
    marginTop: BUTTON_GAP,
  },
  provider: {
    flex: 1,
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_RADIUS,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});

export { SignUpBottomSheet };
export type { IGlyph, ISignUpBottomSheet } from "./types";
export default memo(SignUpBottomSheet);
