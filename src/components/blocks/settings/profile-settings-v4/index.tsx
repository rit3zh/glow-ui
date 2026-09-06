import {
  ArrowRight01Icon,
  Delete02Icon,
  Logout03Icon,
  PencilEdit02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
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
import { SquircleView } from "@/components/base/squircle-view";
import { Switch } from "@/components/primitives/switch";
import {
  AVATAR_SIZE,
  CARD_BORDER_WIDTH,
  CARD_CORNER_SMOOTHING,
  CARD_RADIUS,
  COLORS,
  CONTENT_BOTTOM_PADDING,
  CONTENT_HORIZONTAL_PADDING,
  CONTENT_TOP_PADDING,
  DEFAULT_DELETE_LABEL,
  DEFAULT_LOGOUT_LABEL,
  DEFAULT_PROFILE,
  DEFAULT_SECTIONS,
  DEFAULT_SUBTITLE,
  DEFAULT_TITLE,
  DEFAULT_VERSION_LABEL,
  DELETE_GAP,
  DELETE_HEIGHT,
  DELETE_MARGIN_TOP,
  DELETE_RADIUS,
  EDIT_SIZE,
  FONT_FAMILY,
  HEADER_MARGIN_BOTTOM,
  LABEL_GAP,
  LOGOUT_GAP,
  LOGOUT_HEIGHT,
  LOGOUT_MARGIN_TOP,
  LOGOUT_RADIUS,
  PROFILE_GAP,
  PROFILE_PADDING,
  ROW_HEIGHT,
  ROW_HORIZONTAL_PADDING,
  ROW_ICON_GAP,
  ROW_ICON_SIZE,
  SECTION_GAP,
  SEPARATOR_INSET,
  SUBTITLE_MARGIN_TOP,
} from "./const";
import type {
  IProfileSettingsV4,
  ISettingsRow,
  ISettingsRowItem,
} from "./types";

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
            size={17}
            color={COLORS.accessory}
          />
        )}

        {isLast ? null : <View style={styles.separator} />}
      </Pressable>
    );
  },
);

const buildToggleState = (
  sections: IProfileSettingsV4["sections"],
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

const ProfileSettingsV4: React.FC<IProfileSettingsV4> = ({
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
  profile = DEFAULT_PROFILE,
  sections = DEFAULT_SECTIONS,
  logoutLabel = DEFAULT_LOGOUT_LABEL,
  deleteLabel = DEFAULT_DELETE_LABEL,
  versionLabel = DEFAULT_VERSION_LABEL,
  hideEdit = false,
  hideDelete = false,
  style,
  onEditPress,
  onRowPress,
  onRowToggle,
  onLogoutPress,
  onDeletePress,
}: IProfileSettingsV4) => {
  const [toggles, setToggles] = useState<Record<string, boolean>>(() =>
    buildToggleState(sections),
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
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + CONTENT_TOP_PADDING + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        <SquircleView
          cornerRadius={CARD_RADIUS}
          cornerSmoothing={CARD_CORNER_SMOOTHING}
          backgroundColor={COLORS.card}
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

            {hideEdit ? null : (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Edit profile"
                onPress={onEditPress}
                style={({ pressed }) => [
                  styles.edit,
                  pressed ? styles.pressedSubtle : null,
                ]}
              >
                <HugeiconsIcon
                  icon={PencilEdit02Icon}
                  size={17}
                  color={COLORS.editIcon}
                />
              </Pressable>
            )}
          </View>
        </SquircleView>

        {sections.map((section) => (
          <View key={section.id} style={styles.section}>
            {section.label ? (
              <Text style={styles.label}>{section.label}</Text>
            ) : null}

            <SquircleView
              cornerRadius={CARD_RADIUS}
              cornerSmoothing={CARD_CORNER_SMOOTHING}
              backgroundColor={COLORS.card}
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

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={logoutLabel}
          onPress={onLogoutPress}
          style={styles.logout}
        >
          <HugeiconsIcon
            icon={Logout03Icon}
            size={19}
            color={COLORS.logoutLabel}
          />
          <Text style={styles.logoutLabel} numberOfLines={1}>
            {logoutLabel}
          </Text>
        </Pressable>

        {hideDelete ? null : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={deleteLabel}
            onPress={onDeletePress}
            style={styles.deleteButton}
          >
            <HugeiconsIcon
              icon={Delete02Icon}
              size={19}
              color={COLORS.deleteLabel}
            />
            <Text style={styles.deleteLabel} numberOfLines={1}>
              {deleteLabel}
            </Text>
          </Pressable>
        )}

        {versionLabel ? (
          <Text style={styles.version}>{versionLabel}</Text>
        ) : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.screen,
  },
  pressedSubtle: {
    opacity: 0.55,
  },
  content: {
    paddingHorizontal: CONTENT_HORIZONTAL_PADDING,
    paddingBottom: CONTENT_BOTTOM_PADDING,
  },
  header: {
    marginBottom: HEADER_MARGIN_BOTTOM,
  },
  title: {
    fontFamily: FONT_FAMILY,
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: -0.9,
    color: COLORS.title,
  },
  subtitle: {
    marginTop: SUBTITLE_MARGIN_TOP,
    fontFamily: FONT_FAMILY,
    fontSize: 13.5,
    fontWeight: "400",
    letterSpacing: -0.1,
    color: COLORS.subtitle,
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
    marginLeft: PROFILE_GAP,
  },
  name: {
    fontFamily: FONT_FAMILY,
    fontSize: 17.5,
    fontWeight: "600",
    letterSpacing: -0.4,
    color: COLORS.name,
  },
  email: {
    marginTop: 3,
    fontFamily: FONT_FAMILY,
    fontSize: 13.5,
    fontWeight: "400",
    letterSpacing: -0.1,
    color: COLORS.email,
  },
  edit: {
    alignItems: "center",
    justifyContent: "center",
    width: EDIT_SIZE,
    height: EDIT_SIZE,
    borderRadius: EDIT_SIZE / 2,
    backgroundColor: COLORS.edit,
  },
  section: {
    marginTop: SECTION_GAP,
  },
  label: {
    marginBottom: LABEL_GAP,
    marginLeft: 4,
    fontFamily: FONT_FAMILY,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: -0.1,
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
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    fontWeight: "400",
    letterSpacing: -0.3,
    color: COLORS.rowTitle,
  },
  rowValue: {
    marginRight: 6,
    fontFamily: FONT_FAMILY,
    fontSize: 15.5,
    fontWeight: "400",
    letterSpacing: -0.2,
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
  logout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: LOGOUT_GAP,
    width: "100%",
    height: LOGOUT_HEIGHT,
    marginTop: LOGOUT_MARGIN_TOP,
    borderRadius: LOGOUT_RADIUS,
    backgroundColor: COLORS.logout,
  },
  logoutPressed: {
    backgroundColor: COLORS.logoutPressed,
  },
  logoutLabel: {
    fontFamily: FONT_FAMILY,
    fontSize: 16.5,
    fontWeight: "600",
    letterSpacing: -0.3,
    color: COLORS.logoutLabel,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: DELETE_GAP,
    width: "100%",
    height: DELETE_HEIGHT,
    marginTop: DELETE_MARGIN_TOP,
    borderRadius: DELETE_RADIUS,
    backgroundColor: COLORS.deleteButton,
  },
  deleteButtonPressed: {
    backgroundColor: COLORS.deleteButtonPressed,
  },
  deleteLabel: {
    fontFamily: FONT_FAMILY,
    fontSize: 16.5,
    fontWeight: "600",
    letterSpacing: -0.3,
    color: COLORS.deleteLabel,
  },
  version: {
    marginTop: CONTENT_TOP_PADDING * 2,
    textAlign: "center",
    fontFamily: FONT_FAMILY,
    fontSize: 12,
    fontWeight: "400",
    color: COLORS.version,
  },
});

export { ProfileSettingsV4 };
export type {
  IGlyph,
  IProfileSettingsV4,
  ISettingsProfile,
  ISettingsRow,
  ISettingsRowItem,
  ISettingsSection,
  TSettingsRowAccessory,
} from "./types";
export default memo(ProfileSettingsV4);
