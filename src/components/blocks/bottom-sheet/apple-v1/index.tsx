import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { G, Path } from "react-native-svg";
import type { IApplePayBottomSheet, IGlyph } from "./types";
import {
  APPLE_GROUP_TRANSFORM,
  APPLE_PATH,
  APPLE_VIEW_BOX,
  BACKDROP_OPACITY,
  COLORS,
  CONTENT_BOTTOM_PADDING,
  CONTENT_HORIZONTAL_PADDING,
  DEFAULT_ACTION_LABEL,
  DEFAULT_AMOUNT,
  DEFAULT_BRAND_LABEL,
  DEFAULT_CARD_CAPTION,
  DEFAULT_CARD_NAME,
  DEFAULT_DESCRIPTION,
  DEFAULT_FOOTNOTE,
  SHEET_CORNER_RADIUS,
  VISA_PATH,
  VISA_VIEW_BOX,
} from "./const";

const AppleGlyph: React.FC<IGlyph> = ({
  size = 30,
  color = COLORS.ink,
}: IGlyph) => (
  <Svg width={size} height={size} viewBox={APPLE_VIEW_BOX}>
    <G transform={APPLE_GROUP_TRANSFORM}>
      <Path fill={color} d={APPLE_PATH} />
    </G>
  </Svg>
);

const VisaGlyph: React.FC<IGlyph> = ({
  size = 30,
  color = COLORS.badgeMark,
}: IGlyph) => (
  <Svg width={size} height={size} viewBox={VISA_VIEW_BOX}>
    <Path fill={color} d={VISA_PATH} />
  </Svg>
);

const ApplePayBottomSheet: React.FC<IApplePayBottomSheet> = ({
  brandLabel = DEFAULT_BRAND_LABEL,
  description = DEFAULT_DESCRIPTION,
  cardName = DEFAULT_CARD_NAME,
  cardCaption = DEFAULT_CARD_CAPTION,
  amount = DEFAULT_AMOUNT,
  footnote = DEFAULT_FOOTNOTE,
  actionLabel = DEFAULT_ACTION_LABEL,
  openOnFocus = true,
  onCardPress,
  onActionPress,
  onClose,
}: IApplePayBottomSheet) => {
  const sheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const [isMounted, setIsMounted] = useState<boolean>(openOnFocus);
  const [isCardPressed, setIsCardPressed] = useState<boolean>(false);
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

  const handleChange = useCallback(
    (index: number): void => {
      if (index !== -1) return;
      setIsMounted(false);
      onClose?.();
    },
    [onClose],
  );

  const handleCardPressIn = useCallback((): void => setIsCardPressed(true), []);
  const handleCardPressOut = useCallback(
    (): void => setIsCardPressed(false),
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
        <View style={styles.brand}>
          <AppleGlyph />
          <Text style={styles.brandLabel}>{brandLabel}</Text>
        </View>

        <Text style={styles.description}>{description}</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${cardName} ${amount}`}
          onPress={onCardPress}
          onPressIn={handleCardPressIn}
          onPressOut={handleCardPressOut}
          style={[styles.card, isCardPressed ? styles.cardPressed : null]}
        >
          <View style={styles.badge}>
            <VisaGlyph />
          </View>

          <View style={styles.cardText}>
            <Text style={styles.cardName} numberOfLines={1}>
              {cardName}
            </Text>
            {cardCaption ? (
              <Text style={styles.cardCaption} numberOfLines={1}>
                {cardCaption}
              </Text>
            ) : null}
          </View>

          <Text style={styles.amount} numberOfLines={1}>
            {amount}
          </Text>
        </Pressable>

        <View style={styles.divider} />

        <Text style={styles.footnote}>{footnote}</Text>

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
    paddingTop: 26,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  brandLabel: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "600",
    letterSpacing: -1,
    color: COLORS.ink,
  },
  description: {
    alignSelf: "center",
    marginTop: 16,
    fontSize: 16,
    maxWidth: 280,
    lineHeight: 22,
    color: COLORS.body,
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 26,
    borderRadius: 12,
    paddingVertical: 8,
  },
  cardPressed: {
    backgroundColor: COLORS.rowPressed,
  },
  badge: {
    width: 46,
    height: 30,
    borderRadius: 6,
    backgroundColor: COLORS.badge,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  cardText: {
    flex: 1,
  },
  cardName: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "500",
    letterSpacing: -0.3,
    color: COLORS.body,
  },
  cardCaption: {
    marginTop: 2,
    fontSize: 15,
    lineHeight: 20,
    color: COLORS.muted,
  },
  amount: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "500",
    letterSpacing: -0.3,
    color: COLORS.body,
  },
  divider: {
    marginTop: 14,
    left: 60,
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.divider,
  },
  footnote: {
    alignSelf: "stretch",
    marginTop: 16,
    fontSize: 15,
    lineHeight: 21,
    color: COLORS.muted,
    textAlign: "center",
  },
  action: {
    alignSelf: "stretch",
    marginTop: 26,
    height: 56,
    borderRadius: 12,
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
    letterSpacing: -0.3,
    color: COLORS.actionLabel,
  },
});

export { ApplePayBottomSheet };
export type { IApplePayBottomSheet, IGlyph } from "./types";
export default memo(ApplePayBottomSheet);
