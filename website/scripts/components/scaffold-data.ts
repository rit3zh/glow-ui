import type { CategoryType } from "./config";

export interface ScaffoldEntry {
  category: CategoryType;
  title: string;
  /** lucide icon name, matching what the sidebar renders. */
  icon: string;
  description: string;
  /**
   * Overrides the props type the page's table renders. Only needed when the
   * type is not named after the slug — `ISiriIOS27` for `siri-ios-27`.
   */
  typeName?: string;
}

/**
 * Editorial metadata for pages the scaffolder creates.
 *
 * Title, icon and description are the parts a generator cannot infer well, so
 * they are written here once. Everything else on a scaffolded page — the
 * dependency list, the props table, the two video slots — is derived from the
 * component's own source at generation time.
 *
 * A component missing from this table is still scaffolded, with a title derived
 * from its slug and no description; the CLI lists those so they can be filled in.
 */
export const scaffoldData: Record<string, ScaffoldEntry> = {
  "3d-carousel": {
    category: "components",
    title: "3D Carousel",
    icon: "Box",
    description:
      "A cylindrical carousel driven by drag, with snapping and depth-based opacity",
  },
  "action-rail": {
    category: "components",
    title: "Action Rail",
    icon: "Menu",
    description: "A horizontal rail of actions that expands and collapses with spring motion",
  },
  "animated-chip": {
    category: "micro-interactions",
    title: "Animated Chip",
    icon: "Tag",
    description: "A chip that animates its icon and label as it is selected",
  },
  "arc-list": {
    category: "components",
    title: "Arc List",
    icon: "Spline",
    description: "A list whose items curve along an arc as they scroll",
  },
  "aura-lift": {
    category: "micro-interactions",
    title: "Aura Lift",
    icon: "Sparkles",
    description: "A card that lifts off the surface with a soft glowing aura on press",
  },
  "border-beam": {
    category: "micro-interactions",
    title: "Border Beam",
    icon: "Scan",
    description: "A beam of light that travels continuously around a container's border",
  },
  "bouncy-accordion": {
    category: "components",
    title: "Bouncy Accordion",
    icon: "ChevronsUpDown",
    description: "An accordion that expands and collapses with springy overshoot",
  },
  "chrome-backdrop": {
    category: "shaders",
    title: "Chrome Backdrop",
    icon: "Aperture",
    description: "A Skia backdrop with liquid metallic reflections that drift over time",
  },
  "circular-progress": {
    category: "components",
    title: "Circular Progress",
    icon: "LoaderCircle",
    description: "A circular progress indicator with an animated sweep and gesture control",
  },
  "context-menu": {
    category: "components",
    title: "Context Menu",
    icon: "MousePointerClick",
    description: "A long-press context menu with a blurred backdrop and a scaled preview",
  },
  "dia-text": {
    category: "texts",
    title: "Dia Text",
    icon: "Type",
    description: "Text that reveals itself word by word out of a diffused blur",
  },
  "dust-text": {
    category: "texts",
    title: "Dust Text",
    icon: "Sparkles",
    description:
      "Text that dissolves into drifting particles of dust and reassembles itself",
  },
  "expandable-view": {
    category: "components",
    title: "Expandable View",
    icon: "Expand",
    description: "A view that expands into a full-screen detail with a shared transition",
  },
  "fade-component": {
    category: "components",
    title: "Fade Component",
    icon: "Blend",
    description: "Fades its children in and out as they enter and leave the tree",
  },
  "fan-menu": {
    category: "components",
    title: "Fan Menu",
    icon: "Fan",
    description: "A radial menu whose items fan out from their trigger",
  },
  "gooey-popover": {
    category: "components",
    title: "Gooey Popover",
    icon: "MessageCircle",
    description: "A popover that emerges from its trigger with a gooey metaball effect",
  },
  "gooey-search-tabs": {
    category: "components",
    title: "Gooey Search Tabs",
    icon: "Search",
    description: "A tab bar that morphs into a search field with a gooey transition",
  },
  "gradient-avatar": {
    category: "components",
    title: "Gradient Avatar",
    icon: "CircleUser",
    description: "An avatar with a gradient generated deterministically from its seed",
  },
  "gradient-wave-text": {
    category: "texts",
    title: "Gradient Wave Text",
    icon: "Waves",
    description: "Text with a gradient that waves continuously across the glyphs",
  },
  "letter-swarm": {
    category: "texts",
    title: "Letter Swarm",
    icon: "Shapes",
    description:
      "A Skia atlas of letters that swarms into any SVG outline and scatters on touch",
    typeName: "ILetterSwarm",
  },
  "liquid-chrome-text": {
    category: "texts",
    title: "Liquid Chrome Text",
    icon: "Droplet",
    description: "Text filled with a liquid chrome shader that flows as it animates",
  },
  "masked-tab-bar": {
    category: "components",
    title: "Masked Tab Bar",
    icon: "LayoutPanelTop",
    description: "A tab bar whose active item is revealed through an animated mask",
  },
  "media-list": {
    category: "components",
    title: "Media List",
    icon: "ListVideo",
    description: "A media list with animated artwork and scroll-linked rows",
  },
  metal: {
    category: "shaders",
    title: "Metal",
    icon: "Gem",
    description: "A Skia metallic surface with configurable gradient stops",
  },
  "mobile-dock": {
    category: "components",
    title: "Mobile Dock",
    icon: "Dock",
    description: "A dock whose icons magnify as a finger passes over them",
  },
  "morph-fab": {
    category: "micro-interactions",
    title: "Morph FAB",
    icon: "Plus",
    description: "A floating action button that morphs open into a menu",
  },
  "morphing-tabbar": {
    category: "components",
    title: "Morphing Tab Bar",
    icon: "LayoutPanelTop",
    description: "A tab bar that morphs its indicator between items as they are selected",
    typeName: "IMorphicTabBarRoot",
  },
  "nebula-orb": {
    category: "shaders",
    title: "Nebula Orb",
    icon: "Orbit",
    description: "A Skia orb with swirling nebula colour and depth",
  },
  "number-flow": {
    category: "micro-interactions",
    title: "Number Flow",
    icon: "Hash",
    description: "Digits that roll and slide into place as the value changes",
  },
  pressable: {
    category: "micro-interactions",
    title: "Pressable",
    icon: "Pointer",
    description: "A pressable with configurable scale, haptics and press motion",
  },
  "range-slider": {
    category: "components",
    title: "Range Slider",
    icon: "SlidersHorizontal",
    description: "A two-thumb range slider driven by gestures",
  },
  "save-button": {
    category: "micro-interactions",
    title: "Save Button",
    icon: "Bookmark",
    description: "A save button that animates between its states as it is pressed",
  },
  "seek-bar": {
    category: "components",
    title: "Seek Bar",
    icon: "AudioLines",
    description: "A media seek bar that expands while it is being scrubbed",
  },
  "shimmer-wave-text": {
    category: "texts",
    title: "Shimmer Wave Text",
    icon: "Sparkle",
    description: "Text with a shimmer that waves across it in a loop",
  },
  "siri-ios-27": {
    category: "shaders",
    title: "Siri iOS 27",
    icon: "Mic",
    description: "A Skia Siri style orb with a reactive glow",
    typeName: "ISiriIOS27",
  },
  tray: {
    category: "components",
    title: "Tray",
    icon: "PanelBottom",
    description: "A bottom tray that stacks and resizes around its content",
  },
  "verified-badge": {
    category: "components",
    title: "Verified Badge",
    icon: "BadgeCheck",
    description:
      "A compound verified badge with a themed palette, label and check mark",
    typeName: "IVerifiedBadgeRoot",
  },
  "unfold-menu": {
    category: "components",
    title: "Unfold Menu",
    icon: "Menu",
    description: "A menu that unfolds its items with a staggered rotation",
  },
  unstable_orb: {
    category: "shaders",
    title: "Orb",
    icon: "Circle",
    description: "An experimental Skia orb with animated turbulence",
  },
  /* ---- charts ----------------------------------------------------------- */

  "bar-chart": {
    category: "charts",
    title: "Bar Chart",
    icon: "BarChart3",
    description:
      "A compound bar chart with its own grid, axes, highlight and tooltip parts",
  },
  "line-chart": {
    category: "charts",
    title: "Line Chart",
    icon: "LineChart",
    description:
      "A compound line chart with an area fill, a draggable cursor and a tooltip that tracks it",
  },

  /* ---- primitives -------------------------------------------------------- */

  dialog: {
    category: "primitives",
    title: "Dialog",
    icon: "MessageSquare",
    description:
      "A modal dialog with a backdrop, focusable content and its own header and action parts",
  },
  "icon-tile": {
    category: "primitives",
    title: "Icon Tile",
    icon: "SquareRoundCorner",
    description:
      "A rounded app-icon tile with a tonal gradient and a gloss highlight over the glyph",
  },
  list: {
    category: "primitives",
    title: "List",
    icon: "List",
    description:
      "A grouped settings-style list with rows, sections, insets and animated disclosure",
  },
  "ripple-button": {
    category: "primitives",
    title: "Ripple Button",
    icon: "MousePointerClick",
    description: "A button that spreads a ripple from the point of contact on press",
  },
  switch: {
    category: "primitives",
    title: "Switch",
    icon: "ToggleRight",
    description: "A spring-driven switch that interpolates its track and thumb as it flips",
  },
  tabs: {
    category: "primitives",
    title: "Tabs",
    icon: "PanelTop",
    description: "A tab bar with an indicator that measures and animates to the active tab",
  },
  toggle: {
    category: "primitives",
    title: "Toggle",
    icon: "ToggleLeft",
    description: "A two-state toggle button that animates between pressed and released",
  },

  /* ---- pieces ------------------------------------------------------------ */

  "barcode-badge": {
    category: "components",
    title: "Barcode Badge",
    icon: "Barcode",
    description: "A barcode badge whose bar pattern is seeded from its own label",
  },
  "book-page": {
    category: "components",
    title: "Book Page",
    icon: "BookOpen",
    description: "An open book with a cover, spine and ruled page, built from themed parts",
  },
  coupon: {
    category: "components",
    title: "Coupon",
    icon: "TicketPercent",
    description:
      "A coupon with a discount panel, a code and a dashed or solid tear edge, in either orientation",
  },
  "event-ticket-card": {
    category: "components",
    title: "Event Ticket Card",
    icon: "Ticket",
    description:
      "An event ticket with a perforated tear line between the body and its barcode stub",
  },
  "photo-stack": {
    category: "components",
    title: "Photo Stack",
    icon: "Images",
    description: "A scattered stack of framed photos, each with its own caption",
  },
  polaroid: {
    category: "components",
    title: "Polaroid",
    icon: "Image",
    description: "An instant photo on paper, taped at the corner, with a caption and meta line",
  },
  "profile-card": {
    category: "components",
    title: "Profile Card",
    icon: "IdCard",
    description: "A profile card with a cover, avatar, handle, bio and stat row",
  },
  "receipt-card": {
    category: "components",
    title: "Receipt Card",
    icon: "ReceiptText",
    description:
      "A printed receipt with dotted leaders between each item and its value, a rule and a total",
  },
  "social-button": {
    category: "components",
    title: "Social Button",
    icon: "LogIn",
    description:
      "A sign-in button carrying seven brand marks, in outline, filled or ghost form",
  },

  "verified-shine": {
    category: "micro-interactions",
    title: "Verified Shine",
    icon: "BadgeCheck",
    description: "A verified badge with a light sweeping across it on a loop",
  },
};

/**
 * Components whose source lives in `app/components` but which are documented as
 * full-screen templates under `/templates`, not as components.
 */
export const templateSlugs = new Set([
  "chat-v1",
  "settings-v1",
  "sign-up-v1",
  "sign-up-v2",
  "property-detail-v1",
]);

/**
 * Components with source in `app/components` that are deliberately not
 * documented — no page has been written for them on purpose. Without this the
 * scaffolder would recreate a page every time someone deletes one.
 */
export const undocumentedSlugs = new Set(["media-list"]);

/** Install name -> the label the page's dependency note shows. */
export const dependencyLabels: Record<string, string> = {
  "react-native-reanimated": "React Native Reanimated",
  "react-native-gesture-handler": "React Native Gesture Handler",
  "@shopify/react-native-skia": "React Native Skia",
  "react-native-safe-area-context": "Safe Area Context",
  "expo-haptics": "Expo Haptics",
  "expo-linear-gradient": "Expo Linear Gradient",
  "expo-blur": "Expo Blur",
  "expo-image": "Expo Image",
  "expo-symbols": "Expo Symbols",
  "expo-font": "Expo Font",
  "@expo/vector-icons": "Expo Vector Icons",
  "react-native-svg": "React Native SVG",
  "@react-native-masked-view/masked-view": "Masked View",
};
