import type { ISkeletonRow } from "./types";

export const DEFAULT_TITLE = "Your inbox is empty";

export const DEFAULT_DESCRIPTION =
  "Once you start a new conversation, you'll see new messages here";

export const DEFAULT_ACTION_LABEL = "Start a conversation";

export const CONTENT_HORIZONTAL_PADDING = 24;

export const SKELETON_CIRCLE_SIZE = 44;

export const SKELETON_LINE_HEIGHT = 10;

export const SKELETON_LINE_RADIUS = 4;

export const SKELETON_LINE_GAP = 8;

export const SKELETON_ROW_GAP = 20;

export const SKELETON_ROWS: ISkeletonRow[] = [
  { opacity: 1, scale: 1, lineWidths: [120, 200, 70] },
  { opacity: 0.55, scale: 0.97, lineWidths: [96, 176, 58] },
  { opacity: 0.24, scale: 0.94, lineWidths: [78, 150, 48] },
];

export const PULSE_MIN_OPACITY = 0.55;

export const PULSE_MAX_OPACITY = 1;

export const PULSE_DURATION = 1100;

export const ACTION_HEIGHT = 52;

export const ACTION_HORIZONTAL_PADDING = 26;

export const COLORS = {
  screen: "#ffffff",
  title: "#222222",
  description: "#8c9197",
  skeleton: "#e8e9ed",
  skeletonStrong: "#dfe1e7",
  accent: "#266ef1",
  accentPressed: "#1b57c4",
  actionLabel: "#ffffff",
} as const;
