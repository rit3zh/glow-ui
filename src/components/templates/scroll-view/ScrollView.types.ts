import type { ScrollViewProps, ViewStyle } from "react-native";
import type { RefreshControlComponent } from "./base/RefreshControl.props";
import { WithSpringConfig, WithTimingConfig } from "react-native-reanimated";

export interface CustomScrollViewProps extends ScrollViewProps {
  innerRef?: any;

  /** Function to call when refresh is triggered */
  onRefresh?: () => Promise<void>;

  /** Custom refresh indicator component */
  RefreshComponent?: RefreshControlComponent;

  /** Distance needed to trigger refresh (default: 80) */
  refreshTriggerDistance?: number;

  /** Maximum distance the refresh indicator can be pulled (default: 120) */
  maxPullDistance?: number;

  /** Whether to use spring animation for content bounce (default: false) */
  useSpringAnimation?: boolean;

  /** Animation timing configuration */
  timingConfig?: WithTimingConfig;

  /** Animation spring configuration */
  springConfig?: WithSpringConfig;

  /** Whether to show the scroll indicator (default: false) */
  showScrollIndicator?: boolean;

  /** Color of the scroll indicator when shown */
  scrollIndicatorColor?: string;

  /** Custom styles for the refresh control container */
  refreshControlContainerStyle?: ViewStyle;

  /** Override styles for the content container */
  contentWrapperStyle?: ViewStyle;

  /** Whether to enable pull to refresh (default: true) */
  pullToRefreshEnabled?: boolean;

  /** Whether to enable overscroll (bouncing effect) (default: true) */
  enableOverscroll?: boolean;

  /** Resistance factor for pull (higher means more resistance) (default: 1) */
  pullResistanceFactor?: number;

  /** Whether to automatically hide the refresh indicator after refresh completes (default: true) */
  autoHideRefreshControl?: boolean;

  /** Time in ms to hide refresh indicator after completion (default: 300) */
  hideRefreshControlDelay?: number;

  /** Callback when pull distance changes */
  onPullDistanceChange?: (distance: number) => void;

  /** Whether pull-to-refresh works from any scroll position (not just top) */
  refreshFromAnyPosition?: boolean;

  /** Enable haptic feedback when reaching threshold (requires separate implementation) */
  enableHapticFeedback?: boolean;

  /** Callback fired when refresh state changes */
  onRefreshStateChange?: (isRefreshing: boolean) => void;

  /** Threshold beyond which scrolling up will allow refresh (default: 0) */
  scrollThreshold?: number;

  /** Whether to automatically scroll back to top after refresh (default: false) */
  scrollToTopAfterRefresh?: boolean;

  /** Animation duration for scrolling to top (default: 300) */
  scrollToTopDuration?: number;

  minIndicatorDisplayTime?: number;
}
