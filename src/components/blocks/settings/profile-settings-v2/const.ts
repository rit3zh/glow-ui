import {
  Calendar03Icon,
  CallIcon,
  HelpCircleIcon,
  InformationCircleIcon,
  LanguageCircleIcon,
  LockPasswordIcon,
  Notification03Icon,
  PaintBoardIcon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";
import { Platform } from "react-native";
import type { ISettingsProfile, ISettingsSection } from "./types";

export const FONT_FAMILY = Platform.select({
  ios: "SF Pro Rounded",
  default: undefined,
});

export const DEFAULT_TITLE = "Profile";

export const DEFAULT_PROFILE: ISettingsProfile = {
  name: "Alexander the Great",
  email: "alexander@gmail.com",
  avatar: {
    uri: "https://i.pinimg.com/736x/dc/d1/99/dcd199ce5b7ec489f5dc1c1fa775c997.jpg",
  },
};

export const DEFAULT_SECTIONS: ISettingsSection[] = [
  {
    id: "account",
    rows: [
      {
        id: "manage-profile",
        title: "Manage Profile",
        icon: UserCircleIcon,
      },
      {
        id: "password-security",
        title: "Password & Security",
        icon: LockPasswordIcon,
      },
      {
        id: "notifications",
        title: "Notifications",
        icon: Notification03Icon,
      },
      {
        id: "language",
        title: "Language",
        icon: LanguageCircleIcon,
      },
      {
        id: "about-us",
        title: "About Us",
        icon: InformationCircleIcon,
      },
      {
        id: "theme",
        title: "Theme",
        icon: PaintBoardIcon,
      },
      {
        id: "appointments",
        title: "Appointments",
        icon: Calendar03Icon,
      },
      {
        id: "help-center",
        title: "Help Center",
        icon: HelpCircleIcon,
      },
      {
        id: "contact-us",
        title: "Contact Us",
        icon: CallIcon,
      },
    ],
  },
];

export const CONTENT_HORIZONTAL_PADDING = 25;
export const CONTENT_TOP_PADDING = 10;
export const CONTENT_BOTTOM_PADDING = 48;
export const HEADER_HEIGHT = 52;
export const BACK_SIZE = 36;
export const CARD_RADIUS = 20;
export const CARD_CORNER_SMOOTHING = 2;
export const CARD_BORDER_WIDTH = 0.7;
export const CARD_PADDING = 25;
export const CARD_GAP = 14;
export const AVATAR_SIZE = 75;
export const ROW_HEIGHT = 64;
export const ROW_ICON_SIZE = 27;
export const ROW_ICON_GAP = 14;
export const SECTION_GAP = 8;
export const LABEL_GAP = 10;

export const COLORS = {
  screen: "#ffffff",
  title: "#111111",
  back: "#f2f2f2",
  backIcon: "#111111",
  card: "#ffffff",
  cardBorder: "rgba(0,0,0,0.08)",
  cardPressed: "#f7f7f7",
  avatar: "#ebebeb",
  name: "#111111",
  email: "#9a9a9a",
  label: "#9a9a9a",
  rowPressed: "#f5f5f5",
  rowTitle: "#1b1b1b",
  icon: "#1b1b1b",
  value: "#9a9a9a",
  accessory: "#9a9a9a",
} as const;
