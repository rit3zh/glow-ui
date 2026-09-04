import { Canvas, Fill, Shader, Skia } from "@shopify/react-native-skia";
import React, { memo, useCallback, useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import {
  ACTION_GAP,
  ACTION_HEIGHT,
  ACTION_RADIUS,
  COLORS,
  DEFAULT_ACTIONS,
  DEFAULT_SUBTITLE,
  DEFAULT_TITLE,
  GRADIENT_ANGLE,
  GRADIENT_ASPECT,
  GRADIENT_BEND,
  GRADIENT_RATIO,
  GRADIENT_SEED,
  GRADIENT_SHADER,
  GRADIENT_SWIRL,
  GRADIENT_WARP,
  GRAIN_INTENSITY,
  ICON_SIZE,
  LOGO_SIZE,
  MESH_COLORS,
  SHEET_HORIZONTAL_PADDING,
  SHEET_OVERLAP,
  SHEET_RADIUS,
} from "./const";
import type {
  IGlyph,
  IWelcomeAction,
  IWelcomeActionRow,
  IWelcomeScreen,
} from "./types";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AppleGlyph: React.FC<IGlyph> = ({
  size = ICON_SIZE,
  color = COLORS.primaryLabel,
}: IGlyph) => (
  <Svg width={size * 1.3} height={size * 1.3} viewBox="0 0 24 24" fill="none">
    <Path
      d="M17.02 12.54c.02 2.19 1.92 2.92 1.94 2.93-.02.05-.3 1.04-1 2.06-.6.88-1.23 1.76-2.22 1.78-.97.02-1.28-.58-2.39-.58s-1.45.56-2.37.6c-.95.03-1.68-.95-2.28-1.83-1.25-1.8-2.2-5.08-.92-7.3.63-1.1 1.76-1.8 2.99-1.81.93-.02 1.82.63 2.39.63.57 0 1.64-.78 2.77-.67.47.02 1.8.19 2.65 1.44-.07.04-1.58.92-1.56 2.75M15.31 6.02c.5-.61.84-1.46.75-2.31-.73.03-1.61.49-2.13 1.1-.47.54-.88 1.4-.77 2.23.81.06 1.64-.41 2.15-1.02"
      fill={color}
    />
  </Svg>
);

const GoogleGlyph: React.FC<IGlyph> = ({ size = ICON_SIZE }: IGlyph) => (
  <Svg width={size} height={size} viewBox="0 0 48 48">
    <Path
      fill="#4285F4"
      d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
    />
    <Path
      fill="#34A853"
      d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
    />
    <Path
      fill="#FBBC05"
      d="M11.69 28.18c-.44-1.32-.69-2.73-.69-4.18s.25-2.86.69-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
    />
    <Path
      fill="#EA4335"
      d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
    />
  </Svg>
);

const EmailGlyph: React.FC<IGlyph> = ({
  size = ICON_SIZE,
  color = COLORS.secondaryLabel,
}: IGlyph) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 7.5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
      fill={color}
    />
    <Path
      d="m4.4 7.6 6.44 5.02a1.9 1.9 0 0 0 2.32 0L19.6 7.6"
      stroke={COLORS.secondary}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ICONS: Record<IWelcomeAction["icon"], React.FC<IGlyph>> = {
  apple: AppleGlyph,
  google: GoogleGlyph,
  email: EmailGlyph,
};

const ActionRow: React.FC<IWelcomeActionRow> = memo(
  ({ action, onPress }: IWelcomeActionRow) => {
    const [pressed, setPressed] = useState<boolean>(false);
    const primary = action.variant !== "secondary";
    const Icon = ICONS[action.icon];

    const handlePress = useCallback(() => onPress?.(action), [action, onPress]);
    const handlePressIn = useCallback(() => setPressed(true), []);
    const handlePressOut = useCallback(() => setPressed(false), []);

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={action.label}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.action,
          primary ? styles.actionPrimary : styles.actionSecondary,
          pressed
            ? primary
              ? styles.actionPrimaryPressed
              : styles.actionSecondaryPressed
            : null,
        ]}
      >
        <View style={styles.actionInner}>
          <Icon
            size={ICON_SIZE}
            color={primary ? COLORS.primaryLabel : COLORS.secondaryLabel}
          />
          <Text
            style={[
              styles.actionLabel,
              primary ? styles.actionLabelPrimary : styles.actionLabelSecondary,
            ]}
            numberOfLines={1}
          >
            {action.label}
          </Text>
        </View>
      </Pressable>
    );
  },
);

const WelcomeScreen: React.FC<IWelcomeScreen> = ({
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
  actions = DEFAULT_ACTIONS,
  logo,
  gradientRatio = GRADIENT_RATIO,
  style,
  onActionPress,
}: IWelcomeScreen) => {
  const { width, height } = useWindowDimensions();
  const panelHeight = Math.round(height * gradientRatio);

  const effect = useMemo(() => Skia.RuntimeEffect.Make(GRADIENT_SHADER), []);

  const uniforms = useMemo(
    () => ({
      resolution: [width, panelHeight],
      seed: GRADIENT_SEED,
      warp: GRADIENT_WARP,
      angle: GRADIENT_ANGLE,
      swirl: GRADIENT_SWIRL,
      bend: GRADIENT_BEND,
      aspect: GRADIENT_ASPECT,
      grain: GRAIN_INTENSITY,
      c1: MESH_COLORS.blush,
      c2: MESH_COLORS.coral,
      c3: MESH_COLORS.indigo,
      c4: MESH_COLORS.violet,
    }),
    [panelHeight, width],
  );

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.panel, { height: panelHeight }]}>
        {effect ? (
          <Canvas style={StyleSheet.absoluteFill}>
            <Fill>
              <Shader source={effect} uniforms={uniforms} />
            </Fill>
          </Canvas>
        ) : null}
      </View>

      <View
        style={[
          styles.sheet,
          {
            paddingTop: insets.top - insets.bottom * 0.2,
          },
        ]}
      >
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

        <View style={styles.actions}>
          {actions.map((action) => (
            <ActionRow
              key={action.key}
              action={action}
              onPress={onActionPress}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.sheet,
  },
  panel: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  logo: {
    alignItems: "center",
    justifyContent: "center",
  },
  sheet: {
    flex: 1,
    alignItems: "center",
    marginTop: -SHEET_OVERLAP,

    paddingHorizontal: SHEET_HORIZONTAL_PADDING,
    borderTopLeftRadius: SHEET_RADIUS,
    borderTopRightRadius: SHEET_RADIUS,
    backgroundColor: COLORS.sheet,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "700",
    letterSpacing: -0.45,
    textAlign: "center",
    color: COLORS.title,
  },
  subtitle: {
    marginTop: 7,
    fontSize: 15.5,
    lineHeight: 21,
    letterSpacing: -0.2,
    textAlign: "center",
    color: COLORS.subtitle,
  },
  actions: {
    width: "100%",
    marginTop: 26,
    gap: ACTION_GAP,
  },
  action: {
    width: "100%",
    height: ACTION_HEIGHT,
    borderRadius: ACTION_RADIUS,
    overflow: "hidden",
  },
  actionInner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 18,
  },
  actionPrimary: {
    backgroundColor: COLORS.primary,
  },
  actionPrimaryPressed: {
    backgroundColor: COLORS.primaryPressed,
  },
  actionSecondary: {
    backgroundColor: COLORS.secondary,
  },
  actionSecondaryPressed: {
    backgroundColor: COLORS.secondaryPressed,
  },
  actionLabel: {
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.35,
  },
  actionLabelPrimary: {
    color: COLORS.primaryLabel,
  },
  actionLabelSecondary: {
    color: COLORS.secondaryLabel,
  },
});

export { WelcomeScreen };
export type {
  IGlyph,
  IWelcomeAction,
  IWelcomeActionRow,
  IWelcomeScreen,
  WelcomeActionVariant,
} from "./types";
export default memo(WelcomeScreen);
