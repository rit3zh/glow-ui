import type { StyleProp, ViewStyle } from "react-native";
/**
 *
 * @export
 * @interface CardProps
 */
export interface CardProps {
  /**
   * The content of the card.
   */
  children: React.ReactNode;

  /**
   * The style of the card.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * The class name of the card.
   */
  className?: string;
  /**
   * The radius of the card.
   */
  /**
   * The image of the card wrapper.
   */
  image?: string;

  /**
   * Wthether to use the image or not.
   * @type {boolean}
   */
  useImage?: boolean;
}

export interface CardWrapperProps {
  /**
   * The content of the card wrapper.
   */
  children: React.ReactNode;

  /**
   * The style of the card wrapper.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * The class name of the card wrapper.
   */
  className?: string;
}
