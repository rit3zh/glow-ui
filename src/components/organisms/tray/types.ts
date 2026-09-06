import type { ReactNode } from "react";
import type {
  LayoutChangeEvent,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import type {
  SharedValue,
  WithSpringConfig,
  WithTimingConfig,
} from "react-native-reanimated";
import type { PanGesture } from "react-native-gesture-handler";

type TTrayTheme = "light" | "dark";

interface ITrayPalette {
  readonly surface: string;
  readonly border: string;
  readonly handle: string;
  readonly text: string;
  readonly mutedText: string;
  readonly backdrop: string;
}

interface ITrayIconState {
  readonly color: string;
  readonly size: number;
}

type TTrayDetent = number | `${number}%`;

/** Axis a view slides along when navigating. `none` cross-fades in place. */
type TTrayViewAxis = "x" | "y" | "none";

/**
 * Every tunable in the tray's motion, in one place. Callers pass a partial and
 * it is merged over the defaults, so they override only what they care about.
 */
interface ITrayMotion {
  /** Presenting and dismissing the sheet. */
  readonly presentSpring: WithSpringConfig;
  /** Scale the sheet grows from as it presents. 1 disables the scale. */
  readonly startScale: number;
  /** Extra distance travelled off-screen, so the sheet clears its shadow. */
  readonly travelPadding: number;

  /** Resizing to new content — the one animation that costs a layout pass. */
  readonly heightSpring: WithSpringConfig;

  /** Settling onto a detent after a drag or a flick. */
  readonly detentSpring: WithSpringConfig;
  /** Returning to rest when a drag is released without dismissing. */
  readonly dragReturnSpring: WithSpringConfig;
  /** Overscroll resistance above the tallest detent. Higher travels less. */
  readonly overDragFactor: number;
  /** How far the backdrop fades out at full drag, as a fraction. */
  readonly backdropFalloff: number;
  /** Seconds of deceleration used to project a flick onto a detent. */
  readonly flickProjection: number;

  /** A view arriving in the stack. */
  readonly viewInSpring: WithSpringConfig;
  /** A view leaving. */
  readonly viewOutTiming: WithTimingConfig;
  /** Distance a view travels as it enters. 0 cross-fades. */
  readonly viewSlide: number;
  /** Scale a view enters from. 1 disables the scale. */
  readonly viewStartScale: number;
  readonly viewAxis: TTrayViewAxis;

  /** Vertical movement before the pan claims the gesture. */
  readonly activeOffsetY: [number, number];
  /** Horizontal movement that makes the pan give up entirely. */
  readonly failOffsetX: [number, number];
  readonly scrollDeceleration: number;
}

interface ITrayContext {
  visible: boolean;
  view: string;
  /** +1 when the last navigation pushed, -1 when it popped. */
  direction: number;
  canGoBack: boolean;
  open: (view?: string) => void;
  close: () => void;
  setView: (view: string) => void;
  goBack: () => void;

  height: SharedValue<number>;
  present: SharedValue<number>;
  dragY: SharedValue<number>;
  travel: SharedValue<number>;
  /** Live content scroll offset, used for the drag/scroll hand-off. */
  scrollY: SharedValue<number>;
  /** True while the tray itself owns the gesture rather than the scrollable. */
  isDragging: SharedValue<boolean>;
  /** Set by `Tray.ScrollView` so the tray knows a scrollable is present. */
  hasScrollable: SharedValue<boolean>;
  /** Live distance below the fully-expanded position. 0 means expanded. */
  offset: SharedValue<number>;
  /** Detent offsets, ascending. Index 0 is always fully expanded. */
  offsets: number[];
  /** Height the sheet occupies in detent mode; 0 when auto-sizing. */
  detentHeight: number;

  pan: PanGesture;
  onContentLayout: (event: LayoutChangeEvent) => void;
  palette: ITrayPalette;
  radius: number;
  motion: ITrayMotion;
  reduceMotion: boolean;
}

interface ITray {
  children: ReactNode;
  readonly defaultView?: string;
  readonly open?: boolean;
  readonly defaultOpen?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
  readonly onViewChange?: (view: string) => void;
  readonly theme?: TTrayTheme;
  readonly palette?: Partial<ITrayPalette>;
  readonly radius?: number;
  readonly closeThreshold?: number;
  readonly closeVelocity?: number;
  readonly dismissOnBackdropPress?: boolean;
  readonly enableDragToDismiss?: boolean;
  readonly motion?: Partial<ITrayMotion>;
  readonly detents?: readonly TTrayDetent[];
  readonly initialDetent?: number;
  readonly onDetentChange?: (index: number) => void;
}

interface ITrayTrigger {
  children: ReactNode;
  readonly view?: string;
  readonly style?: StyleProp<ViewStyle>;
}

interface ITrayContent {
  children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface ITrayView {
  children: ReactNode;
  readonly id: string;
  readonly style?: StyleProp<ViewStyle>;
}

interface ITrayHeader {
  children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface ITrayTitle {
  children: ReactNode;
  readonly style?: StyleProp<TextStyle>;
}

interface ITraySubtitle extends ITrayTitle {}

interface ITrayBody {
  children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface ITrayFooter {
  children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface ITrayClose {
  children?: ReactNode | ((state: ITrayIconState) => ReactNode);
  readonly style?: StyleProp<ViewStyle>;
}

interface ITrayBack extends ITrayClose {}

interface ITrayFlatList<T = unknown> {
  readonly data: readonly T[];
  readonly renderItem: (info: { item: T; index: number }) => ReactNode;
  readonly keyExtractor?: (item: T, index: number) => string;
  readonly maxHeight?: number;
  readonly contentContainerStyle?: StyleProp<ViewStyle>;
  readonly style?: StyleProp<ViewStyle>;
  readonly ItemSeparatorComponent?: React.ComponentType;
}

interface ITrayScrollView {
  children: ReactNode;
  readonly maxHeight?: number;
  readonly contentContainerStyle?: StyleProp<ViewStyle>;
  readonly style?: StyleProp<ViewStyle>;
}

interface ITrayNavigation {
  view: string;
  direction: number;
  canGoBack: boolean;
  setView: (view: string) => void;
  goBack: () => void;
  reset: (view: string) => void;
}

export type {
  ITray,
  ITrayMotion,
  ITrayBack,
  ITrayBody,
  ITrayClose,
  ITrayContent,
  ITrayContext,
  ITrayFlatList,
  ITrayFooter,
  ITrayHeader,
  ITrayIconState,
  ITrayPalette,
  ITrayScrollView,
  ITraySubtitle,
  ITrayTitle,
  ITrayTrigger,
  ITrayView,
  TTrayDetent,
  TTrayTheme,
  ITrayNavigation,
  TTrayViewAxis,
};
