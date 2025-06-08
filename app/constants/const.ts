import { SFSymbol } from "expo-symbols";
import { Color } from "swiftui-native";

interface IScreenComponents {
  title: string;
  icon: SFSymbol;
  foregroundColor?: string;
  experimental?: boolean;
  path?: string;
}

export const COMPONENTS: IScreenComponents[] = [
  {
    title: "Action Card",
    icon: "folder",
    path: "components/action-card",
  },
  {
    title: "Avatar",
    icon: "square.stack",
    path: "components/avatar",
  },
  {
    title: "Avatar Group",
    icon: "square.stack.3d.down.forward.fill",
    path: "components/avatar-group",
  },
  {
    title: "Accordion",
    icon: "square.2.layers.3d",
    path: "components/accordion",
  },
  {
    title: "Badge",
    icon: "app.badge",
    path: "components/badge",
  },
  {
    title: "Breadcrumbs",
    icon: "magazine",
    path: "components/breadcrumbs",
  },
  {
    title: "Button",
    icon: "button.horizontal",
    path: "components/button",
  },
  {
    title: "Cards",
    icon: "menucard",
    path: "components/cards",
  },
  {
    title: "Chip",
    icon: "flame",
    path: "components/chip",
  },
  {
    title: "Center",
    icon: "align.horizontal.center",
    path: "components/center",
  },
  {
    title: "Check Box",
    icon: "app.badge",
    path: "components/check-box",
  },
  {
    title: "Divider",
    icon: "divide",
    path: "components/divider",
  },
  {
    title: "Dialog",
    icon: "exclamationmark",
    path: "components/dialog",
  },
  {
    title: "Header",
    icon: "sparkles.tv",
    path: "components/header",
  },
  {
    title: "List",
    icon: "list.bullet",
    path: "components/list",
  },
  {
    title: "Loader",
    icon: "progress.indicator",
    path: "components/loader",
  },
  {
    title: "Pagination",
    icon: "ellipsis",
    path: "components/pagination",
  },
  {
    title: "Search Bar",
    icon: "magnifyingglass",
    path: "components/search-bar",
  },
  {
    title: "Shimmer",
    icon: "sparkles",
    path: "components/shimmer",
  },
  {
    title: "Stepper",
    icon: "square.stack.3d.up",
    path: "components/stepper",
  },
  {
    title: "Timeline",
    icon: "timeline.selection",
    path: "components/timeline",
  },
  {
    title: "Toast",
    icon: "lanyardcard",
    path: "components/toast",
  },
  {
    title: "Animated Masked Text",
    icon: "text.alignright",
    path: "components/animated-masked-text",
  },
  {
    title: "Privacy Notice Link",
    icon: "checkmark",
    path: "components/privacy-notice-link",
  },
  {
    title: "Ripple",
    icon: "hand.tap",
    path: "components/ripple",
  },
  {
    title: "Title",
    icon: "text.aligncenter",
    path: "components/title",
  },
  {
    title: "Subtitle",
    icon: "textformat.size",
    path: "components/subtitle",
  },
  {
    title: "Switch",
    icon: "switch.2",
    path: "components/switch",
  },
  {
    title: "SeekBar",
    icon: "slider.horizontal.below.rectangle",
    path: "components/seek-bar",
  },
  {
    title: "Touchable",
    icon: "hand.draw",
    path: "components/touchable",
  },
  {
    title: "Progress",
    icon: "bolt",
    path: "components/progress",
  },
  {
    title: "Segmented Control",
    icon: "switch.2",
    path: "components/segmented-control",
  },

  {
    title: "Media List",
    icon: "list.bullet.indent",
    path: "components/media-list",
  },
  {
    title: "Floating Sheet",
    icon: "align.vertical.bottom",
    experimental: true,
    path: "components/floating-sheet",
  },
  {
    title: "What's New",
    icon: "sparkles.rectangle.stack",
    experimental: false,
    path: "components/whats-new",
  },
];
