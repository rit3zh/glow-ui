import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useCallback, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, {
  Defs,
  LinearGradient as SvgGradient,
  Path,
  Stop,
} from "react-native-svg";
import { SquircleView } from "@/components/base/squircle-view";
import { Switch } from "@/components/primitives/switch";
import {
  AVATAR_SIZE,
  CARD_BORDER_WIDTH,
  CARD_CORNER_SMOOTHING,
  CARD_GAP,
  CARD_RADIUS,
  COLORS,
  CONTENT_BOTTOM_PADDING,
  CONTENT_HORIZONTAL_PADDING,
  CONTENT_TOP_PADDING,
  DEFAULT_PROFILE,
  DEFAULT_PROMO,
  DEFAULT_SECTIONS,
  DEFAULT_TITLE,
  FONT_FAMILY,
  HEADER_BUTTON_SIZE,
  HEADER_HEIGHT,
  LABEL_GAP,
  PROFILE_PADDING,
  PROMO_COLORS,
  PROMO_GAP,
  PROMO_ICON_SIZE,
  PROMO_PADDING,
  PROMO_RADIUS,
  ROW_HEIGHT,
  ROW_HORIZONTAL_PADDING,
  ROW_ICON_GAP,
  ROW_ICON_SIZE,
  SECTION_GAP,
  SEPARATOR_INSET,
  SPARKLE_COLORS,
} from "./const";
import type {
  IGlyph,
  IProfileSettingsV3,
  ISettingsRow,
  ISettingsRowItem,
} from "./types";

const SparkleGlyph: React.FC<IGlyph> = ({
  size = PROMO_ICON_SIZE,
  colors = SPARKLE_COLORS,
}: IGlyph) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Defs>
      <SvgGradient id="sparkle" x1="0" y1="0" x2="1" y2="2">
        <Stop offset="0" stopColor={colors[0]} />
        <Stop offset="1" stopColor={colors[1]} />
        <Stop offset="1" stopColor={colors[2]} />
      </SvgGradient>
    </Defs>
    <Path
      d="M12 1.5C12.7 7.1 16.9 11.3 22.5 12C16.9 12.7 12.7 16.9 12 22.5C11.3 16.9 7.1 12.7 1.5 12C7.1 11.3 11.3 7.1 12 1.5Z"
      fill="url(#sparkle)"
    />
  </Svg>
);

const SettingsRowItem: React.FC<ISettingsRowItem> = memo(
  ({
    id,
    title,
    icon,
    accessory = "chevron",
    value,
    isLast,
    checked = false,
    onPress,
    onToggle,
  }: ISettingsRowItem) => {
    const [isPressed, setIsPressed] = useState<boolean>(false);

    const handlePressIn = useCallback((): void => setIsPressed(true), []);
    const handlePressOut = useCallback((): void => setIsPressed(false), []);
    const handlePress = useCallback((): void => onPress?.(id), [id, onPress]);
    const handleCheckedChange = useCallback(
      (next: boolean): void => onToggle?.(id, next),
      [id, onToggle],
    );

    const isSwitch = accessory === "switch";

    return (
      <Pressable
        accessibilityRole={isSwitch ? "switch" : "button"}
        accessibilityLabel={title}
        accessibilityState={isSwitch ? { checked } : undefined}
        disabled={isSwitch}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.row, isPressed ? styles.rowPressed : null]}
      >
        <View style={styles.rowIcon}>
          <HugeiconsIcon icon={icon} size={ROW_ICON_SIZE} color={COLORS.icon} />
        </View>

        <Text style={styles.rowTitle} numberOfLines={1}>
          {title}
        </Text>

        {accessory === "value" && value ? (
          <Text style={styles.rowValue} numberOfLines={1}>
            {value}
          </Text>
        ) : null}

        {isSwitch ? (
          <Switch.Root
            size="sm"
            checked={checked}
            trackColor={COLORS.switchTrack}
            onCheckedChange={handleCheckedChange}
          >
            <Switch.Track>
              <Switch.Thumb />
            </Switch.Track>
          </Switch.Root>
        ) : accessory === "none" ? null : (
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            size={18}
            color={COLORS.accessory}
          />
        )}

        {isLast ? null : <View style={styles.separator} />}
      </Pressable>
    );
  },
);

const buildToggleState = (
  sections: IProfileSettingsV3["sections"],
): Record<string, boolean> => {
  const state: Record<string, boolean> = {};

  sections?.forEach((section) =>
    section.rows.forEach((row: ISettingsRow) => {
      if (row.accessory === "switch")
        state[row.id] = row.defaultChecked ?? false;
    }),
  );

  return state;
};

const ProfileSettingsV3: React.FC<IProfileSettingsV3> = ({
  title = DEFAULT_TITLE,
  profile = DEFAULT_PROFILE,
  promo = DEFAULT_PROMO,
  sections = DEFAULT_SECTIONS,
  hideBack = false,
  hideSearch = false,
  style,
  onBackPress,
  onSearchPress,
  onProfilePress,
  onPromoPress,
  onRowPress,
  onRowToggle,
}: IProfileSettingsV3) => {
  const [toggles, setToggles] = useState<Record<string, boolean>>(() =>
    buildToggleState(sections),
  );
  const [isProfilePressed, setIsProfilePressed] = useState<boolean>(false);

  const handleProfilePressIn = useCallback(
    (): void => setIsProfilePressed(true),
    [],
  );
  const handleProfilePressOut = useCallback(
    (): void => setIsProfilePressed(false),
    [],
  );

  const handleRowToggle = useCallback(
    (id: string, checked: boolean): void => {
      setToggles((prev) => ({ ...prev, [id]: checked }));
      onRowToggle?.(id, checked);
    },
    [onRowToggle],
  );

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        {hideBack ? (
          <View style={styles.headerSpacer} />
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={onBackPress}
            style={({ pressed }) => [
              styles.headerButton,
              pressed ? styles.headerButtonPressed : null,
            ]}
          >
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              size={20}
              color={COLORS.headerButtonIcon}
            />
          </Pressable>
        )}

        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        {hideSearch ? (
          <View style={styles.headerSpacer} />
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Search"
            onPress={onSearchPress}
            style={({ pressed }) => [
              styles.headerButton,
              pressed ? styles.headerButtonPressed : null,
            ]}
          >
            <HugeiconsIcon
              icon={Search01Icon}
              size={20}
              color={COLORS.headerButtonIcon}
            />
          </Pressable>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={profile.name}
          onPress={onProfilePress}
          onPressIn={handleProfilePressIn}
          onPressOut={handleProfilePressOut}
        >
          <SquircleView
            cornerRadius={CARD_RADIUS}
            cornerSmoothing={CARD_CORNER_SMOOTHING}
            backgroundColor={
              isProfilePressed ? COLORS.cardPressed : COLORS.card
            }
            borderColor={COLORS.cardBorder}
            borderWidth={CARD_BORDER_WIDTH}
          >
            <View style={styles.profile}>
              {profile.avatar ? (
                <Image
                  source={profile.avatar}
                  style={styles.avatar}
                  resizeMode="cover"
                  accessibilityIgnoresInvertColors
                />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]} />
              )}

              <View style={styles.profileText}>
                <Text style={styles.name} numberOfLines={1}>
                  {profile.name}
                </Text>
                {profile.email ? (
                  <Text style={styles.email} numberOfLines={1}>
                    {profile.email}
                  </Text>
                ) : null}
              </View>

              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={18}
                color={COLORS.accessory}
              />
            </View>
          </SquircleView>
        </Pressable>

        {promo ? (
          <LinearGradient
            colors={promo.colors ?? PROMO_COLORS}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.promo}
          >
            <SparkleGlyph />

            <View style={styles.promoText}>
              <Text style={styles.promoTitle} numberOfLines={1}>
                {promo.title}
              </Text>
              {promo.subtitle ? (
                <Text style={styles.promoSubtitle} numberOfLines={3}>
                  {promo.subtitle}
                </Text>
              ) : null}
            </View>

            {promo.actionLabel ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={promo.actionLabel}
                onPress={onPromoPress}
                style={({ pressed }) => [
                  styles.promoAction,
                  pressed ? styles.promoActionPressed : null,
                ]}
              >
                <Text style={styles.promoActionLabel} numberOfLines={1}>
                  {promo.actionLabel}
                </Text>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={14}
                  color={COLORS.promoActionLabel}
                />
              </Pressable>
            ) : null}
          </LinearGradient>
        ) : null}

        {sections.map((section) => (
          <View key={section.id} style={styles.section}>
            {section.label ? (
              <Text style={styles.label}>{section.label.toUpperCase()}</Text>
            ) : null}

            <SquircleView
              cornerRadius={CARD_RADIUS}
              cornerSmoothing={CARD_CORNER_SMOOTHING}
              backgroundColor={COLORS.card}
              borderColor={COLORS.cardBorder}
              borderWidth={CARD_BORDER_WIDTH}
            >
              {section.rows.map((row, index) => (
                <SettingsRowItem
                  key={row.id}
                  {...row}
                  isLast={index === section.rows.length - 1}
                  checked={toggles[row.id]}
                  onPress={onRowPress}
                  onToggle={handleRowToggle}
                />
              ))}
            </SquircleView>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.screen,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: CONTENT_HORIZONTAL_PADDING,
  },
  headerButton: {
    alignItems: "center",
    justifyContent: "center",
    width: HEADER_BUTTON_SIZE,
    height: HEADER_BUTTON_SIZE,
    borderRadius: HEADER_BUTTON_SIZE / 2,
    backgroundColor: COLORS.headerButton,
  },
  headerButtonPressed: {
    opacity: 0.7,
  },
  headerSpacer: {
    width: HEADER_BUTTON_SIZE,
    height: HEADER_BUTTON_SIZE,
  },
  title: {
    flex: 1,
    height: HEADER_HEIGHT,
    lineHeight: HEADER_HEIGHT,
    textAlign: "center",
    fontSize: 17,
    fontFamily: FONT_FAMILY,
    fontWeight: "600",
    letterSpacing: -0.3,
    color: COLORS.title,
  },
  content: {
    paddingHorizontal: CONTENT_HORIZONTAL_PADDING,
    paddingTop: CONTENT_TOP_PADDING,
    paddingBottom: CONTENT_BOTTOM_PADDING,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: PROFILE_PADDING,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  avatarPlaceholder: {
    backgroundColor: COLORS.avatar,
  },
  profileText: {
    flex: 1,
    minWidth: 0,
    marginLeft: CARD_GAP,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.15,
    color: COLORS.name,
    fontFamily: FONT_FAMILY,
  },
  email: {
    marginTop: 2,
    fontSize: 12.5,
    fontWeight: "400",
    color: COLORS.email,
  },
  promo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SECTION_GAP,
    padding: PROMO_PADDING,
    borderRadius: PROMO_RADIUS,
    overflow: "hidden",
  },
  promoText: {
    flex: 1,
    minWidth: 0,
    marginHorizontal: PROMO_GAP,
  },
  promoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.promoTitle,
    fontFamily: FONT_FAMILY,
  },
  promoSubtitle: {
    marginTop: 4,
    fontSize: 11.5,
    lineHeight: 16,
    fontWeight: "400",
    color: COLORS.promoSubtitle,
  },
  promoAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 14,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.promoAction,
  },
  promoActionPressed: {
    opacity: 0.8,
  },
  promoActionLabel: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: -0.2,
    color: COLORS.promoActionLabel,
  },
  section: {
    marginTop: SECTION_GAP,
  },
  label: {
    marginBottom: LABEL_GAP,
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.9,
    color: COLORS.label,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: ROW_HEIGHT,
    paddingHorizontal: ROW_HORIZONTAL_PADDING,
  },
  rowPressed: {
    backgroundColor: COLORS.cardPressed,
  },
  rowIcon: {
    width: ROW_ICON_SIZE,
    height: ROW_ICON_SIZE,
    marginRight: ROW_ICON_GAP,
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: -0.1,
    color: COLORS.rowTitle,
    fontFamily: FONT_FAMILY,
  },
  rowValue: {
    marginRight: 8,
    fontSize: 13.5,
    fontWeight: "400",
    color: COLORS.value,
  },
  separator: {
    position: "absolute",
    left: SEPARATOR_INSET,
    right: 0,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.separator,
  },
});

export { ProfileSettingsV3 };
export type {
  IGlyph,
  IProfileSettingsV3,
  ISettingsProfile,
  ISettingsPromo,
  ISettingsRow,
  ISettingsRowItem,
  ISettingsSection,
  TSettingsRowAccessory,
} from "./types";
export default memo(ProfileSettingsV3);
