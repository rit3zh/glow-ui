import {
  CreditCardIcon,
  FingerAccessIcon,
  HelpCircleIcon,
  Mail01Icon,
  Moon02Icon,
  Notification03Icon,
  Shield01Icon,
  SquareLock01Icon,
  TranslateIcon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";
import { Platform } from "react-native";
import type { ISettingsProfile, ISettingsSection } from "./types";

export const FONT_FAMILY = Platform.select({
  ios: "SF Pro Text",
  default: undefined,
});

export const DEFAULT_TITLE = "Profile";
export const DEFAULT_SUBTITLE = "Manage your account and preferences";
export const DEFAULT_LOGOUT_LABEL = "Log Out";
export const DEFAULT_DELETE_LABEL = "Delete Account";
export const DEFAULT_VERSION_LABEL = "Version 1.0.0";

export const DEFAULT_PROFILE: ISettingsProfile = {
  name: "Ava Bennett",
  email: "avabennett@gmail.com",
  avatar: {
    uri: "https://i.pinimg.com/736x/ae/e6/00/aee600443741cb8ecf69f815d3073260.jpg",
  },
};

export const DEFAULT_SECTIONS: ISettingsSection[] = [
  {
    id: "account",
    label: "Account",
    rows: [
      {
        id: "personal-details",
        title: "Personal Details",
        icon: UserCircleIcon,
      },
      {
        id: "notifications",
        title: "Notifications",
        icon: Notification03Icon,
      },
      {
        id: "password-security",
        title: "Password & Security",
        icon: SquareLock01Icon,
      },
      {
        id: "payment-methods",
        title: "Payment Methods",
        icon: CreditCardIcon,
      },
    ],
  },
  {
    id: "preferences",
    label: "Preferences",
    rows: [
      {
        id: "appearance",
        title: "Appearance",
        icon: Moon02Icon,
        accessory: "value",
        value: "Light",
      },
      {
        id: "language",
        title: "Language",
        icon: TranslateIcon,
        accessory: "value",
        value: "English",
      },
      {
        id: "face-id",
        title: "Unlock with Face ID",
        icon: FingerAccessIcon,
        accessory: "switch",
        defaultChecked: true,
      },
    ],
  },
  {
    id: "support",
    label: "Support",
    rows: [
      {
        id: "help-center",
        title: "Help Center",
        icon: HelpCircleIcon,
      },
      {
        id: "privacy-policy",
        title: "Privacy Policy",
        icon: Shield01Icon,
      },
      {
        id: "contact-us",
        title: "Contact Us",
        icon: Mail01Icon,
      },
    ],
  },
];

export const CONTENT_HORIZONTAL_PADDING = 18;
export const CONTENT_TOP_PADDING = 10;
export const CONTENT_BOTTOM_PADDING = 32;
export const SUBTITLE_MARGIN_TOP = 4;
export const HEADER_MARGIN_BOTTOM = 20;
export const CARD_RADIUS = 22;
export const CARD_CORNER_SMOOTHING = 2;
export const CARD_BORDER_WIDTH = 0;
export const PROFILE_PADDING = 16;
export const PROFILE_GAP = 14;
export const AVATAR_SIZE = 65;
export const EDIT_SIZE = 34;
export const ROW_HEIGHT = 50;
export const ROW_HORIZONTAL_PADDING = 16;
export const ROW_ICON_SIZE = 19;
export const ROW_ICON_GAP = 13;
export const SEPARATOR_INSET =
  ROW_HORIZONTAL_PADDING + ROW_ICON_SIZE + ROW_ICON_GAP;
export const SECTION_GAP = 26;
export const LABEL_GAP = 9;
export const LOGOUT_MARGIN_TOP = 26;
export const LOGOUT_HEIGHT = 54;
export const LOGOUT_RADIUS = LOGOUT_HEIGHT / 2;
export const LOGOUT_GAP = 9;
export const DELETE_MARGIN_TOP = 10;
export const DELETE_HEIGHT = LOGOUT_HEIGHT;
export const DELETE_RADIUS = DELETE_HEIGHT / 2;
export const DELETE_GAP = LOGOUT_GAP;

export const COLORS = {
  screen: "#f2f2f7",
  title: "#000000",
  subtitle: "#8a8a8e",
  card: "#ffffff",
  cardPressed: "#f0f0f4",
  avatar: "#e3e3e8",
  name: "#000000",
  email: "#8a8a8e",
  edit: "rgba(120,120,128,0.12)",
  editIcon: "#111114",
  label: "#6d6d73",
  rowTitle: "#111114",
  icon: "#1c1c1e",
  value: "#8a8a8e",
  accessory: "#c4c4c8",
  separator: "rgba(60,60,67,0.13)",
  switchTrack: "#34c759",
  logout: "#0a0a0c",
  logoutPressed: "#2c2c30",
  logoutLabel: "#ffffff",
  deleteButton: "#ff5555",
  deleteButtonPressed: "#f0f0f4",
  deleteLabel: "#ffeceb",
  version: "#a0a0a6",
} as const;
