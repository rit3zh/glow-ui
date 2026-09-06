import {
  LegalDocument01Icon,
  Mail01Icon,
  Settings01Icon,
  StarsIcon,
  UserCircleIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import type { ISettingsHeader, ISettingsSection } from "./types";

export const DEFAULT_HEADER: ISettingsHeader = {
  name: "Sylvan",
  avatar: {
    uri: "https://i.pinimg.com/736x/ec/a0/d5/eca0d5379f667b287ea531339999923b.jpg",
  },
};

export const DEFAULT_SECTIONS: ISettingsSection[] = [
  {
    id: "personalize",
    label: "Personalize",
    rows: [
      {
        id: "personal-details",
        title: "Personal & Fitness Details",
        icon: { kind: "hugeicon", icon: UserCircleIcon },
      },
      {
        id: "settings",
        title: "Settings",
        icon: { kind: "hugeicon", icon: Settings01Icon },
      },
    ],
  },
  {
    id: "help",
    label: "Need Help?",
    rows: [
      {
        id: "contact-us",
        title: "Contact Us",
        icon: { kind: "hugeicon", icon: Mail01Icon },
      },
    ],
  },
  {
    id: "social",
    label: "Get Involved",
    rows: [
      {
        id: "instagram",
        title: "Instagram",
        icon: { kind: "instagram" },
        accessory: "external",
      },
      {
        id: "reddit",
        title: "Reddit",
        icon: { kind: "reddit" },
        accessory: "external",
      },
    ],
  },
  {
    id: "advocacy",
    rows: [
      {
        id: "write-a-review",
        title: "Write a Review",
        icon: { kind: "hugeicon", icon: StarsIcon },
        accessory: "external",
      },
      {
        id: "recommend",
        title: "Recommend The Outsiders",
        icon: { kind: "hugeicon", icon: UserGroupIcon },
      },
    ],
  },
  {
    id: "legal",
    label: "Legal",
    rows: [
      {
        id: "terms-of-use",
        title: "Terms of Use",
        icon: { kind: "hugeicon", icon: LegalDocument01Icon },
      },
    ],
  },
];

export const CONTENT_HORIZONTAL_PADDING = 20;
export const CONTENT_TOP_PADDING = 14;
export const CONTENT_BOTTOM_PADDING = 48;
export const SHEET_RADIUS = 22;
export const CLOSE_SIZE = 38;
export const AVATAR_SIZE = 118;
export const GROUP_RADIUS = 20;
export const GROUP_CORNER_SMOOTHING = 1;
export const GROUP_BORDER_WIDTH = 0.5;
export const ROW_HEIGHT = 54;
export const ROW_HORIZONTAL_PADDING = 16;
export const ROW_ICON_SIZE = 22;
export const ROW_ICON_GAP = 14;
export const SEPARATOR_INSET =
  ROW_HORIZONTAL_PADDING + ROW_ICON_SIZE + ROW_ICON_GAP;
export const SECTION_GAP = 26;
export const GROUP_GAP = 12;

export const COLORS = {
  screen: "#1c1c1c",
  close: "#3a3a3a",
  closeIcon: "#f2f2f2",
  avatar: "#3a3a3a",
  name: "#ffffff",
  label: "#8e8e8e",
  group: "#2c2c2c",
  groupBorder: "rgba(255,255,255,0.04)",
  separator: "rgba(255,255,255,0.09)",
  rowPressed: "rgba(255,255,255,0.07)",
  title: "#f5f5f5",
  icon: "#ffffff",
  accessory: "#8a8a8a",
} as const;
