import {
  ImageSourcePropType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import { ReactNode } from "react";

/**
 * Types for the ParallaxHeader component props
 */
export interface ParallaxHeaderProps {
  /**
   * Title to display in the header
   */
  title: string;

  /**
   * Subtitle text (artist name, album info)
   */
  subtitle?: string;

  /**
   * Additional information line (year, song count, etc)
   */
  infoText?: string;

  /**
   * Main cover image displayed in the header
   */
  coverImage: ImageSourcePropType;

  /**
   * Background image for the top of the header (will have blur applied)
   * If not provided, coverImage will be used
   */
  backgroundImage?: ImageSourcePropType;

  /**
   * Custom height for the header when fully expanded
   * @default 380
   */
  expandedHeight?: number;

  /**
   * Custom height for the header when fully collapsed
   * @default 90
   */
  collapsedHeight?: number;

  /**
   * Sticky header title that appears when scrolling
   * Defaults to the title if not provided
   */
  navbarTitle?: string;

  /**
   * Children to render below the header (usually a ScrollView or FlatList)
   */
  children: ReactNode;

  /**
   * Background color of the header and status bar
   * @default '#000000'
   */
  headerBackgroundColor?: string;

  /**
   * Text color for the header titles
   * @default '#FFFFFF'
   */
  headerTextColor?: string;

  /**
   * Whether to enable the blur effect on the background
   * @default true
   */
  enableBlur?: boolean;

  /**
   * Intensity of the blur effect (1-100)
   * @default 60
   */
  blurIntensity?: number;

  /**
   * Tint color for the blur effect
   * @default 'rgba(0, 0, 0, 0.6)'
   */
  blurTint?: "light" | "dark" | "default";

  /**
   * Custom style for the title text
   */
  titleStyle?: StyleProp<TextStyle>;

  /**
   * Custom style for the subtitle text
   */
  subtitleStyle?: StyleProp<TextStyle>;

  /**
   * Custom style for the info text
   */
  infoTextStyle?: StyleProp<TextStyle>;

  /**
   * Custom style for the cover image container
   */
  coverImageContainerStyle?: StyleProp<ViewStyle>;

  /**
   * Custom style for the cover image
   */
  coverImageStyle?: StyleProp<ViewStyle>;

  /**
   * Actions to display in the header (like play, shuffle, favorites)
   */
  actions?: {
    icon: ReactNode;
    onPress: () => void;
  }[];

  /**
   * Left icon in the navbar
   */
  leftNavIcon?: ReactNode;

  /**
   * Right icon in the navbar
   */
  rightNavIcon?: ReactNode;

  /**
   * Function to call when the left navbar icon is pressed
   */
  onLeftNavIconPress?: () => void;

  /**
   * Function to call when the right navbar icon is pressed
   */
  onRightNavIconPress?: () => void;

  /**
   * Extra spacing at the bottom of the scrollable content
   * @default 0
   */
  bottomSpacing?: number;

  /**
   * Animation spring configuration for parallax effects
   */
  animationConfig?: {
    dampingRatio?: number;
    stiffness?: number;
    overshootClamping?: boolean;
    restDisplacementThreshold?: number;
    restSpeedThreshold?: number;
  };

  /**
   * Customize the shadow applied to the cover image
   */
  coverImageShadow?: {
    shadowColor?: string;
    shadowOffset?: { width: number; height: number };
    shadowOpacity?: number;
    shadowRadius?: number;
    elevation?: number;
  };

  /**
   * Enable or disable the floating effect on the cover image during scroll
   * @default true
   */
  enableFloatingCover?: boolean;

  /**
   * Amount of scaling applied to the cover when fully expanded
   * @default 1.0
   */
  coverScaleAmount?: number;

  /**
   * Opacity of the header background when fully collapsed
   * @default 1.0
   */
  collapsedBackgroundOpacity?: number;

  /**
   * Whether to show a gradient overlay on the header
   * @default true
   */
  showGradientOverlay?: boolean;

  /**
   * Colors for the gradient overlay
   * @default ['transparent', 'rgba(0,0,0,0.7)']
   */
  gradientColors?: [string, string, ...string[]];

  /**
   * Callback fired when scroll position changes
   */
  onScroll?: (position: number) => void;

  /**
   * Custom renderer for the header content
   */
  renderHeaderContent?: (animatedProps: {
    scrollY: any;
    titleOpacity: any;
    coverScale: any;
    coverTranslateY: any;
    headerHeight: any;
  }) => ReactNode;
}

/**
 * Default props for the ParallaxHeader component
 */
export const DEFAULT_PARALLAX_HEADER_PROPS = {
  expandedHeight: 380,
  collapsedHeight: 90,
  headerBackgroundColor: "#000000",
  headerTextColor: "#FFFFFF",
  enableBlur: true,
  blurIntensity: 60,
  blurTint: "dark" as const,
  bottomSpacing: 0,
  enableFloatingCover: true,
  coverScaleAmount: 1.0,
  collapsedBackgroundOpacity: 1.0,
  showGradientOverlay: true,
  gradientColors: ["transparent", "rgba(0,0,0,0.7)"],
  animationConfig: {
    dampingRatio: 1,
    stiffness: 300,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
  coverImageShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 15,
  },
};
