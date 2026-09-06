import { Canvas, Fill, Shader, Skia } from "@shopify/react-native-skia";
import React, { memo, useCallback, useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Svg, { Circle, Rect } from "react-native-svg";
import {
  ACTION_HEIGHT,
  ACTION_RADIUS,
  COLORS,
  CONTENT_HORIZONTAL_PADDING,
  DEFAULT_ACTION_LABEL,
  DEFAULT_FOOTER_ACTION_LABEL,
  DEFAULT_FOOTER_PROMPT,
  DEFAULT_LEGAL_PREFIX,
  DEFAULT_LEGAL_SEPARATOR,
  DEFAULT_LEGAL_SUFFIX,
  DEFAULT_PRIVACY_LABEL,
  DEFAULT_SUBTITLE,
  DEFAULT_TERMS_LABEL,
  DEFAULT_TITLE,
  LOGO_SIZE,
  ORB_BACKDROP,
  ORB_BLUE,
  ORB_BLUE_ANGLE,
  ORB_BLUE_GAIN,
  ORB_BLUE_RING,
  ORB_BLUE_SPREAD,
  ORB_BLUE_WIDTH,
  ORB_BLUE_OFFSET,
  ORB_CENTER,
  ORB_CLOUD,
  ORB_CLOUD_SCALE,
  ORB_DOME_FADE,
  ORB_EXPOSURE,
  ORB_GRAIN,
  ORB_GRAIN_SCALE,
  ORB_HAZE_GAIN,
  ORB_HAZE_RING,
  ORB_HAZE_WIDTH,
  ORB_SCALE,
  ORB_SHADER,
  ORB_WARM,
  ORB_WARM_ANGLE,
  ORB_WARM_GAIN,
  ORB_WARM_OFFSET,
  ORB_WARM_RING,
  ORB_WARM_SPREAD,
  ORB_WARM_WIDTH,
} from "./const";
import type { IWelcomeScreenV2 } from "./types";

const WelcomeScreenV2: React.FC<IWelcomeScreenV2> = ({
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
  actionLabel = DEFAULT_ACTION_LABEL,
  footerPrompt = DEFAULT_FOOTER_PROMPT,
  footerActionLabel = DEFAULT_FOOTER_ACTION_LABEL,
  legalPrefix = DEFAULT_LEGAL_PREFIX,
  termsLabel = DEFAULT_TERMS_LABEL,
  legalSeparator = DEFAULT_LEGAL_SEPARATOR,
  privacyLabel = DEFAULT_PRIVACY_LABEL,
  legalSuffix = DEFAULT_LEGAL_SUFFIX,
  logo,
  style,
  onActionPress,
  onFooterPress,
  onTermsPress,
  onPrivacyPress,
}: IWelcomeScreenV2) => {
  const { width, height } = useWindowDimensions();
  const [pressed, setPressed] = useState<boolean>(false);

  const effect = useMemo(() => Skia.RuntimeEffect.Make(ORB_SHADER), []);

  const uniforms = useMemo(
    () => ({
      resolution: [width, height],
      center: ORB_CENTER,
      orbScale: ORB_SCALE,
      backdrop: ORB_BACKDROP,
      warmColor: ORB_WARM,
      blueColor: ORB_BLUE,
      warmOffset: ORB_WARM_OFFSET,
      warmRing: ORB_WARM_RING,
      warmWidth: ORB_WARM_WIDTH,
      warmGain: ORB_WARM_GAIN,
      warmAngle: ORB_WARM_ANGLE,
      warmSpread: ORB_WARM_SPREAD,
      blueOffset: ORB_BLUE_OFFSET,
      blueRing: ORB_BLUE_RING,
      blueWidth: ORB_BLUE_WIDTH,
      blueGain: ORB_BLUE_GAIN,
      blueAngle: ORB_BLUE_ANGLE,
      blueSpread: ORB_BLUE_SPREAD,
      hazeRing: ORB_HAZE_RING,
      hazeWidth: ORB_HAZE_WIDTH,
      hazeGain: ORB_HAZE_GAIN,
      cloud: ORB_CLOUD,
      cloudScale: ORB_CLOUD_SCALE,
      domeFade: ORB_DOME_FADE,
      exposure: ORB_EXPOSURE,
      grain: ORB_GRAIN,
      grainScale: ORB_GRAIN_SCALE,
    }),
    [height, width],
  );

  const handlePressIn = useCallback(() => setPressed(true), []);
  const handlePressOut = useCallback(() => setPressed(false), []);

  return (
    <View style={[styles.container, style]}>
      {effect ? (
        <Canvas style={StyleSheet.absoluteFill}>
          <Fill>
            <Shader source={effect} uniforms={uniforms} />
          </Fill>
        </Canvas>
      ) : null}

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.actionGlow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={actionLabel}
            onPress={onActionPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[styles.action, pressed ? styles.actionPressed : null]}
          >
            <View style={styles.actionInner}>
              <Text style={styles.actionLabel} numberOfLines={1}>
                {actionLabel}
              </Text>
            </View>
          </Pressable>
        </View>

        <Text style={styles.footer}>
          {footerPrompt}{" "}
          <Text
            accessibilityRole="link"
            onPress={onFooterPress}
            style={styles.footerAction}
          >
            {footerActionLabel}
          </Text>
        </Text>

        <Text style={styles.legal}>
          {legalPrefix}{" "}
          <Text
            accessibilityRole="link"
            onPress={onTermsPress}
            style={styles.legalLink}
          >
            {termsLabel}
          </Text>{" "}
          {legalSeparator}{" "}
          <Text
            accessibilityRole="link"
            onPress={onPrivacyPress}
            style={styles.legalLink}
          >
            {privacyLabel}
          </Text>
          {legalSuffix}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.screen,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: CONTENT_HORIZONTAL_PADDING,
    paddingBottom: 40,
  },
  logo: {
    marginBottom: 26,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700",
    letterSpacing: -0.6,
    textAlign: "center",
    color: COLORS.title,
  },
  subtitle: {
    marginTop: 12,
    maxWidth: 320,
    fontSize: 17,
    lineHeight: 24,
    letterSpacing: -0.2,
    textAlign: "center",
    color: COLORS.subtitle,
  },
  actionGlow: {
    width: "100%",
    marginTop: 32,
    borderRadius: ACTION_RADIUS,
    shadowColor: "#ffffff",
    shadowOpacity: 0.3,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  action: {
    width: "100%",
    height: ACTION_HEIGHT,
    borderRadius: ACTION_RADIUS,
    backgroundColor: COLORS.action,
    overflow: "hidden",
  },
  actionPressed: {
    backgroundColor: COLORS.actionPressed,
  },
  actionInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  actionLabel: {
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.3,
    color: COLORS.actionLabel,
  },
  footer: {
    marginTop: 24,
    fontSize: 15.5,
    letterSpacing: -0.2,
    textAlign: "center",
    color: COLORS.footer,
  },
  footerAction: {
    fontWeight: "700",
    color: COLORS.footerAction,
  },
  legal: {
    marginTop: 26,
    maxWidth: 300,
    fontSize: 12.5,
    lineHeight: 18,
    textAlign: "center",
    color: COLORS.legal,
  },
  legalLink: {
    color: COLORS.legalLink,
  },
});

export { WelcomeScreenV2 };
export type { IGlyph, IWelcomeOrb, IWelcomeScreenV2 } from "./types";
export default memo(WelcomeScreenV2);
