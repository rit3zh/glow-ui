import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { CLOSE_DURATION, OPEN_SPRING } from "./const";
import { computeMenuLayout } from "./helpers";
import type { IContextMenuLayout, IRect } from "./types";

function useContextMenuController(onOpenChange?: (open: boolean) => void) {
  const [visible, setVisible] = useState<boolean>(false);
  const [rect, setRect] = useState<IRect | null>(null);
  const [menuHeight, setMenuHeight] = useState<number>(0);
  const progress = useSharedValue(0);
  // 0 = resting, 1 = fully pressed. Shared with the preview so the handoff
  // from trigger to preview happens at the exact same scale.
  const pressed = useSharedValue(0);
  // Guards against the open spring restarting if the menu re-measures
  // (e.g. a font loads) while it is already on screen or closing.
  const opened = useRef<boolean>(false);

  const openMenu = useCallback(
    (r: IRect) => {
      progress.value = 0;
      opened.current = false;
      // menuHeight is deliberately kept from the previous open: resetting it
      // blanks the layout for a frame and relies on onLayout firing again,
      // which it may not if the menu's size is unchanged.
      setRect(r);
      setVisible(true);
      onOpenChange?.(true);
    },
    [onOpenChange, progress],
  );

  useEffect(() => {
    if (!visible) {
      opened.current = false;
      return;
    }
    if (menuHeight > 0 && !opened.current) {
      opened.current = true;
      progress.value = withSpring(1, OPEN_SPRING);
    }
  }, [visible, menuHeight, progress]);

  const close = useCallback(() => {
    onOpenChange?.(false);
    progress.value = withTiming(0, { duration: CLOSE_DURATION }, (finished) => {
      "worklet";
      if (finished) scheduleOnRN(setVisible, false);
    });
  }, [onOpenChange, progress]);

  return {
    visible,
    rect,
    menuHeight,
    progress,
    pressed,
    openMenu,
    close,
    setMenuHeight,
  };
}

function useMenuLayout(
  rect: IRect | null,
  menuHeight: number,
  menuWidth: number,
): IContextMenuLayout | null {
  const insets = useSafeAreaInsets();
  return useMemo(
    () =>
      rect && menuHeight > 0
        ? computeMenuLayout(rect, menuHeight, menuWidth, insets)
        : null,
    [rect, menuHeight, menuWidth, insets],
  );
}

export { useContextMenuController, useMenuLayout };
