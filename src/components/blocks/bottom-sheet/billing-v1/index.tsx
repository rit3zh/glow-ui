import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import type {
  BillingBrand,
  IBillingBottomSheet,
  IBrandIcon,
  IChevronIcon,
} from "./types";
import {
  BACKDROP_OPACITY,
  COLORS,
  CONTENT_BOTTOM_PADDING,
  DEFAULT_CURRENCY_SYMBOL,
  DEFAULT_PERIOD_LABEL,
  DEFAULT_SEARCH_PLACEHOLDER,
  DEFAULT_SUBSCRIPTIONS,
  DEFAULT_SUBTITLE,
  DEFAULT_VIEW_ALL_LABEL,
  SHEET_CORNER_RADIUS,
} from "./const";

const SpotifyIcon: React.FC<IBrandIcon> = ({ size = 34 }: IBrandIcon) => (
  <Svg width={size} height={size} viewBox="0 0 1333.33 1333.3">
    <Path
      fill="#1ed760"
      d="M666.66 0C298.48 0 0 298.47 0 666.65c0 368.19 298.48 666.65 666.66 666.65 368.22 0 666.67-298.45 666.67-666.65C1333.33 298.49 1034.88.03 666.65.03l.01-.04zm305.73 961.51c-11.94 19.58-37.57 25.8-57.16 13.77-156.52-95.61-353.57-117.26-585.63-64.24-22.36 5.09-44.65-8.92-49.75-31.29-5.12-22.37 8.84-44.66 31.26-49.75 253.95-58.02 471.78-33.04 647.51 74.35 19.59 12.02 25.8 37.57 13.77 57.16zm81.6-181.52c-15.05 24.45-47.05 32.17-71.49 17.13-179.2-110.15-452.35-142.05-664.31-77.7-27.49 8.3-56.52-7.19-64.86-34.63-8.28-27.49 7.22-56.46 34.66-64.82 242.11-73.46 543.1-37.88 748.89 88.58 24.44 15.05 32.16 47.05 17.12 71.46V780zm7.01-189.02c-214.87-127.62-569.36-139.35-774.5-77.09-32.94 9.99-67.78-8.6-77.76-41.55-9.98-32.96 8.6-67.77 41.56-77.78 235.49-71.49 626.96-57.68 874.34 89.18 29.69 17.59 39.41 55.85 21.81 85.44-17.52 29.63-55.89 39.4-85.42 21.8h-.03z"
    />
  </Svg>
);

const ChatGptIcon: React.FC<IBrandIcon> = ({ size = 34 }: IBrandIcon) => (
  <Svg width={size} height={size} viewBox="0 0 512 509.639">
    <Path
      fill="#ffffff"
      d="M115.612 0h280.775C459.974 0 512 52.026 512 115.612v278.415c0 63.587-52.026 115.613-115.613 115.613H115.612C52.026 509.64 0 457.614 0 394.027V115.612C0 52.026 52.026 0 115.612 0z"
    />
    <Path
      fill="#111111"
      d="M412.037 221.764a90.834 90.834 0 004.648-28.67 90.79 90.79 0 00-12.443-45.87c-16.37-28.496-46.738-46.089-79.605-46.089-6.466 0-12.943.683-19.264 2.04a90.765 90.765 0 00-67.881-30.515h-.576c-.059.002-.149.002-.216.002-39.807 0-75.108 25.686-87.346 63.554-25.626 5.239-47.748 21.31-60.682 44.03a91.873 91.873 0 00-12.407 46.077 91.833 91.833 0 0023.694 61.553 90.802 90.802 0 00-4.649 28.67 90.804 90.804 0 0012.442 45.87c16.369 28.504 46.74 46.087 79.61 46.087a91.81 91.81 0 0019.253-2.04 90.783 90.783 0 0067.887 30.516h.576l.234-.001c39.829 0 75.119-25.686 87.357-63.588 25.626-5.242 47.748-21.312 60.682-44.033a91.718 91.718 0 0012.383-46.035 91.83 91.83 0 00-23.693-61.553l-.004-.005zM275.102 413.161h-.094a68.146 68.146 0 01-43.611-15.8 56.936 56.936 0 002.155-1.221l72.54-41.901a11.799 11.799 0 005.962-10.251V241.651l30.661 17.704c.326.163.55.479.596.84v84.693c-.042 37.653-30.554 68.198-68.21 68.273h.001zm-146.689-62.649a68.128 68.128 0 01-9.152-34.085c0-3.904.341-7.817 1.005-11.663.539.323 1.48.897 2.155 1.285l72.54 41.901a11.832 11.832 0 0011.918-.002l88.563-51.137v35.408a1.1 1.1 0 01-.438.94l-73.33 42.339a68.43 68.43 0 01-34.11 9.12 68.359 68.359 0 01-59.15-34.11l-.001.004zm-19.083-158.36a68.044 68.044 0 0135.538-29.934c0 .625-.036 1.731-.036 2.5v83.801l-.001.07a11.79 11.79 0 005.954 10.242l88.564 51.13-30.661 17.704a1.096 1.096 0 01-1.034.093l-73.337-42.375a68.36 68.36 0 01-34.095-59.143 68.412 68.412 0 019.112-34.085l-.004-.003zm251.907 58.621l-88.563-51.137 30.661-17.697a1.097 1.097 0 011.034-.094l73.337 42.339c21.109 12.195 34.132 34.746 34.132 59.132 0 28.604-17.849 54.199-44.686 64.078v-86.308c.004-.032.004-.065.004-.096 0-4.219-2.261-8.119-5.919-10.217zm30.518-45.93c-.539-.331-1.48-.898-2.155-1.286l-72.54-41.901a11.842 11.842 0 00-5.958-1.611c-2.092 0-4.15.558-5.957 1.611l-88.564 51.137v-35.408l-.001-.061a1.1 1.1 0 01.44-.88l73.33-42.303a68.301 68.301 0 0134.108-9.129c37.704 0 68.281 30.577 68.281 68.281a68.69 68.69 0 01-.984 11.545v.005zm-191.843 63.109l-30.668-17.704a1.09 1.09 0 01-.596-.84v-84.692c.016-37.685 30.593-68.236 68.281-68.236a68.332 68.332 0 0143.689 15.804 63.09 63.09 0 00-2.155 1.222l-72.54 41.9a11.794 11.794 0 00-5.961 10.248v.068l-.05 102.23zm16.655-35.91l39.445-22.782 39.444 22.767v45.55l-39.444 22.767-39.445-22.767v-45.535z"
    />
  </Svg>
);

const CursorIcon: React.FC<IBrandIcon> = ({ size = 34 }: IBrandIcon) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill="#111111"
      d="m20.42,6.73L12.42,2.11c-.26-.15-.57-.15-.83,0L3.58,6.73c-.22.12-.35.36-.35.61v9.32c0,.25.13.48.35.61l8.01,4.62c.26.15.57.15.83,0l8.01-4.62c.22-.12.35-.36.35-.61V7.34c0-.25-.13-.48-.35-.61h0Zm-.5.98h0s-7.73,13.39-7.73,13.39c-.05.09-.19.05-.19-.05v-8.77c0-.18-.09-.34-.25-.43l-7.59-4.38c-.09-.05-.05-.19.05-.19h15.46c.22,0,.36.24.25.43Z"
    />
  </Svg>
);

const SearchIcon: React.FC<IBrandIcon> = ({ size = 18 }: IBrandIcon) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35"
      stroke={COLORS.muted}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ChevronIcon: React.FC<IChevronIcon> = ({
  size = 18,
  direction = "down",
}: IChevronIcon) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d={direction === "down" ? "M6 9l6 6 6-6" : "M9 6l6 6-6 6"}
      stroke={COLORS.ink}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const BRAND_ICONS: Record<BillingBrand, React.FC<IBrandIcon>> = {
  spotify: SpotifyIcon,
  chatgpt: ChatGptIcon,
  cursor: CursorIcon,
};

const BillingBottomSheet: React.FC<IBillingBottomSheet> = ({
  total,
  subtitle = DEFAULT_SUBTITLE,
  currencySymbol = DEFAULT_CURRENCY_SYMBOL,
  searchPlaceholder = DEFAULT_SEARCH_PLACEHOLDER,
  periodLabel = DEFAULT_PERIOD_LABEL,
  viewAllLabel = DEFAULT_VIEW_ALL_LABEL,
  subscriptions = DEFAULT_SUBSCRIPTIONS,
  openOnFocus = true,
  onPeriodPress,
  onViewAllPress,
  onSubscriptionPress,
  onClose,
}: IBillingBottomSheet) => {
  const sheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const [isMounted, setIsMounted] = useState<boolean>(openOnFocus);
  const [query, setQuery] = useState<string>("");
  const [pressedId, setPressedId] = useState<string | null>(null);

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

  const visibleSubscriptions = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return subscriptions;
    return subscriptions.filter((item) =>
      item.name.toLowerCase().includes(needle),
    );
  }, [query, subscriptions]);

  const totalAmount = useMemo(() => {
    if (typeof total === "number") return total;
    return subscriptions.reduce((sum, item) => sum + item.amount, 0);
  }, [subscriptions, total]);

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
        <Text style={styles.total}>
          -{totalAmount}
          {currencySymbol}
        </Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.searchField}>
          <SearchIcon />
          <BottomSheetTextInput
            value={query}
            onChangeText={setQuery}
            placeholder={searchPlaceholder}
            placeholderTextColor={COLORS.muted}
            style={styles.searchInput}
            autoCorrect={false}
            returnKeyType="search"
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.periodRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={periodLabel}
            hitSlop={8}
            onPress={onPeriodPress}
            style={styles.periodLeft}
          >
            <ChevronIcon direction="down" size={20} />
            <Text style={styles.periodLabel}>{periodLabel}</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={viewAllLabel}
            hitSlop={8}
            onPress={onViewAllPress}
            style={styles.viewAll}
          >
            <Text style={styles.viewAllLabel}>{viewAllLabel}</Text>
            <ChevronIcon direction="right" size={16} />
          </Pressable>
        </View>

        <View style={styles.divider} />

        <View style={styles.list}>
          {visibleSubscriptions.map((item) => {
            const BrandIcon = item.brand ? BRAND_ICONS[item.brand] : null;
            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityLabel={item.name}
                onPress={() => onSubscriptionPress?.(item)}
                onPressIn={() => setPressedId(item.id)}
                onPressOut={() => setPressedId(null)}
                style={[
                  styles.row,
                  pressedId === item.id ? styles.rowPressed : null,
                ]}
              >
                <View style={styles.rowMark}>
                  {BrandIcon ? <BrandIcon /> : null}
                </View>

                <View style={styles.rowText}>
                  <Text style={styles.rowName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  {item.caption ? (
                    <Text style={styles.rowCaption} numberOfLines={1}>
                      {item.caption}
                    </Text>
                  ) : null}
                </View>

                <Text style={styles.rowAmount}>
                  -{item.amount}
                  {currencySymbol}
                </Text>
              </Pressable>
            );
          })}
        </View>
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
  handleIndicator: {
    backgroundColor: COLORS.handle,
    width: 40,
    height: 5,
  },
  content: {
    alignSelf: "stretch",
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  total: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "700",
    letterSpacing: -1,
    color: COLORS.ink,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 16,
    lineHeight: 22,
    color: COLORS.muted,
    textAlign: "center",
  },
  searchField: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
    height: 46,
    borderRadius: 23,
    paddingHorizontal: 16,
    backgroundColor: COLORS.field,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.ink,
    padding: 0,
  },
  divider: {
    marginTop: 16,
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.divider,
  },
  periodRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  periodLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  periodLabel: {
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.2,
    color: COLORS.ink,
  },
  viewAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  viewAllLabel: {
    fontSize: 16,
    color: COLORS.ink,
  },
  list: {
    marginTop: 12,
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    height: 66,
    borderRadius: 33,
    paddingHorizontal: 14,
    backgroundColor: COLORS.row,
  },
  rowPressed: {
    backgroundColor: COLORS.rowPressed,
  },
  rowMark: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  rowText: {
    flex: 1,
  },
  rowName: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.2,
    color: COLORS.ink,
  },
  rowCaption: {
    marginTop: 1,
    fontSize: 13,
    color: COLORS.muted,
  },
  rowAmount: {
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.2,
    color: COLORS.ink,
  },
});

export { BillingBottomSheet };
export type {
  BillingBrand,
  IBillingBottomSheet,
  IBillingSubscription,
} from "./types";
export default memo(BillingBottomSheet);
