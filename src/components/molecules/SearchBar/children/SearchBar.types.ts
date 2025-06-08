import type {
  TextInputProps,
  ViewStyle,
  TextStyle,
  DimensionValue,
  StyleProp,
} from "react-native";

export interface SearchBarProps {
  /**
   * Placeholder text for the search input
   * @default "Search..."
   */
  placeholder?: string;
  /**
   * Callback when search text changes
   */
  onSearch?: (query: string) => void;
  /**
   * Callback when search is cleared
   */
  onClear?: () => void;
  /**
   * Additional style for the container
   */
  style?: ViewStyle;
  /**
   * Style for the input
   */
  inputStyle?: TextStyle;
  /**
   * Width of the search bar
   * @default "100%"
   */
  width?: DimensionValue;
  /**
   * Maximum width of the search bar
   * @default screenWidth - 32
   */
  maxWidth?: number;
  /**
   * Height of the parent container
   * @default 40
   */
  parentHeight?: number | 40;
  /**
   * Tint color for the search
   */
  tint?: string;
  /**
   * Padding around the icon
   * @default 8
   */
  iconPadding?: number;

  renderTrailingIcons?: () => React.ReactNode;
  renderLeadingIcons?: () => React.ReactNode;

  onSearchDone?: () => void;

  onSearchMount?: () => void;

  // New flexibility props
  containerWidth?: number;
  focusedWidth?: number;
  cancelButtonWidth?: number;
  iconStyle?: StyleProp<ViewStyle>;
  enableWidthAnimation?: boolean;
  centerWhenUnfocused?: boolean;
  textCenterOffset?: number;
  iconCenterOffset?: number;
}
