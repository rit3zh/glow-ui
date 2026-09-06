import * as React from "react";
import { memo, useMemo } from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  TOAST_GAP,
  TOAST_LIFETIME,
  TOAST_VIEWPORT_OFFSET,
  TOAST_VISIBLE,
} from "./toast.constants";
import { toastEmitter } from "./toast.store";
import {
  createToastStyles,
  darkColors,
  getToastAccent,
  lightColors,
  ToastThemeContext,
} from "./toast.theme";
import type {
  IToast,
  IToaster,
  IToastHeight,
  IToastToDismiss,
  TToastHeightMap,
  TToastId,
  TToastPosition,
} from "./Toast.types";
import { ToastItem } from "./internal/toast-item";

function isDismiss(value: IToast | IToastToDismiss): value is IToastToDismiss {
  return (value as IToastToDismiss).dismiss === true;
}

/** Shared identity so a region with no measurements yet never re-renders on it. */
const EMPTY_HEIGHTS: TToastHeightMap = new Map();

const Toaster = memo(
  ({
    position = "bottom",
    duration = TOAST_LIFETIME,
    gap = TOAST_GAP,
    visibleToasts = TOAST_VISIBLE,
    expand = false,
    offset = TOAST_VIEWPORT_OFFSET,
    closeButton = false,
    swipeToDismiss = true,
    swipeDirection = "any",
    swipeAction,
    haptics = true,
    theme = "system",
    colors: colorOverrides,
    icons,
    style,
    toastStyle,
    titleStyle,
    descriptionStyle,
  }: IToaster) => {
    const insets = useSafeAreaInsets();
    const scheme = useColorScheme();
    const [toasts, setToasts] = React.useState<IToast[]>([]);
    const [heights, setHeights] = React.useState<IToastHeight[]>([]);
    const [expanded, setExpanded] = React.useState(false);
    const [interacting, setInteracting] = React.useState(false);

    const themeValue = useMemo(() => {
      const resolved = theme === "system" ? (scheme ?? "dark") : theme;
      const base = resolved === "light" ? lightColors : darkColors;
      const merged = colorOverrides ? { ...base, ...colorOverrides } : base;

      return {
        colors: merged,
        accents: getToastAccent(merged),
        styles: createToastStyles(merged),
      };
    }, [theme, scheme, colorOverrides]);

    React.useEffect(() => {
      return toastEmitter.subscribe((incoming) => {
        if (isDismiss(incoming)) {
          setToasts((prev) =>
            prev.map((t) =>
              t.id === incoming.id ? { ...t, delete: true } : t,
            ),
          );
          return;
        }

        setToasts((prev) => {
          const i = prev.findIndex((t) => t.id === incoming.id);
          if (i > -1) {
            const next = [...prev];
            next[i] = { ...next[i], ...incoming, delete: false };
            return next;
          }
          return [incoming, ...prev];
        });
      });
    }, []);

    const removeToast = React.useCallback((toast: IToast) => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      setHeights((prev) => prev.filter((h) => h.toastId !== toast.id));
      toastEmitter.remove(toast.id);
    }, []);

    React.useEffect(() => {
      if (toasts.length <= 1) setExpanded(false);
    }, [toasts.length]);

    const toggleExpand = React.useCallback(() => {
      setExpanded((prev) => !prev);
    }, []);

    /**
     * One pass builds every region's toast list. Filtering per item instead
     * turned a burst of toasts into O(n^2) array walks on the JS thread — the
     * exact frames the newest toast is trying to animate in on.
     */
    const regions = React.useMemo(() => {
      const buckets = new Map<TToastPosition, IToast[]>();
      for (const toast of toasts) {
        const pos = toast.position ?? position;
        const bucket = buckets.get(pos);
        if (bucket) bucket.push(toast);
        else buckets.set(pos, [toast]);
      }
      return Array.from(buckets, ([pos, list]) => ({ pos, list }));
    }, [toasts, position]);

    /** Same idea for measurements: one map per region, not one scan per item. */
    const heightMaps = React.useMemo(() => {
      const maps = new Map<TToastPosition, Map<TToastId, number>>();
      for (const entry of heights) {
        const map = maps.get(entry.position);
        if (map) map.set(entry.toastId, entry.height);
        else maps.set(entry.position, new Map([[entry.toastId, entry.height]]));
      }
      return maps;
    }, [heights]);

    if (toasts.length === 0) return null;

    return (
      <ToastThemeContext.Provider value={themeValue}>
        <GestureHandlerRootView
          pointerEvents="box-none"
          style={StyleSheet.absoluteFill}
        >
          {regions.map(({ pos, list: regionToasts }) => {
            const isBottom = pos === "bottom";
            const regionHeights = heightMaps.get(pos) ?? EMPTY_HEIGHTS;

            return (
              <View
                key={pos}
                pointerEvents="box-none"
                style={[
                  themeValue.styles.region,
                  isBottom
                    ? { bottom: insets.bottom + offset }
                    : { top: insets.top + offset },
                  { left: offset, right: offset },
                  style,
                ]}
              >
                {regionToasts.map((toast, index) => (
                  <ToastItem
                    key={toast.id}
                    toast={toast}
                    toasts={regionToasts}
                    heightMap={regionHeights}
                    index={index}
                    expanded={expanded}
                    expandByDefault={expand}
                    interacting={interacting}
                    gap={gap}
                    position={pos}
                    visibleToasts={visibleToasts}
                    closeButton={closeButton}
                    swipeToDismiss={swipeToDismiss}
                    swipeDirection={swipeDirection}
                    swipeAction={swipeAction}
                    haptics={haptics}
                    duration={duration}
                    icons={icons}
                    toastStyle={toastStyle}
                    titleStyle={titleStyle}
                    descriptionStyle={descriptionStyle}
                    setHeights={setHeights}
                    removeToast={removeToast}
                    onInteractingChange={setInteracting}
                    onExpand={toggleExpand}
                  />
                ))}
              </View>
            );
          })}
        </GestureHandlerRootView>
      </ToastThemeContext.Provider>
    );
  },
);

Toaster.displayName = "Toaster";

export { Toaster };
