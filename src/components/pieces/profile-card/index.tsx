import React, { useCallback, useMemo } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";

import {
  ACTION_RADIUS,
  AVATAR_INSET,
  AVATAR_OVERLAP,
  AVATAR_RADIUS,
  AVATAR_RING,
  AVATAR_SIZE,
  CARD_RADIUS,
  CARD_WIDTH,
  COVER_BOTTOM_RADIUS,
  COVER_HEIGHT,
  DEFAULT_PALETTE,
  OUTLINE_WIDTH,
  PRESS_SPRING,
} from "./const";
import { ProfileCardContext, useProfileCard } from "./context";
import type {
  IProfileCardAction,
  IProfileCardAvatar,
  IProfileCardContext,
  IProfileCardCover,
  IProfileCardLocation,
  IProfileCardRoot,
  IProfileCardSlot,
  IProfileCardText,
} from "./types";

import { createCompoundComponent } from "@/utils/create-compound-component";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PinIcon: React.FC<{ color: string; size?: number }> = ({
  color,
  size = 13,
}): React.JSX.Element => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"
      stroke={color}
      strokeWidth={2}
      fill="none"
    />
    <Circle
      cx={12}
      cy={10}
      r={2.6}
      stroke={color}
      strokeWidth={2}
      fill="none"
    />
  </Svg>
);

const ProfileCardRoot: React.FC<IProfileCardRoot> = ({
  children,
  palette,
  width = CARD_WIDTH,
  radius = CARD_RADIUS,
  outlineWidth = OUTLINE_WIDTH,
  outlineColor,
  innerRadius,
  coverHeight = COVER_HEIGHT,
  springConfig = PRESS_SPRING,
  style,
}: IProfileCardRoot): React.JSX.Element => {
  const context = useMemo<IProfileCardContext>(
    () => ({
      palette: { ...DEFAULT_PALETTE, ...palette },
      coverHeight,
      width,
      springConfig,
    }),
    [palette, coverHeight, width, springConfig],
  );

  // Concentric by default: the content curve is inset from the outer curve by
  // exactly the frame thickness, so the two never look like different radii.
  const contentRadius = Math.max(0, innerRadius ?? radius - outlineWidth);

  return (
    <ProfileCardContext.Provider value={context}>
      <View
        style={[
          styles.root,
          {
            width,
            padding: outlineWidth,
            borderRadius: radius,
            backgroundColor: outlineColor ?? context.palette.outline,
          },
          style,
        ]}
      >
        <View
          style={[
            styles.content,
            {
              borderRadius: contentRadius,
              backgroundColor: context.palette.surface,
            },
          ]}
        >
          {children}
        </View>
      </View>
    </ProfileCardContext.Provider>
  );
};

const ProfileCardCover: React.FC<IProfileCardCover> = ({
  source,
  alt,
  children,
  height,
  bottomRadius = COVER_BOTTOM_RADIUS,
  style,
}: IProfileCardCover): React.JSX.Element => {
  const { palette, coverHeight } = useProfileCard("ProfileCard.Cover");

  return (
    <View
      style={[
        styles.cover,
        {
          height: height ?? coverHeight,
          backgroundColor: palette.cover,
          borderBottomLeftRadius: bottomRadius,
          borderBottomRightRadius: bottomRadius,
        },
        style,
      ]}
    >
      {source && (
        <Image
          source={source}
          accessible={Boolean(alt)}
          accessibilityLabel={alt}
          resizeMode="cover"
          style={StyleSheet.absoluteFill}
        />
      )}
      {children}
    </View>
  );
};

const ProfileCardAvatar: React.FC<IProfileCardAvatar> = ({
  source,
  alt,
  size = AVATAR_SIZE,
  radius = AVATAR_RADIUS,
  ring = AVATAR_RING,
  inset = AVATAR_INSET,
  overlap = AVATAR_OVERLAP,
  style,
}: IProfileCardAvatar): React.JSX.Element => {
  const { palette, coverHeight } = useProfileCard("ProfileCard.Avatar");

  const top = coverHeight - size * (1 - overlap);

  return (
    <View
      style={[
        styles.avatar,
        {
          top,
          right: inset,
          width: size,
          height: size,
          borderRadius: radius,
          borderWidth: ring,
          borderColor: palette.avatarRing,
          backgroundColor: palette.cover,
        },
        style,
      ]}
    >
      <Image
        source={source}
        accessible={Boolean(alt)}
        accessibilityLabel={alt}
        resizeMode="cover"
        style={[StyleSheet.absoluteFill, { borderRadius: radius - ring }]}
      />
    </View>
  );
};

const ProfileCardBody: React.FC<IProfileCardSlot> = ({
  children,
  style,
}: IProfileCardSlot): React.JSX.Element => (
  <View style={[styles.body, style]}>{children}</View>
);

const ProfileCardHeader: React.FC<IProfileCardSlot> = ({
  children,
  style,
}: IProfileCardSlot): React.JSX.Element => (
  <View style={[styles.header, style]}>{children}</View>
);

const ProfileCardName: React.FC<IProfileCardText> = ({
  children,
  numberOfLines = 1,
  style,
}: IProfileCardText): React.JSX.Element => {
  const { palette } = useProfileCard("ProfileCard.Name");

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[styles.name, { color: palette.name }, style]}
    >
      {children}
    </Text>
  );
};

const ProfileCardHandle: React.FC<IProfileCardText> = ({
  children,
  numberOfLines = 1,
  style,
}: IProfileCardText): React.JSX.Element => {
  const { palette } = useProfileCard("ProfileCard.Handle");

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[styles.handle, { color: palette.handle }, style]}
    >
      {children}
    </Text>
  );
};

const ProfileCardBio: React.FC<IProfileCardText> = ({
  children,
  numberOfLines,
  style,
}: IProfileCardText): React.JSX.Element => {
  const { palette } = useProfileCard("ProfileCard.Bio");

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[styles.bio, { color: palette.bio }, style]}
    >
      {children}
    </Text>
  );
};

const ProfileCardLocation: React.FC<IProfileCardLocation> = ({
  children,
  icon,
  numberOfLines = 1,
  style,
  textStyle,
}: IProfileCardLocation): React.JSX.Element => {
  const { palette } = useProfileCard("ProfileCard.Location");

  return (
    <View style={[styles.location, style]}>
      {icon ?? <PinIcon color={palette.location} />}
      <Text
        numberOfLines={numberOfLines}
        style={[styles.locationText, { color: palette.location }, textStyle]}
      >
        {children}
      </Text>
    </View>
  );
};

const ProfileCardAction: React.FC<IProfileCardAction> = ({
  children,
  onPress,
  disabled = false,
  radius = ACTION_RADIUS,
  style,
  textStyle,
}: IProfileCardAction): React.JSX.Element => {
  const { palette, springConfig } = useProfileCard("ProfileCard.Action");

  const scale = useSharedValue<number>(1);

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
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[
        styles.action,
        { backgroundColor: palette.action, borderRadius: radius },
        disabled && styles.actionDisabled,
        animatedStyle,
        style,
      ]}
    >
      <Text
        style={[styles.actionLabel, { color: palette.actionLabel }, textStyle]}
      >
        {children}
      </Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  root: {
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  content: {
    width: "100%",
    overflow: "hidden",
  },
  cover: {
    width: "100%",
    overflow: "hidden",
  },
  avatar: {
    position: "absolute",
    zIndex: 10,
    overflow: "hidden",
  },
  body: {
    padding: 16,
    gap: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  name: {
    flexShrink: 1,
    fontSize: 19,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  handle: {
    flexShrink: 1,
    fontSize: 12,
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  locationText: {
    flexShrink: 1,
    fontSize: 13,
  },
  action: {
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
  },
  actionDisabled: {
    opacity: 0.5,
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
});

const Root = createCompoundComponent("ProfileCard.Root", ProfileCardRoot);
const Cover = createCompoundComponent("ProfileCard.Cover", ProfileCardCover);
const Avatar = createCompoundComponent("ProfileCard.Avatar", ProfileCardAvatar);
const Body = createCompoundComponent("ProfileCard.Body", ProfileCardBody);
const Header = createCompoundComponent("ProfileCard.Header", ProfileCardHeader);
const Name = createCompoundComponent("ProfileCard.Name", ProfileCardName);
const Handle = createCompoundComponent("ProfileCard.Handle", ProfileCardHandle);
const Bio = createCompoundComponent("ProfileCard.Bio", ProfileCardBio);
const Location = createCompoundComponent(
  "ProfileCard.Location",
  ProfileCardLocation,
);
const Action = createCompoundComponent("ProfileCard.Action", ProfileCardAction);

const ProfileCard = createCompoundComponent("ProfileCard", ProfileCardRoot, {
  Root,
  Cover,
  Avatar,
  Body,
  Header,
  Name,
  Handle,
  Bio,
  Location,
  Action,
});

export {
  ProfileCard,
  Root,
  Cover,
  Avatar,
  Body,
  Header,
  Name,
  Handle,
  Bio,
  Location,
  Action,
  useProfileCard,
};
export default ProfileCard;
export { DARK_PALETTE, DEFAULT_PALETTE } from "./const";
export type {
  IProfileCardRoot,
  IProfileCardCover,
  IProfileCardAvatar,
  IProfileCardSlot,
  IProfileCardText,
  IProfileCardLocation,
  IProfileCardAction,
  TProfilePalette,
} from "./types";
