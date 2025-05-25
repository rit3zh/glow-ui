import type { TextInputProps } from "react-native";

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
   * Additional class name for styling
   */
  className?: string;
  /**
   * Height of the parent container
   * @default 40
   */
  parentHeight?: number | 40;
  /**
   * Tint color for the search
   */
  tint?: string;

  renderTrailingIcons?: () => React.ReactNode;
  renderLeadingIcons?: () => React.ReactNode;

  onSearchDone?: () => void;

  onSearchMount?: () => void;
}
