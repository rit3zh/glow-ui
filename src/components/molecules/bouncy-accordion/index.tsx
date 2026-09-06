import { Feather } from "@expo/vector-icons";
import React, {
  Children,
  cloneElement,
  isValidElement,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from "react";
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import {
  CHEVRON_SPRING,
  CONTENT_CLOSE_SPRING,
  CONTENT_OPEN_SPRING,
  DEFAULT_GAP,
  DEFAULT_RADIUS,
  DESCRIPTION_TIMING,
  ROW_SPRING,
  THEME,
} from "./const";
import {
  ItemContext,
  RootContext,
  useBouncyItem,
  useBouncyRoot,
} from "./context";
import type {
  IBouncyAccordionContent,
  IBouncyAccordionItem,
  IBouncyAccordionItemInternal,
  IBouncyAccordionRoot,
  IBouncyAccordionTrigger,
  IBouncyAccordionTriggerIcon,
  IBouncyAccordionTriggerLabel,
  TBouncyAccordionValue,
} from "./types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const BouncyAccordionRoot: React.FC<IBouncyAccordionRoot> &
  React.FunctionComponent<IBouncyAccordionRoot> = memo<IBouncyAccordionRoot>(
  ({
    children,
    value,
    defaultValue = null,
    onValueChange,
    collapsible = true,
    gap = DEFAULT_GAP,
    radius = DEFAULT_RADIUS,
    style,
  }: IBouncyAccordionRoot &
    React.ComponentProps<typeof BouncyAccordionRoot>): React.JSX.Element &
    React.ReactNode &
    React.ReactElement => {
    const isControlled = value !== undefined;
    const [uncontrolled, setUncontrolled] =
      useState<TBouncyAccordionValue>(defaultValue);
    const activeValue = isControlled ? value : uncontrolled;

    const setActiveValue = useCallback(
      (next: TBouncyAccordionValue) => {
        if (!isControlled) setUncontrolled(next);
        onValueChange?.(next);
      },
      [isControlled, onValueChange],
    );

    const rootContext = useMemo(
      () => ({ activeValue, setActiveValue, collapsible, radius, gap }),
      [activeValue, setActiveValue, collapsible, radius, gap],
    );

    const items = Children.toArray(children).filter(
      isValidElement,
    ) as ReactElement<IBouncyAccordionItem & IBouncyAccordionItemInternal>[];
    const activeIndex = items.findIndex((el) => el.props.value === activeValue);
    const count = items.length;

    return (
      <RootContext.Provider value={rootContext}>
        <View style={[styles.root, style]}>
          {items.map((el, index) => {
            const open = el.props.value === activeValue;
            const previousIsOpen = activeIndex === index - 1;
            const nextIsOpen = activeIndex === index + 1;

            const startsGroup = open || index === 0 || previousIsOpen;
            const endsGroup = open || index === count - 1 || nextIsOpen;
            const separatedFromPrevious = index > 0 && (open || previousIsOpen);

            return cloneElement(el, {
              open,
              startsGroup,
              endsGroup,
              separatedFromPrevious,
            });
          })}
        </View>
      </RootContext.Provider>
    );
  },
);

const BouncyAccordionItem: React.FC<
  IBouncyAccordionItem & IBouncyAccordionItemInternal
> = memo<IBouncyAccordionItem & IBouncyAccordionItemInternal>(
  ({
    children,
    value,
    disabled = false,
    style,
    open = false,
    startsGroup = true,
    endsGroup = true,
    separatedFromPrevious = false,
  }: IBouncyAccordionItem & IBouncyAccordionItemInternal): React.JSX.Element &
    React.ReactNode &
    React.ReactElement => {
    const { activeValue, setActiveValue, collapsible, radius, gap } =
      useBouncyRoot();

    const toggle = useCallback(() => {
      if (disabled) return;
      if (activeValue === value) {
        if (collapsible) setActiveValue(null);
        return;
      }
      setActiveValue(value);
    }, [activeValue, value, collapsible, disabled, setActiveValue]);

    const topRadius = useSharedValue<number>(startsGroup ? radius : 0);
    const bottomRadius = useSharedValue<number>(endsGroup ? radius : 0);
    const marginTop = useSharedValue<number>(separatedFromPrevious ? gap : 0);

    useEffect(() => {
      topRadius.value = withSpring<number>(
        startsGroup ? radius : 0,
        ROW_SPRING,
      );
      bottomRadius.value = withSpring<number>(
        endsGroup ? radius : 0,
        ROW_SPRING,
      );
    }, [startsGroup, endsGroup, radius, topRadius, bottomRadius]);

    useEffect(() => {
      marginTop.value = withSpring<number>(
        separatedFromPrevious ? gap : 0,
        ROW_SPRING,
      );
    }, [separatedFromPrevious, gap, marginTop]);

    const wrapperStyle = useAnimatedStyle<Pick<ViewStyle, "marginTop">>(() => ({
      marginTop: Math.max(0, marginTop.value),
    }));

    const cardStyle = useAnimatedStyle<
      Pick<
        ViewStyle,
        | "borderTopLeftRadius"
        | "borderTopRightRadius"
        | "borderBottomLeftRadius"
        | "borderBottomRightRadius"
      >
    >(() => {
      const top = Math.max(0, topRadius.value);
      const bottom = Math.max(0, bottomRadius.value);
      return {
        borderTopLeftRadius: top,
        borderTopRightRadius: top,
        borderBottomLeftRadius: bottom,
        borderBottomRightRadius: bottom,
      };
    });

    const itemContext = useMemo(
      () => ({ value, open, disabled, startsGroup, endsGroup, toggle }),
      [value, open, disabled, startsGroup, endsGroup, toggle],
    );

    return (
      <ItemContext.Provider value={itemContext}>
        <Animated.View style={wrapperStyle}>
          <Animated.View
            style={[styles.card, disabled && styles.disabled, cardStyle, style]}
          >
            {children}
          </Animated.View>
        </Animated.View>
      </ItemContext.Provider>
    );
  },
);

const BouncyAccordionTriggerBase: React.FC<IBouncyAccordionTrigger> &
  React.FunctionComponent<IBouncyAccordionTrigger> = ({
  children,
  icon,
  hideChevron = false,
  style,
  textStyle,
}: IBouncyAccordionTrigger): React.JSX.Element &
  React.ReactElement &
  React.ReactNode => {
  const { open, disabled, toggle } = useBouncyItem();
  const rotation = useSharedValue<number>(open ? 1 : 0);
  const pressed = useSharedValue(0);

  useEffect(() => {
    rotation.value = withSpring(open ? 1 : 0, CHEVRON_SPRING);
  }, [open, rotation]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(rotation.value, [0, 1], [0, 180])}deg` },
    ],
  }));

  const pressStyle = useAnimatedStyle<Pick<ViewStyle, "transform">>(() => ({
    transform: [
      {
        scale: interpolate(pressed.value, [0, 1], [1, 1.0221]),
      },
    ],
  }));

  return (
    <AnimatedPressable
      onPress={toggle}
      disabled={disabled}
      onPressIn={() => {
        pressed.value = withTiming(1);
      }}
      onPressOut={() => {
        pressed.value = withSpring<number>(0);
      }}
      accessibilityRole="button"
      accessibilityState={{ expanded: open, disabled }}
      style={[styles.trigger, pressStyle, style]}
    >
      {icon ? <View style={styles.leadingIcon}>{icon}</View> : null}

      {typeof children === "string" ? (
        <View style={styles.titleWrap}>
          <Text style={[styles.title, textStyle]} numberOfLines={1}>
            {children}
          </Text>
        </View>
      ) : (
        children
      )}

      {!hideChevron ? (
        <Animated.View style={[styles.chevron, chevronStyle]}>
          <Feather
            name="chevron-down"
            size={18}
            color={THEME.mutedForeground}
          />
        </Animated.View>
      ) : null}
    </AnimatedPressable>
  );
};

const BouncyAccordionTriggerIcon = ({
  children,
  style,
}: IBouncyAccordionTriggerIcon): React.JSX.Element => (
  <View style={[styles.leadingIcon, style]}>{children}</View>
);

const BouncyAccordionTriggerLabel = ({
  children,
  style,
}: IBouncyAccordionTriggerLabel): React.JSX.Element => (
  <View style={styles.titleWrap}>
    {typeof children === "string" ? (
      <Text style={[styles.title, style]} numberOfLines={1}>
        {children}
      </Text>
    ) : (
      children
    )}
  </View>
);

const BouncyAccordionTrigger = Object.assign(BouncyAccordionTriggerBase, {
  Icon: BouncyAccordionTriggerIcon,
  Label: BouncyAccordionTriggerLabel,
});

const BouncyAccordionContent: React.FC<IBouncyAccordionContent> = ({
  children,
  style,
  textStyle,
}: IBouncyAccordionContent): React.JSX.Element => {
  const { open } = useBouncyItem();
  const height = useSharedValue<number>(0);
  const opacity = useSharedValue<number>(open ? 1 : 0);
  const [naturalHeight, setNaturalHeight] = useState<number>(0);
  const initialized = useRef<boolean>(false);
  const prevOpen = useRef<boolean>(open);

  const onMeasure = useCallback((e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h > 0)
      setNaturalHeight((prev) => (Math.abs(prev - h) > 0.5 ? h : prev));
  }, []);

  useEffect(() => {
    if (naturalHeight <= 0) return;
    const target = open ? naturalHeight : 0;

    if (!initialized.current) {
      initialized.current = true;
      prevOpen.current = open;
      height.value = target;
      opacity.value = open ? 1 : 0;
      return;
    }

    if (prevOpen.current !== open) {
      prevOpen.current = open;
      height.value = withSpring<number>(
        target,
        open ? CONTENT_OPEN_SPRING : CONTENT_CLOSE_SPRING,
      );
      opacity.value = withTiming<number>(open ? 1 : 0, DESCRIPTION_TIMING);
    } else if (open) {
      height.value = target;
    }
  }, [open, naturalHeight, height, opacity]);

  const containerStyle = useAnimatedStyle<Pick<ViewStyle, "height">>(() => ({
    height: Math.max(0, height.value),
  }));

  const bodyStyle = useAnimatedStyle<Pick<ViewStyle, "opacity">>(() => ({
    opacity: opacity.value,
  }));

  const body =
    typeof children === "string" ? (
      <Text style={[styles.description, textStyle]}>{children}</Text>
    ) : (
      children
    );

  return (
    <Animated.View style={[styles.contentContainer, containerStyle]}>
      <Animated.View
        onLayout={onMeasure}
        style={[styles.contentInner, styles.contentAbsolute, bodyStyle, style]}
      >
        {body}
      </Animated.View>
    </Animated.View>
  );
};

const BouncyAccordion = Object.assign(BouncyAccordionRoot, {
  Root: BouncyAccordionRoot,
  Item: BouncyAccordionItem,
  Trigger: BouncyAccordionTrigger,
  Content: BouncyAccordionContent,
});

const styles = StyleSheet.create({
  root: {
    width: "100%",
  },
  card: {
    overflow: "hidden",
    backgroundColor: THEME.card,
  },
  disabled: {
    opacity: 0.5,
  },
  trigger: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 20,
  },
  leadingIcon: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  titleWrap: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
    color: THEME.foreground,
  },
  chevron: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    overflow: "hidden",
  },
  contentAbsolute: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
  },
  contentInner: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: THEME.mutedForeground,
  },
});

export { BouncyAccordion };
export default BouncyAccordion;
export type {
  IBouncyAccordionRoot,
  IBouncyAccordionItem,
  IBouncyAccordionTrigger,
  IBouncyAccordionTriggerIcon,
  IBouncyAccordionTriggerLabel,
  IBouncyAccordionContent,
} from "./types";
