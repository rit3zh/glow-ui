import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import type { IAddAddressBottomSheet, IGlyph } from "./types";
import {
  BACKDROP_OPACITY,
  CLOSE_SIZE,
  COLORS,
  CONTENT_BOTTOM_PADDING,
  CONTENT_HORIZONTAL_PADDING,
  CONTENT_TOP_PADDING,
  DEFAULT_ADD_ADDRESS_TITLE,
  DEFAULT_COUNTRY,
  DEFAULT_COUNTRY_LABEL,
  DEFAULT_LOCATION_CAPTION,
  DEFAULT_LOCATION_TITLE,
  DEFAULT_STREET_PLACEHOLDER,
  DEFAULT_TITLE,
  FIELD_GAP,
  FIELD_RADIUS,
  LOCATION_PATH,
  LOCATION_VIEW_BOX,
  ROW_GAP,
  ROW_MARK_SIZE,
  SHEET_BOTTOM_GAP,
  SHEET_CORNER_RADIUS,
  SHEET_HORIZONTAL_MARGIN,
  STREET_FIELD_HEIGHT,
} from "./const";

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

const ChevronDownGlyph: React.FC<IGlyph> = ({
  size = 20,
  color = COLORS.chevron,
}: IGlyph) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 9.5L12 15.5L18 9.5"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const LocationGlyph: React.FC<IGlyph> = ({
  size = 25,
  color = COLORS.ink,
}: IGlyph) => (
  <Svg width={size} height={size} viewBox={LOCATION_VIEW_BOX}>
    <Path fill={color} d={LOCATION_PATH} />
  </Svg>
);

const PlusGlyph: React.FC<IGlyph> = ({
  size = 22,
  color = COLORS.ink,
}: IGlyph) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 5V19M5 12H19"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
    />
  </Svg>
);

const AddAddressBottomSheet: React.FC<IAddAddressBottomSheet> = ({
  title = DEFAULT_TITLE,
  countryLabel = DEFAULT_COUNTRY_LABEL,
  country = DEFAULT_COUNTRY,
  streetPlaceholder = DEFAULT_STREET_PLACEHOLDER,
  streetValue = "",
  locationTitle = DEFAULT_LOCATION_TITLE,
  locationCaption = DEFAULT_LOCATION_CAPTION,
  addAddressTitle = DEFAULT_ADD_ADDRESS_TITLE,
  hideCloseButton = false,
  openOnFocus = true,
  onCountryPress,
  onStreetChange,
  onLocationPress,
  onAddAddressPress,
  onClose,
}: IAddAddressBottomSheet) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();
  const [street, setStreet] = useState<string>(streetValue);
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

  const handleStreetChange = useCallback(
    (value: string): void => {
      setStreet(value);
      onStreetChange?.(value);
    },
    [onStreetChange],
  );

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
    () => insets.bottom + SHEET_BOTTOM_GAP,
    [insets.bottom],
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      detached
      bottomInset={bottomInset}
      enablePanDownToClose
      enableDynamicSizing
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      onDismiss={onClose}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.handleIndicator}
      backgroundStyle={styles.background}
      style={styles.sheet}
    >
      <BottomSheetView style={styles.content}>
        <View style={styles.form}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>

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

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${countryLabel}: ${country}`}
            onPress={onCountryPress}
            onPressIn={() => setPressedKey("country")}
            onPressOut={handlePressOut}
            style={[
              styles.countryField,
              pressedKey === "country" ? styles.fieldPressed : null,
            ]}
          >
            <View style={styles.countryText}>
              <Text style={styles.countryLabel} numberOfLines={1}>
                {countryLabel}
              </Text>
              <Text style={styles.countryValue} numberOfLines={1}>
                {country}
              </Text>
            </View>

            <ChevronDownGlyph />
          </Pressable>

          <View style={styles.streetField}>
            <BottomSheetTextInput
              value={street}
              onChangeText={handleStreetChange}
              placeholder={streetPlaceholder}
              placeholderTextColor={COLORS.muted}
              style={styles.streetInput}
              autoCorrect={false}
              autoCapitalize="words"
              returnKeyType="done"
            />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.rows}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={locationTitle}
            onPress={onLocationPress}
            onPressIn={() => setPressedKey("location")}
            onPressOut={handlePressOut}
            style={styles.row}
          >
            <View
              style={[
                styles.rowMark,
                pressedKey === "location" ? styles.rowMarkPressed : null,
              ]}
            >
              <LocationGlyph />
            </View>

            <View style={styles.rowText}>
              <Text style={styles.rowTitle} numberOfLines={1}>
                {locationTitle}
              </Text>
              {locationCaption ? (
                <Text style={styles.rowCaption} numberOfLines={1}>
                  {locationCaption}
                </Text>
              ) : null}
            </View>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={addAddressTitle}
            onPress={onAddAddressPress}
            onPressIn={() => setPressedKey("add")}
            onPressOut={handlePressOut}
            style={styles.row}
          >
            <View
              style={[
                styles.rowMark,
                pressedKey === "add" ? styles.rowMarkPressed : null,
              ]}
            >
              <PlusGlyph />
            </View>

            <View style={styles.rowText}>
              <Text style={styles.rowTitle} numberOfLines={1}>
                {addAddressTitle}
              </Text>
            </View>
          </Pressable>
        </View>
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
  handleIndicator: {
    backgroundColor: COLORS.handle,
    width: 34,
    height: 4,
  },
  content: {
    alignSelf: "stretch",
    paddingTop: CONTENT_TOP_PADDING,
    paddingBottom: CONTENT_BOTTOM_PADDING,
  },

  form: {
    paddingHorizontal: CONTENT_HORIZONTAL_PADDING,
    paddingBottom: 22,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "600",
    letterSpacing: -0.5,
    color: COLORS.ink,
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
  countryField: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: FIELD_RADIUS,
    borderWidth: 1,
    borderColor: COLORS.fieldBorder,
    backgroundColor: COLORS.field,
  },
  fieldPressed: {
    backgroundColor: COLORS.fieldPressed,
  },
  countryText: {
    flex: 1,
  },
  countryLabel: {
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.muted,
  },
  countryValue: {
    marginTop: 1,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "600",
    letterSpacing: -0.3,
    color: COLORS.ink,
  },
  streetField: {
    justifyContent: "center",
    marginTop: FIELD_GAP,
    height: STREET_FIELD_HEIGHT,
    paddingHorizontal: 16,
    borderRadius: FIELD_RADIUS,
    borderWidth: 1,
    borderColor: COLORS.fieldBorder,
    backgroundColor: COLORS.field,
  },
  streetInput: {
    fontSize: 17,
    lineHeight: 22,
    color: COLORS.ink,
    padding: 0,
  },
  divider: {
    alignSelf: "stretch",
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.divider,
  },
  rows: {
    paddingTop: 18,
    paddingHorizontal: CONTENT_HORIZONTAL_PADDING,
    gap: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: ROW_GAP,
    paddingVertical: 8,
  },
  rowMark: {
    width: ROW_MARK_SIZE,
    height: ROW_MARK_SIZE,
    borderRadius: ROW_MARK_SIZE / 2,
    backgroundColor: COLORS.mark,
    alignItems: "center",
    justifyContent: "center",
  },
  rowMarkPressed: {
    backgroundColor: COLORS.markPressed,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700",
    letterSpacing: -0.3,
    color: COLORS.ink,
  },
  rowCaption: {
    marginTop: 1,
    fontSize: 15,
    lineHeight: 20,
    color: COLORS.caption,
  },
});

export { AddAddressBottomSheet };
export type { IAddAddressBottomSheet, IGlyph } from "./types";
export default memo(AddAddressBottomSheet);
