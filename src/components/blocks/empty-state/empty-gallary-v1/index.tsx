import React, { memo, useCallback, useMemo, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from "react-native";
import type { IEmptyGalleryState } from "./types";
import {
  ACTION_HEIGHT,
  ACTION_HORIZONTAL_PADDING,
  CARD_BORDER_WIDTH,
  CARD_HEIGHT,
  CARD_LAYOUTS,
  CARD_RADIUS,
  CARD_WIDTH,
  COLORS,
  DEFAULT_ACTION_LABEL,
  DEFAULT_DESCRIPTION,
  DEFAULT_PHOTOS,
  DEFAULT_TITLE,
  STACK_HEIGHT,
  STACK_WIDTH,
} from "./const";

const EmptyGalleryState: React.FC<IEmptyGalleryState> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  actionLabel = DEFAULT_ACTION_LABEL,
  photos,
  hideAction = false,
  style,
  onActionPress,
}: IEmptyGalleryState): React.ReactNode & React.ReactElement => {
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
        {CARD_LAYOUTS.map((layout, index) => {
          const source = cards[index];
          return (
            <View
              key={`${layout.rotate}-${layout.translateX}`}
              style={[
                styles.card,
                {
                  transform: [
                    { translateX: layout.translateX },
                    { translateY: layout.translateY },
                    { rotate: layout.rotate },
                  ],
                },
              ]}
            >
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
            </View>
          );
        })}
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

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
    paddingHorizontal: 24,
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
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
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
    alignSelf: "stretch",
    marginTop: 40,
    fontSize: 22,
    lineHeight: 33,
    fontWeight: "500",
    letterSpacing: -0.5,
    color: COLORS.ink,
    textAlign: "center",
  },
  description: {
    alignSelf: "stretch",
    marginTop: 12,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
    letterSpacing: -0.3,
    color: COLORS.body,
    textAlign: "center",
  },
  action: {
    marginTop: 34,
    height: ACTION_HEIGHT,
    paddingHorizontal: ACTION_HORIZONTAL_PADDING,
    borderRadius: ACTION_HEIGHT / 2,
    backgroundColor: COLORS.action,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  actionPressed: {
    backgroundColor: COLORS.actionPressed,
  },
  actionLabel: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.3,
    color: COLORS.actionLabel,
  },
});

export { EmptyGalleryState };
export type { ICardLayout, IEmptyGalleryState } from "./types";
export default memo(EmptyGalleryState);
