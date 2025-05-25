import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";

export interface AnimationConfig {
  /**
   * Enable scale animation
   */
  scale?: boolean;

  /**
   * Enable rotation animation
   */
  rotate?: boolean;

  /**
   * Enable vertical translation animation
   */
  translateY?: boolean;
}

export interface MediaListProps<T> {
  /**
   * The data array to render
   */
  data: T[];

  /**
   * Number of items per chunk/page
   */
  chunkSize: number;

  /**
   * Function to render each item
   */
  renderItem?: (item: T, index: number) => ReactNode;

  /**
   * Function to extract unique key for each item
   */
  keyExtractor: (item: T, index: number) => string;

  /**
   * Width of the screen (defaults to window width)
   */
  screenWidth?: number;

  /**
   * Intensity of the blur effect (1-100)
   */
  blurIntensity?: number;

  /**
   * Animation configuration
   */
  animationConfig?: AnimationConfig;

  contentContainerStyle?: StyleProp<ViewStyle>;
}

export interface MediaListWrapperProps {
  children: React.ReactNode;
}

export interface MediaListTitleProps {
  children: React.ReactNode;
}
