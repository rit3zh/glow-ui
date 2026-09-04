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
  OFFSETS,
  ROTATIONS,
  STACK_SIZE,
} from "./const";
import {
  PhotoStackContext,
  PhotoStackItemContext,
  usePhotoStack,
  usePhotoStackItem,
} from "./context";
import type {
  IPhotoStackCaption,
  IPhotoStackContext,
  IPhotoStackItem,
  IPhotoStackPhoto,
  IPhotoStackRoot,
} from "./types";

import { createCompoundComponent } from "@/utils/create-compound-component";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PhotoStackRoot: React.FC<IPhotoStackRoot> = ({
  children,
  palette,
  size = STACK_SIZE,
  rotations = ROTATIONS,
  offsets = OFFSETS,
  lift = LIFT,
  springConfig = LIFT_SPRING,
  style,
}: IPhotoStackRoot): React.JSX.Element => {
  const context = useMemo<IPhotoStackContext>(
    () => ({
      palette: { ...DEFAULT_PALETTE, ...palette },
      size,
      rotations,
      offsets,
      lift,
      springConfig,
    }),
    [palette, size, rotations, offsets, lift, springConfig],
  );

  // Each child is handed its position, so items stay index-free at the call
  // site and the last one rendered sits on top of the deck.
  const items = React.Children.toArray(children);

  return (
    <PhotoStackContext.Provider value={context}>
      <View style={[styles.root, { width: size, height: size }, style]}>
        {items.map((child, index) => (
          <PhotoStackItemContext.Provider key={index} value={{ index }}>
            {child}
          </PhotoStackItemContext.Provider>
        ))}
      </View>
    </PhotoStackContext.Provider>
  );
};

const PhotoStackItem: React.FC<IPhotoStackItem> = ({
  children,
  rotation,
  offset,
  onPress,
  style,
}: IPhotoStackItem): React.JSX.Element => {
  const { palette, rotations, offsets, lift, springConfig } =
    usePhotoStack("PhotoStack.Item");
  const { index } = usePhotoStackItem("PhotoStack.Item");

  // Web hovers; a phone is pressed. `pressed` drives the same lift-and-
  // straighten the CSS version runs on hover.
  const pressed = useSharedValue<number>(0);

  const tilt = rotation ?? rotations[index % rotations.length] ?? 0;
  const shift = offset ?? offsets[index % offsets.length] ?? 0;

  const onPressIn = useCallback((): void => {
    pressed.value = withSpring(1, springConfig);
  }, [pressed, springConfig]);

  const onPressOut = useCallback((): void => {
    pressed.value = withSpring(0, springConfig);
  }, [pressed, springConfig]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: shift },
      { translateY: -lift * pressed.value },
      { rotate: `${tilt * (1 - pressed.value)}deg` },
    ],
  }));

  const frameStyle = [
    styles.frame,
    { backgroundColor: palette.frame, zIndex: index + 1 },
    animatedStyle,
    style,
  ];

  return onPress ? (
    <AnimatedPressable
      accessibilityRole="button"
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={frameStyle}
    >
      {children}
    </AnimatedPressable>
  ) : (
    <Animated.View style={frameStyle}>{children}</Animated.View>
  );
};

const PhotoStackPhoto: React.FC<IPhotoStackPhoto> = ({
  source,
  alt,
  style,
}: IPhotoStackPhoto): React.JSX.Element => {
  const { palette } = usePhotoStack("PhotoStack.Photo");

  return (
    <View style={[styles.photo, { backgroundColor: palette.photo }, style]}>
      {source ? (
        <Image
          source={source}
          accessible={Boolean(alt)}
          accessibilityLabel={alt}
          resizeMode="cover"
          style={StyleSheet.absoluteFill}
        />
      ) : null}
    </View>
  );
};

const PhotoStackCaption: React.FC<IPhotoStackCaption> = ({
  children,
  numberOfLines = 1,
  style,
}: IPhotoStackCaption): React.JSX.Element => {
  const { palette } = usePhotoStack("PhotoStack.Caption");

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[styles.caption, { color: palette.caption }, style]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  root: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  frame: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 4,
    padding: 6,
    paddingBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  photo: {
    flex: 1,
    borderRadius: 2,
    overflow: "hidden",
  },
  caption: {
    fontSize: 10,
    letterSpacing: 0.4,
    textAlign: "center",
    paddingTop: 3,
  },
});

const Root = createCompoundComponent("PhotoStack.Root", PhotoStackRoot);
const Item = createCompoundComponent("PhotoStack.Item", PhotoStackItem);
const Photo = createCompoundComponent("PhotoStack.Photo", PhotoStackPhoto);
const Caption = createCompoundComponent(
  "PhotoStack.Caption",
  PhotoStackCaption,
);

const PhotoStack = createCompoundComponent("PhotoStack", PhotoStackRoot, {
  Root,
  Item,
  Photo,
  Caption,
});

export {
  PhotoStack,
  Root,
  Item,
  Photo,
  Caption,
  usePhotoStack,
  usePhotoStackItem,
  DEFAULT_PALETTE,
};
export default PhotoStack;
export type {
  IPhotoStackRoot,
  IPhotoStackItem,
  IPhotoStackPhoto,
  IPhotoStackCaption,
  TPhotoStackPalette,
} from "./types";
