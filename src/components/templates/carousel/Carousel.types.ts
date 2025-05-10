import { ReactNode } from "react";

export interface AnimationConfig {
  /**
   * Enable 3D perspective effect
   */
  perspective?: boolean;

  /**
   * Enable parallax effect
   */
  parallax?: boolean;

  /**
   * Enable fade effect
   */
  fade?: boolean;

  /**
   * Enable scale effect
   */
  scale?: boolean;
}

export interface CarouselProps<T> {
  /**
   * The data array to render
   */
  data: T[];

  /**
   * Function to render each item
   */
  renderItem?: (item: T, index: number) => ReactNode;

  /**
   * Function to extract unique key for each item
   */
  keyExtractor: (item: T, index: number) => string;

  /**
   * Width of each carousel item (defaults to 80% of screen width)
   */
  itemWidth?: number;

  /**
   * Spacing between items
   */
  itemSpacing?: number;

  /**
   * Scale of active item (1 = 100%)
   */
  activeScale?: number;

  /**
   * Scale of inactive items (0.9 = 90%)
   */
  inactiveScale?: number;

  /**
   * Animation configuration
   */
  animationConfig?: AnimationConfig;
}
