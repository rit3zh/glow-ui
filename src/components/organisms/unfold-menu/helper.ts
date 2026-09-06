interface IAnchorRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface IPanelPosition {
  left: number;
  top: number;
}

function clampToScreen(
  anchor: IAnchorRect,
  panelWidth: number,
  panelHeight: number,
  screenWidth: number,
  screenHeight: number,
  margin: number,
  insetTop: number,
  insetBottom: number,
): IPanelPosition {
  const idealLeft = anchor.x + anchor.w / 2 - panelWidth / 2;
  const idealTop = anchor.y + anchor.h / 2 - panelHeight / 2;

  const minLeft = margin;
  const maxLeft = screenWidth - panelWidth - margin;
  const minTop = insetTop + margin;
  const maxTop = screenHeight - insetBottom - panelHeight - margin;

  return {
    left: Math.min(Math.max(idealLeft, minLeft), Math.max(maxLeft, minLeft)),
    top: Math.min(Math.max(idealTop, minTop), Math.max(maxTop, minTop)),
  };
}

export { clampToScreen };
export type { IAnchorRect, IPanelPosition };
