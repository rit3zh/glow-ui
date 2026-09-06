import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import type { IEmptyCollectionState, IGlyph, IPhotoCard } from "./types";
import {
  ACTION_HEIGHT,
  ACTION_HORIZONTAL_PADDING,
  CARD_BORDER_WIDTH,
  CARD_HEIGHT,
  CARD_LAYOUTS,
  CARD_RADIUS,
  CARD_WIDTH,
  COLORS,
  CONTENT_HORIZONTAL_PADDING,
  DEFAULT_ACTION_LABEL,
  DEFAULT_PHOTOS,
  DEFAULT_TITLE,
  ENTRANCE_SPRING,
  ENTRANCE_STAGGER,
  ENTRANCE_START_SCALE,
  FLOAT_DISTANCE,
  FLOAT_DURATION,
  FLOAT_STAGGER,
  STACK_HEIGHT,
  STACK_WIDTH,
} from "./const";

const ArrowRightGlyph: React.FC<IGlyph> = ({
  size = 15,
  color = COLORS.actionLabel,
}: IGlyph) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 12h15M13 6l6 6-6 6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const PhotoCard: React.FC<IPhotoCard> = memo(
  ({ source, layout, index, animated }: IPhotoCard) => {
    const progress = useSharedValue<number>(animated ? 0 : 1);
    const drift = useSharedValue<number>(0);

    useEffect(() => {
      if (!animated) {
        cancelAnimation(progress);
        cancelAnimation(drift);
        progress.value = 1;
        drift.value = 0;
        return;
      }

      progress.value = withDelay(
        index * ENTRANCE_STAGGER,
        withSpring(1, ENTRANCE_SPRING),
      );

      drift.value = withDelay(
        index * FLOAT_STAGGER,
        withRepeat(
          withTiming(1, {
            duration: FLOAT_DURATION,
            easing: Easing.inOut(Easing.sin),
          }),
          -1,
          true,
        ),
      );

      return () => {
        cancelAnimation(progress);
        cancelAnimation(drift);
      };
    }, [animated, drift, index, progress]);

    const cardStyle = useAnimatedStyle(() => ({
      opacity: progress.value,
      transform: [
        { translateX: progress.value * layout.translateX },
        {
          translateY:
            progress.value * layout.translateY +
            interpolate(drift.value, [0, 1], [0, -FLOAT_DISTANCE]),
        },
        { rotate: `${progress.value * layout.rotate}deg` },
        {
          scale: interpolate(progress.value, [0, 1], [ENTRANCE_START_SCALE, 1]),
        },
      ],
    }));

    return (
      <Animated.View style={[styles.card, cardStyle]}>
        {source ? (
          <Image
            source={source}
            style={styles.photo}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
        ) : (
          <View style={[styles.photo, styles.placeholder]} />
        )}
      </Animated.View>
    );
  },
);
PhotoCard.displayName = "PhotoCard";

const EmptyCollectionState: React.FC<IEmptyCollectionState> = ({
  title = DEFAULT_TITLE,
  actionLabel = DEFAULT_ACTION_LABEL,
  photos,
  hideAction = false,
  animated = true,
  style,
  onActionPress,
}: IEmptyCollectionState) => {
  const [isActionPressed, setIsActionPressed] = useState<boolean>(false);

  const handlePressIn = useCallback((): void => setIsActionPressed(true), []);
  const handlePressOut = useCallback((): void => setIsActionPressed(false), []);

  const cards = useMemo<(ImageSourcePropType | null)[]>(() => {
    const sources: ImageSourcePropType[] =
      photos ?? DEFAULT_PHOTOS.map((uri) => ({ uri }));
    return CARD_LAYOUTS.map((_, index) => sources[index] ?? null);
  }, [photos]);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.stack}>
        {CARD_LAYOUTS.map((layout, index) => (
          <PhotoCard
            key={`${layout.rotate}-${layout.translateX}`}
            source={cards[index] ?? null}
            layout={layout}
            index={index}
            animated={animated}
          />
        ))}
      </View>

      <Text style={styles.title}>{title}</Text>

      {hideAction ? null : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          onPress={onActionPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[styles.action, isActionPressed ? styles.actionPressed : null]}
        >
          <Text style={styles.actionLabel} numberOfLines={1}>
            {actionLabel}
          </Text>
          <ArrowRightGlyph />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: CONTENT_HORIZONTAL_PADDING,
    backgroundColor: COLORS.screen,
  },
  stack: {
    width: STACK_WIDTH,
    height: STACK_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    position: "absolute",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: CARD_RADIUS,
    borderWidth: CARD_BORDER_WIDTH,
    borderColor: COLORS.card,
    backgroundColor: COLORS.card,
    shadowColor: "#000000",
    shadowOpacity: 0.44,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  photo: {
    flex: 1,
    borderRadius: CARD_RADIUS - CARD_BORDER_WIDTH,
  },
  placeholder: {
    backgroundColor: COLORS.placeholder,
  },
  title: {
    maxWidth: 340,
    marginTop: 30,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "500",
    letterSpacing: -0.3,
    color: COLORS.title,
    textAlign: "center",
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 24,
    height: ACTION_HEIGHT,
    paddingHorizontal: ACTION_HORIZONTAL_PADDING,
    borderRadius: ACTION_HEIGHT / 2,
    borderWidth: 1,
    borderColor: COLORS.actionBorder,
    backgroundColor: COLORS.action,
  },
  actionPressed: {
    backgroundColor: COLORS.actionPressed,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: -0.1,
    color: COLORS.actionLabel,
  },
});

export { EmptyCollectionState };
export type {
  ICardLayout,
  IEmptyCollectionState,
  IGlyph,
  IPhotoCard,
} from "./types";
export default memo(EmptyCollectionState);
