import type { StyleProp, ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";

interface CardItem {
  readonly id: number | string;
  readonly [key: string]: any;
}

interface StackCardsProps<T extends CardItem> {
  readonly data: readonly T[];
  readonly renderCard: (item: T, index: number) => React.ReactElement;

  readonly maxRotation?: number;
  readonly fanOutRotation?: number;
  readonly fanOutOffset?: number;
  readonly visibleCards?: number;
  readonly swipeThreshold?: number;
  readonly animationDuration?: number;
  readonly style?: StyleProp<ViewStyle>;
  readonly onCardChange?: (index: number) => void;
}

interface CardProps {
  item: CardItem;
  index: number;
  activeIndex: SharedValue<number>;
  totalCards: number;
  maxRotation: number;
  fanOutRotation: number;
  fanOutOffset: number;
  visibleCards: number;
  expanded: SharedValue<boolean>;
  dragX: SharedValue<number>;
  isDragging: SharedValue<boolean>;
  exitingCardIndex: SharedValue<number>;
  exitDirection: SharedValue<number>;
  animationDuration: number;
  enteringCardIndex: SharedValue<number>;
  renderCard: (item: CardItem, index: number) => React.ReactElement;
}

export { CardItem, StackCardsProps, CardProps };
