import React, { useCallback, useMemo } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import {
  DEFAULT_PALETTE,
  LIFT,
  LIFT_SPRING,
  MONO_FONT,
  POLAROID_WIDTH,
  SERIF_FONT,
  TAPE_HEIGHT,
  TAPE_TILT,
  TAPE_WIDTH,
  TILT,
} from "./const";
import { PolaroidContext, usePolaroid } from "./context";
import type {
  IPolaroidContext,
  IPolaroidPhoto,
  IPolaroidRoot,
  IPolaroidSlot,
  IPolaroidTape,
  IPolaroidText,
} from "./types";

import { createCompoundComponent } from "@/utils/create-compound-component";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PolaroidRoot: React.FC<IPolaroidRoot> = ({
  children,
  palette,
  width = POLAROID_WIDTH,
  tilt = TILT,
  lift = LIFT,
  springConfig = LIFT_SPRING,
  onPress,
  style,
}: IPolaroidRoot): React.JSX.Element => {
  // Web hovers; a phone is pressed. `pressed` drives the same
  // lift-and-straighten the CSS version runs on hover.
  const pressed = useSharedValue<number>(0);

  const context = useMemo<IPolaroidContext>(
    () => ({
      palette: { ...DEFAULT_PALETTE, ...palette },
      serifFont: SERIF_FONT,
      monoFont: MONO_FONT,
      width,
    }),
    [palette, width],
  );

  const onPressIn = useCallback((): void => {
    pressed.value = withSpring(1, springConfig);
  }, [pressed, springConfig]);

  const onPressOut = useCallback((): void => {
    pressed.value = withSpring(0, springConfig);
  }, [pressed, springConfig]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -lift * pressed.value },
      { rotate: `${tilt * (1 - pressed.value)}deg` },
    ],
  }));

  const paperStyle = [
    styles.paper,
    { width, backgroundColor: context.palette.paper },
    animatedStyle,
    style,
  ];

  return (
    <PolaroidContext.Provider value={context}>
      {onPress ? (
        <AnimatedPressable
          accessibilityRole="button"
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={paperStyle}
        >
          {children}
        </AnimatedPressable>
      ) : (
        <Animated.View style={paperStyle}>{children}</Animated.View>
      )}
    </PolaroidContext.Provider>
  );
};

const PolaroidTape: React.FC<IPolaroidTape> = ({
  width = TAPE_WIDTH,
  height = TAPE_HEIGHT,
  tilt = TAPE_TILT,
  color,
  borderColor,
  style,
}: IPolaroidTape): React.JSX.Element => {
  const { palette } = usePolaroid("Polaroid.Tape");

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={[
        styles.tape,
        {
          width,
          height,
          marginLeft: -width / 2,
          backgroundColor: color ?? palette.tape,
          borderColor: borderColor ?? palette.tapeBorder,
          transform: [{ rotate: `${tilt}deg` }],
        },
        style,
      ]}
    />
  );
};

const PolaroidPhoto: React.FC<IPolaroidPhoto> = ({
  source,
  alt,
  aspectRatio = 1,
  style,
}: IPolaroidPhoto): React.JSX.Element => {
  const { palette } = usePolaroid("Polaroid.Photo");

  return (
    <View
      style={[
        styles.photo,
        { aspectRatio, backgroundColor: palette.photo },
        style,
      ]}
    >
      <Image
        source={source}
        accessible={Boolean(alt)}
        accessibilityLabel={alt}
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
};

const PolaroidFooter: React.FC<IPolaroidSlot> = ({
  children,
  style,
}: IPolaroidSlot): React.JSX.Element => (
  <View style={[styles.footer, style]}>{children}</View>
);

const PolaroidCaption: React.FC<IPolaroidText> = ({
  children,
  numberOfLines,
  style,
}: IPolaroidText): React.JSX.Element => {
  const { palette, serifFont } = usePolaroid("Polaroid.Caption");

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        styles.caption,
        { color: palette.caption, fontFamily: serifFont },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

const PolaroidMeta: React.FC<IPolaroidText> = ({
  children,
  numberOfLines = 1,
  style,
}: IPolaroidText): React.JSX.Element => {
  const { palette, monoFont } = usePolaroid("Polaroid.Meta");

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        styles.meta,
        { color: palette.meta, fontFamily: monoFont },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  paper: {
    padding: 12,
    paddingBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  tape: {
    position: "absolute",
    zIndex: 10,
    top: -12,
    left: "50%",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  photo: {
    width: "100%",
    overflow: "hidden",
  },
  footer: {
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingHorizontal: 8,
    paddingTop: 12,
  },
  caption: {
    fontSize: 18,
    fontStyle: "italic",
    lineHeight: 24,
    textAlign: "center",
  },
  meta: {
    fontSize: 12,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
});

const Root = createCompoundComponent("Polaroid.Root", PolaroidRoot);
const Tape = createCompoundComponent("Polaroid.Tape", PolaroidTape);
const Photo = createCompoundComponent("Polaroid.Photo", PolaroidPhoto);
const Footer = createCompoundComponent("Polaroid.Footer", PolaroidFooter);
const Caption = createCompoundComponent("Polaroid.Caption", PolaroidCaption);
const Meta = createCompoundComponent("Polaroid.Meta", PolaroidMeta);

const Polaroid = createCompoundComponent("Polaroid", PolaroidRoot, {
  Root,
  Tape,
  Photo,
  Footer,
  Caption,
  Meta,
});

export { Polaroid, Root, Tape, Photo, Footer, Caption, Meta, usePolaroid };
export default Polaroid;
export type {
  IPolaroidRoot,
  IPolaroidTape,
  IPolaroidPhoto,
  IPolaroidSlot,
  IPolaroidText,
  TPolaroidPalette,
} from "./types";
