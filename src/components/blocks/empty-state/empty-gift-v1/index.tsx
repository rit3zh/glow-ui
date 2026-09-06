import React, { memo, useCallback, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { IEmptyGiftState } from "./types";
import {
  ACTION_HEIGHT,
  ACTION_HORIZONTAL_PADDING,
  ARTWORK_SIZE,
  COLORS,
  CONTENT_HORIZONTAL_PADDING,
  DEFAULT_ACTION_LABEL,
  DEFAULT_ARTWORK_URI,
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  HALO_CORE_SIZE,
  SCENE_SIZE,
} from "./const";

const EmptyGiftState: React.FC<IEmptyGiftState> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  actionLabel = DEFAULT_ACTION_LABEL,
  artwork = { uri: DEFAULT_ARTWORK_URI },
  hideAction = false,
  hideHalo = false,
  style,
  onActionPress,
}: IEmptyGiftState) => {
  const [isActionPressed, setIsActionPressed] = useState<boolean>(false);

  const handlePressIn = useCallback((): void => setIsActionPressed(true), []);
  const handlePressOut = useCallback((): void => setIsActionPressed(false), []);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.scene}>
        <Image
          source={artwork}
          style={styles.artwork}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
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
    paddingHorizontal: CONTENT_HORIZONTAL_PADDING,
    backgroundColor: COLORS.screen,
  },
  scene: {
    width: SCENE_SIZE,
    height: SCENE_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.halo,
  },
  haloCore: {
    position: "absolute",
    width: HALO_CORE_SIZE,
    height: HALO_CORE_SIZE,
    borderRadius: HALO_CORE_SIZE / 2,
    backgroundColor: COLORS.haloCore,
  },
  artwork: {
    width: ARTWORK_SIZE,
    height: ARTWORK_SIZE,
  },
  title: {
    marginTop: 4,
    fontSize: 21,
    lineHeight: 27,
    fontWeight: "700",
    letterSpacing: -0.5,
    color: COLORS.title,
    textAlign: "center",
  },
  description: {
    maxWidth: 268,
    marginTop: 8,
    fontSize: 15,
    lineHeight: 21,
    color: COLORS.description,
    textAlign: "center",
  },
  action: {
    marginTop: 28,
    height: ACTION_HEIGHT,
    paddingHorizontal: ACTION_HORIZONTAL_PADDING,
    borderRadius: ACTION_HEIGHT / 2,
    backgroundColor: COLORS.action,
    alignItems: "center",
    justifyContent: "center",
  },
  actionPressed: {
    backgroundColor: COLORS.actionPressed,
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: -0.2,
    color: COLORS.actionLabel,
  },
});

export { EmptyGiftState };
export type { IEmptyGiftState, IHaloRing } from "./types";
export default memo(EmptyGiftState);
