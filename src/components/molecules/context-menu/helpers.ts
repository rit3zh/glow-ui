import type { EdgeInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { GAP, SCREEN_H, SCREEN_PADDING, SCREEN_W } from "./const";
import type { IContextMenuLayout, IRect } from "./types";

function computeMenuLayout(
  rect: IRect,
  menuHeight: number,
  menuWidth: number,
  insets: EdgeInsets,
): IContextMenuLayout {
  const topSafe = insets.top + SCREEN_PADDING;
  const bottomSafe = SCREEN_H - insets.bottom - SCREEN_PADDING;

  const belowTop = rect.y + rect.h + GAP;
  const placeBelow = belowTop + menuHeight <= bottomSafe;
  const menuTop = placeBelow ? belowTop : rect.y - GAP - menuHeight;

  let shift = 0;
  if (placeBelow) {
    const overflow = menuTop + menuHeight - bottomSafe;
    if (overflow > 0) shift = -overflow;
    if (rect.y + shift < topSafe) shift = topSafe - rect.y;
  } else {
    const overflow = topSafe - menuTop;
    if (overflow > 0) shift = overflow;
    const previewBottom = rect.y + rect.h + shift;
    if (previewBottom > bottomSafe) shift = bottomSafe - (rect.y + rect.h);
  }

  const triggerCenterX = rect.x + rect.w / 2;

  const menuLeft = Math.min(
    Math.max(triggerCenterX - menuWidth / 2, SCREEN_PADDING),
    SCREEN_W - menuWidth - SCREEN_PADDING,
  );
  // Grow the menu out of the trigger's centre rather than its left edge,
  // otherwise the menu appears to swing sideways as it scales up.
  const originX = Math.min(
    Math.max(triggerCenterX - menuLeft, 0),
    menuWidth,
  );

  return {
    placeBelow,
    menuLeft,
    menuTop,
    shift,
    originX,
    originY: placeBelow ? "top" : "bottom",
  };
}

function triggerHaptic(): void {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
}

export { computeMenuLayout, triggerHaptic };
