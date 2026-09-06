import {
  Award01Icon,
  BankIcon,
  Comment01Icon,
  CreditCardIcon,
  FingerAccessIcon,
  HelpCircleIcon,
  PreferenceHorizontalIcon,
  Settings01Icon,
  Shield01Icon,
  TranslateIcon,
} from "@hugeicons/core-free-icons";
import type {
  ISettingsProfile,
  ISettingsPromo,
  ISettingsSection,
} from "./types";
import { Platform } from "react-native";

export const DEFAULT_TITLE = "Profile";

export const DEFAULT_PROFILE: ISettingsProfile = {
  name: "Ava Bennett",
  email: "avabennett@gmail.com",
  avatar: {
    uri: "https://i.pinimg.com/736x/e4/25/db/e425db45ac27ee918a8c81b8a16656ea.jpg",
  },
};

export const DEFAULT_PROMO: ISettingsPromo = {
  title: "Upgrade to Pro",
  subtitle:
    "Unlock shared budgets, AI insights, receipt scanning, and advanced analytics.",
  actionLabel: "Upgrade",
};

export const DEFAULT_SECTIONS: ISettingsSection[] = [
  {
    id: "account",
    rows: [
      {
        id: "settings",
        title: "Settings",
        icon: Settings01Icon,
      },
      {
        id: "plan-subscription",
        title: "Plan & Subscription",
        icon: CreditCardIcon,
      },
      {
        id: "badges",
        title: "Badges",
        icon: Award01Icon,
      },
      {
        id: "linked-banks",
        title: "My Debit Cards & Linked Banks",
        icon: BankIcon,
      },
      {
        id: "biometrics",
        title: "Enable finger Print/Face ID",
        icon: FingerAccessIcon,
        accessory: "switch",
        defaultChecked: true,
      },
    ],
  },
  {
    id: "app",
    rows: [
      {
        id: "preferences",
        title: "Preferences",
        icon: PreferenceHorizontalIcon,
      },
      {
        id: "privacy-policy",
        title: "Privacy Policy",
        icon: Shield01Icon,
      },
      {
        id: "help-support",
        title: "Help & Support",
        icon: HelpCircleIcon,
      },
    ],
  },
  {
    id: "more",
    rows: [
      {
        id: "feedback",
        title: "Feedback",
        icon: Comment01Icon,
      },
      {
        id: "language",
        title: "Language",
        icon: TranslateIcon,
        accessory: "value",
        value: "English",
      },
    ],
  },
];

export const CONTENT_HORIZONTAL_PADDING = 18;
export const CONTENT_TOP_PADDING = 12;
export const CONTENT_BOTTOM_PADDING = 40;
export const HEADER_HEIGHT = 52;
export const HEADER_BUTTON_SIZE = 128;
export const CARD_RADIUS = 20;
export const CARD_CORNER_SMOOTHING = 2;
export const CARD_BORDER_WIDTH = 0.5;
export const CARD_GAP = 14;
export const PROFILE_PADDING = 16;
export const AVATAR_SIZE = 50;
export const PROMO_RADIUS = 18;
export const PROMO_PADDING = 16;
export const PROMO_ICON_SIZE = 28;
export const PROMO_GAP = 14;
export const ROW_HEIGHT = 52;
export const ROW_HORIZONTAL_PADDING = 14;
export const ROW_ICON_SIZE = 20;
export const ROW_ICON_GAP = 14;
export const SEPARATOR_INSET =
  ROW_HORIZONTAL_PADDING + ROW_ICON_SIZE + ROW_ICON_GAP;
export const SECTION_GAP = 14;
export const LABEL_GAP = 10;

export const PROMO_COLORS = ["#333333", "#1d1d1d"] as const;
export const SPARKLE_COLORS = ["#5b8cff", "#1f4fe0", "#ffff"] as const;
export const FONT_FAMILY = Platform.select({
  ios: "SF Pro Rounded",
  default: undefined,
});

export const COLORS = {
  screen: "#f3f3f3",
  title: "#111111",
  headerButton: "#e9e9e9",
  headerButtonIcon: "#111111",
  card: "#ffffff",
  cardBorder: "rgba(0,0,0,0.05)",
  cardPressed: "#f6f6f6",
  avatar: "#e4e4e4",
  name: "#111111",
  email: "#9b9b9b",
  label: "#9b9b9b",
  promoTitle: "#ffffff",
  promoSubtitle: "#b3b3b3",
  promoAction: "#efefef",
  promoActionLabel: "#141414",
  rowTitle: "#141414",
  icon: "#818181",
  value: "#9b9b9b",
  accessory: "#b0b0b0",
  separator: "rgba(0,0,0,0.07)",
  switchTrack: "#34c759",
} as const;
