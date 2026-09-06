import React, { useCallback, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import {
  BORDER_WIDTH,
  BRANDS,
  BUTTON_RADIUS,
  GAP,
  ICON_SIZE,
  PADDING_X,
  PADDING_Y,
  PRESS_SPRING,
  paletteFor,
} from "./const";
import { SocialButtonContext, useSocialButton } from "./context";
import { SOCIAL_ICONS } from "./icons";
import type {
  ISocialButtonContext,
  ISocialButtonIcon,
  ISocialButtonLabel,
  ISocialButtonRoot,
} from "./types";

import { createCompoundComponent } from "@/utils/create-compound-component";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SocialButtonRoot: React.FC<ISocialButtonRoot> = ({
  provider,
  children,
  variant = "outline",
  palette,
  onPress,
  disabled = false,
  fullWidth = false,
  radius = BUTTON_RADIUS,
  borderWidth = BORDER_WIDTH,
  gap = GAP,
  labelWidth,
  iconSize = ICON_SIZE,
  align = "center",
  springConfig = PRESS_SPRING,
  accessibilityLabel,
  style,
}: ISocialButtonRoot): React.JSX.Element => {
  const scale = useSharedValue<number>(1);

  const context = useMemo<ISocialButtonContext>(
    () => ({
      palette: { ...paletteFor(provider, variant), ...palette },
      provider,
      iconSize,
      fullWidth,
      gap,
      labelWidth,
      align,
    }),
    [provider, variant, palette, iconSize, fullWidth, gap, labelWidth, align],
  );

  const onPressIn = useCallback((): void => {
    scale.value = withSpring(0.97, springConfig);
  }, [scale, springConfig]);

  const onPressOut = useCallback((): void => {
    scale.value = withSpring(1, springConfig);
  }, [scale, springConfig]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <SocialButtonContext.Provider value={context}>
      <AnimatedPressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? BRANDS[provider].label}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[
          styles.root,
          {
            gap,
            justifyContent: align === "center" ? "center" : "flex-start",
            borderRadius: radius,
            borderWidth,
            backgroundColor: context.palette.surface,
            borderColor: context.palette.border,
          },
          fullWidth ? styles.fullWidth : styles.hug,
          disabled && styles.disabled,
          animatedStyle,
          style,
        ]}
      >
        {children}
      </AnimatedPressable>
    </SocialButtonContext.Provider>
  );
};

const SocialButtonIcon: React.FC<ISocialButtonIcon> = ({
  children,
  size,
  color,
  style,
}: ISocialButtonIcon): React.JSX.Element => {
  const { provider, palette, iconSize } = useSocialButton("SocialButton.Icon");

  const Mark = SOCIAL_ICONS[provider];

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={style}
    >
      {children ?? (
        <Mark size={size ?? iconSize} color={color ?? palette.icon} />
      )}
    </View>
  );
};

const SocialButtonLabel: React.FC<ISocialButtonLabel> = ({
  children,
  numberOfLines = 1,
  style,
}: ISocialButtonLabel): React.JSX.Element => {
  const { palette, provider, labelWidth } =
    useSocialButton("SocialButton.Label");

  // The label sits right next to the mark and the row centers the pair as one
  // group, so the icon always hugs the text by exactly `gap`. A fixed
  // `labelWidth` makes that group the same width on every row, which is what
  // lines the icons up across a stack.
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        styles.label,
        { color: palette.label },
        labelWidth !== undefined && { width: labelWidth, textAlign: "left" },
        style,
      ]}
    >
      {children ?? BRANDS[provider].label}
    </Text>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: PADDING_X,
    paddingVertical: PADDING_Y,
  },
  hug: {
    alignSelf: "flex-start",
  },
  fullWidth: {
    alignSelf: "stretch",
  },
  disabled: {
    opacity: 0.5,
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    flexShrink: 1,
    fontSize: 15,
    fontWeight: "600",
  },
});

const Root = createCompoundComponent("SocialButton.Root", SocialButtonRoot);
const Icon = createCompoundComponent("SocialButton.Icon", SocialButtonIcon);
const Label = createCompoundComponent("SocialButton.Label", SocialButtonLabel);

const SocialButton = createCompoundComponent("SocialButton", SocialButtonRoot, {
  Root,
  Icon,
  Label,
});

export { SocialButton, Root, Icon, Label, useSocialButton };
export default SocialButton;
export { BRANDS, paletteFor } from "./const";
export { SOCIAL_ICONS } from "./icons";
export type {
  ISocialButtonRoot,
  ISocialButtonIcon,
  ISocialButtonLabel,
  ISocialIconProps,
  TSocialProvider,
  TSocialVariant,
  TSocialPalette,
} from "./types";
