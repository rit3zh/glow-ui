import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  useAnimatedReaction,
  interpolate,
  Extrapolation,
  LinearTransition,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import type { CardItem, CardProps, StackCardsProps } from "./types";
import { scheduleOnRN } from "react-native-worklets";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const Card = ({
  item,
  index,
  activeIndex,
  totalCards,
  maxRotation,
  fanOutRotation,
  fanOutOffset,
  visibleCards,
  expanded,
  dragX,
  isDragging,
  exitingCardIndex,
  exitDirection,
  enteringCardIndex,
  animationDuration,
  renderCard,
}: CardProps) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const zIndex = useSharedValue(0);

  const getRelativeIndex = (active: number) => {
    "worklet";
    const diff = index - active;
    return diff >= 0 ? diff : totalCards + diff;
  };

  const getStackPosition = (relativeIndex: number, isExpanded: boolean) => {
    "worklet";

    if (isExpanded) {
      return {
        rotation: relativeIndex * fanOutRotation,
        x: relativeIndex * fanOutOffset,
        y: 0,
        scale: 1 - relativeIndex * 0.02,
      };
    }

    const r =
      relativeIndex === 0
        ? 0
        : (relativeIndex % 2 === 0 ? -1 : 1) *
          ((maxRotation / visibleCards) * Math.min(relativeIndex, 3));

    return {
      rotation: r,
      x: 0,
      y: relativeIndex * 4,
      scale: 1 - relativeIndex * 0.04,
    };
  };

  useAnimatedReaction(
    () => ({
      active: activeIndex.value,
      expanded: expanded.value,
      exiting: exitingCardIndex.value,
      entering: enteringCardIndex.value,
      dir: exitDirection.value,
    }),
    (v) => {
      const relativeIndex = getRelativeIndex(v.active);
      const isVisible = relativeIndex < visibleCards;
      const isExiting = v.exiting === index;
      const isEntering = v.entering === index;
      if (isExiting) {
        zIndex.value = totalCards + 10;
      } else if (isEntering) {
        zIndex.value = totalCards + 5;
      } else {
        zIndex.value = totalCards - relativeIndex;
      }

      if (isExiting) {
        translateX.value = withTiming(v.dir * SCREEN_WIDTH * 1.5, {
          duration: animationDuration * 0.8,
          easing: Easing.out(Easing.cubic),
        });

        rotation.value = withTiming(v.dir * 18, {
          duration: animationDuration * 0.8,
        });

        opacity.value = withTiming(0, {
          duration: animationDuration * 0.6,
        });
        return;
      }

      if (isEntering) {
        translateX.value = SCREEN_WIDTH * 1.2;
        rotation.value = 15;
        opacity.value = 0;
        scale.value = 0.9;

        const pos = getStackPosition(0, v.expanded);

        translateX.value = withTiming(pos.x, {
          duration: animationDuration,
          easing: Easing.out(Easing.cubic),
        });

        rotation.value = withTiming(pos.rotation, {
          duration: animationDuration,
          easing: Easing.out(Easing.cubic),
        });

        opacity.value = withTiming(1, {
          duration: animationDuration * 0.7,
        });

        scale.value = withTiming(pos.scale, {
          duration: animationDuration,
          easing: Easing.out(Easing.cubic),
        });

        translateY.value = withTiming(pos.y, {
          duration: animationDuration,
        });

        return;
      }

      if (!isVisible) {
        opacity.value = withTiming(0, { duration: 150 });
        return;
      }

      const pos = getStackPosition(relativeIndex, v.expanded);

      opacity.value = withTiming(1, { duration: animationDuration });
      translateX.value = withTiming(pos.x, {
        duration: animationDuration,
        easing: Easing.out(Easing.cubic),
      });
      translateY.value = withTiming(pos.y, { duration: animationDuration });
      rotation.value = withTiming(pos.rotation, {
        duration: animationDuration,
        easing: Easing.out(Easing.cubic),
      });
      scale.value = withTiming(pos.scale, {
        duration: animationDuration,
        easing: Easing.out(Easing.cubic),
      });
    },
    [],
  );

  useEffect(() => {
    const ri = getRelativeIndex(activeIndex.value);
    const pos = getStackPosition(ri, false);

    translateX.value = pos.x;
    translateY.value = pos.y;
    rotation.value = pos.rotation;
    scale.value = pos.scale;
    opacity.value = ri < visibleCards ? 1 : 0;
    zIndex.value = totalCards - ri;
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const ri = getRelativeIndex(activeIndex.value);
    const isTop = ri === 0;
    const isExiting = exitingCardIndex.value === index;
    const isEntering = enteringCardIndex.value === index;

    if (isExiting || isEntering) {
      return {
        opacity: opacity.value,
        zIndex: zIndex.value,
        transform: [
          { translateX: translateX.value },
          { translateY: translateY.value },
          { rotate: `${rotation.value}deg` },
          { scale: scale.value },
        ],
      };
    }

    const dragOffset = isTop && isDragging.value ? dragX.value : 0;

    const dragRotation =
      isTop && isDragging.value
        ? interpolate(
            dragX.value,
            [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            [-12, 0, 12],
            Extrapolation.CLAMP,
          )
        : 0;

    const dragScale =
      isTop && isDragging.value
        ? interpolate(
            Math.abs(dragX.value),
            [0, SCREEN_WIDTH / 2],
            [1, 0.96],
            Extrapolation.CLAMP,
          )
        : 1;

    return {
      opacity: opacity.value,
      zIndex: zIndex.value,
      transform: [
        { translateX: translateX.value + dragOffset },
        { translateY: translateY.value },
        { rotate: `${rotation.value + dragRotation}deg` },
        { scale: scale.value * dragScale },
      ],
    };
  });

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      {renderCard(item, index)}
    </Animated.View>
  );
};

function StackCards<T extends CardItem>({
  data,
  renderCard,
  maxRotation = 15,
  fanOutRotation = 12,
  fanOutOffset = 35,
  visibleCards = 4,
  swipeThreshold = 90,
  animationDuration = 300,
  style,
  onCardChange,
}: StackCardsProps<T>) {
  const activeIndex = useSharedValue(0);
  const expanded = useSharedValue(false);
  const dragX = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const isAnimating = useSharedValue(false);
  const exitingCardIndex = useSharedValue(-1);
  const exitDirection = useSharedValue(0);
  const enteringCardIndex = useSharedValue(-1);

  const [, setIndex] = useState(0);

  const updateIndex = useCallback(
    (i: number) => {
      setIndex(i);
      onCardChange?.(i);
    },
    [onCardChange],
  );

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onStart(() => {
      if (isAnimating.value) return;
      isDragging.value = true;
    })
    .onUpdate((e) => {
      const resistance = 1 - Math.min(Math.abs(e.translationX) / 500, 0.4);
      dragX.value = e.translationX * resistance;
    })
    .onEnd((e) => {
      isDragging.value = false;

      const projected = e.translationX + e.velocityX * 0.15;

      if (Math.abs(projected) > swipeThreshold) {
        isAnimating.value = true;

        const swipingLeft = projected < 0;
        exitingCardIndex.value = activeIndex.value;
        exitDirection.value = swipingLeft ? -1 : 1;
        const next = swipingLeft
          ? (activeIndex.value + 1) % data.length
          : (activeIndex.value - 1 + data.length) % data.length;
        if (!swipingLeft) {
          enteringCardIndex.value = next;
        }
        dragX.value = 0;
        setTimeout(() => {
          activeIndex.value = next;
          scheduleOnRN(updateIndex, next);
          setTimeout(() => {
            exitingCardIndex.value = -1;
            enteringCardIndex.value = -1;
            isAnimating.value = false;
          }, animationDuration);
        }, 40);
      } else {
        dragX.value = withSpring(0, {
          velocity: e.velocityX,
          damping: 18,
          stiffness: 180,
        });
      }
    });

  const tapGesture = Gesture.Tap().onEnd(() => {
    if (!isAnimating.value) {
      expanded.value = !expanded.value;
    }
  });

  return (
    <GestureDetector gesture={Gesture.Exclusive(panGesture, tapGesture)}>
      <Animated.View
        layout={LinearTransition.springify()
          .duration(animationDuration)
          .easing(Easing.out(Easing.cubic))}
        style={[
          styles.container,
          {
            width: fanOutOffset * visibleCards,
            height: 40,
          },
          style,
        ]}
      >
        {data.map((item, index) => (
          <Card
            key={item.id}
            item={item}
            index={index}
            activeIndex={activeIndex}
            totalCards={data.length}
            maxRotation={maxRotation}
            fanOutRotation={fanOutRotation}
            fanOutOffset={fanOutOffset}
            visibleCards={visibleCards}
            expanded={expanded}
            dragX={dragX}
            isDragging={isDragging}
            exitingCardIndex={exitingCardIndex}
            exitDirection={exitDirection}
            enteringCardIndex={enteringCardIndex}
            animationDuration={animationDuration}
            renderCard={renderCard as any}
          />
        ))}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    position: "absolute",
  },
});

export { StackCards, CardItem };
