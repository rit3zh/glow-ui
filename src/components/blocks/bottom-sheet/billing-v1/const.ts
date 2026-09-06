import type { IBillingSubscription } from "./types";

export const DEFAULT_SUBTITLE = "Total cost for subscriptions";

export const DEFAULT_CURRENCY_SYMBOL = "$";

export const DEFAULT_SEARCH_PLACEHOLDER = "Search";

export const DEFAULT_PERIOD_LABEL = "1 month";

export const DEFAULT_VIEW_ALL_LABEL = "View all";

export const SHEET_CORNER_RADIUS = 42;

export const BACKDROP_OPACITY = 0.4;

export const CONTENT_BOTTOM_PADDING = 16;

export const COLORS = {
  sheet: "#ffffff",
  ink: "#111111",
  muted: "#8a8a8e",
  field: "#f2f2f2",
  fieldPressed: "#e8e8e8",
  row: "#f4f4f4",
  rowPressed: "#e9e9e9",
  divider: "#ebebeb",
  handle: "#d4d4d4",
} as const;

export const DEFAULT_SUBSCRIPTIONS: IBillingSubscription[] = [
  {
    id: "spotify",
    name: "Spotify",
    caption: "Subscription",
    amount: 12,
    brand: "spotify",
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    caption: "Subscription",
    amount: 20,
    brand: "chatgpt",
  },
  {
    id: "cursor",
    name: "Cursor",
    caption: "Subscription",
    amount: 20,
    brand: "cursor",
  },
];
