import React, {
  Children,
  isValidElement,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import { SymbolView } from "expo-symbols";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import {
  COLLAPSED_HEIGHT,
  COLLAPSED_RADIUS,
  COLLAPSED_WIDTH,
  EXPANDED_HEIGHT,
  EXPANDED_RADIUS,
  EXPANDED_WIDTH,
  EXPAND_SPRING,
  PRESS_SPRING,
} from "./const";
import { ExpandableContext, useExpandable } from "./context";
import type {
  IExpandableClose,
  IExpandableRoot,
  IExpandableSlot,
} from "./types";
import { createCompoundComponent } from "@/utils/create-compound-component";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ExpandableCollapsed: React.FC<IExpandableSlot> = (
  _: IExpandableSlot,
): null => null;
const ExpandableExpanded: React.FC<IExpandableSlot> = (
  _: IExpandableSlot,
): null => null;
(ExpandableCollapsed as { role?: string }).role = "collapsed";
(ExpandableExpanded as { role?: string }).role = "expanded";

const ExpandableRoot: React.FC<IExpandableRoot> = ({
  children,
  collapsedWidth = COLLAPSED_WIDTH,
  expandedWidth = EXPANDED_WIDTH,
  collapsedHeight = COLLAPSED_HEIGHT,
  expandedHeight = EXPANDED_HEIGHT,
  collapsedRadius = COLLAPSED_RADIUS,
  expandedRadius = EXPANDED_RADIUS,
  pressSpring = PRESS_SPRING,
  expandSpring = EXPAND_SPRING,
  onExpandedChange,
  style,
}: IExpandableRoot): React.JSX.Element => {
  const progress = useSharedValue<number>(0);
  const scale = useSharedValue<number>(1);
  const [expanded, setExpanded] = useState<boolean>(false);

  const { collapsedNode, expandedNode } = useMemo(() => {
    let collapsed: ReactNode = null;
    let content: ReactNode = null;
    Children.forEach(children, (child) => {
      if (!isValidElement(child)) return;
      const role = (child.type as { role?: string })?.role;
      if (role === "collapsed")
        collapsed = (child.props as IExpandableSlot).children;
      else if (role === "expanded")
        content = (child.props as IExpandableSlot).children;
    });
    return { collapsedNode: collapsed, expandedNode: content };
  }, [children]);

  const expand = useCallback(() => {
    setExpanded(true);
    onExpandedChange?.(true);
    scale.value = withSpring(1, pressSpring);
    progress.value = withSpring(1, expandSpring);
  }, [onExpandedChange, scale, progress, pressSpring, expandSpring]);

  const collapse = useCallback(() => {
    setExpanded(false);
    onExpandedChange?.(false);
    progress.value = withSpring<number>(0, expandSpring);
  }, [onExpandedChange, progress, expandSpring]);

  const ctx = useMemo(
    () => ({ progress, expanded, expand, collapse }),
    [progress, expanded, expand, collapse],
  );

  const containerStyle = useAnimatedStyle<ViewStyle>(() => ({
    width: interpolate(progress.value, [0, 1], [collapsedWidth, expandedWidth]),
    height: interpolate(
      progress.value,
      [0, 1],
      [collapsedHeight, expandedHeight],
    ),
    borderRadius: interpolate(
      progress.value,
      [0, 1],
      [collapsedRadius, expandedRadius],
    ),
    transform: [{ scale: scale.value }],
  }));

  const collapsedStyle = useAnimatedStyle<
    Pick<ViewStyle, "opacity" | "transform">
  >(() => ({
    opacity: interpolate(progress.value, [0, 0.5], [1, 0]),
    transform: [{ translateY: interpolate(progress.value, [0, 1], [0, 60]) }],
  }));

  const expandedStyle = useAnimatedStyle<Pick<ViewStyle, "opacity">>(() => ({
    opacity: interpolate(progress.value, [0.15, 1], [0, 1]),
  }));

  return (
    <ExpandableContext.Provider value={ctx}>
      <Animated.View style={[styles.container, containerStyle, style]}>
        <Animated.View
          style={[
            expandedStyle,
            {
              width: expandedWidth + 5,
              height: expandedHeight + 5,
              borderRadius: expandedRadius,
            },
          ]}
          pointerEvents={expanded ? "auto" : "none"}
        >
          {expandedNode}
        </Animated.View>

        <AnimatedPressable
          style={[styles.collapsed, collapsedStyle]}
          pointerEvents={expanded ? "none" : "auto"}
          onPress={expand}
          onPressIn={() => {
            if (!expanded) scale.value = withSpring(1.06, pressSpring);
          }}
          onPressOut={() => {
            scale.value = withSpring(1, pressSpring);
          }}
        >
          {collapsedNode}
        </AnimatedPressable>
      </Animated.View>
    </ExpandableContext.Provider>
  );
};

const ExpandableClose: React.FC<IExpandableClose> = ({
  children,
  style,
}: IExpandableClose): React.JSX.Element => {
  const { progress, collapse } = useExpandable("ExpandableMapView.Close");

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.6, 1], [0, 1]),
  }));

  return (
    <Animated.View style={[styles.closeWrap, animatedStyle]}>
      <Pressable style={[styles.close, style]} onPress={collapse} hitSlop={8}>
        {children ?? (
          <SymbolView name="xmark" size={18} tintColor="black" weight="bold" />
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#d6d6d6",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  collapsed: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  closeWrap: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 14,
    zIndex: 10,
  },
  close: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

const Root = createCompoundComponent("Root", ExpandableRoot);
const Collapsed = createCompoundComponent("Collapsed", ExpandableCollapsed);
const Expanded = createCompoundComponent("Expanded", ExpandableExpanded);
const Close = createCompoundComponent("Close", ExpandableClose);

const ExpandableView = Object.assign(ExpandableRoot, {
  Root: ExpandableRoot,
  Collapsed: ExpandableCollapsed,
  Expanded: ExpandableExpanded,
  Close: ExpandableClose,
});

export {
  ExpandableView,
  Root,
  Collapsed,
  Expanded,
  Close,
  ExpandableRoot,
  ExpandableCollapsed,
  ExpandableExpanded,
  ExpandableClose,
};
export default ExpandableView;
export type {
  IExpandableRoot,
  IExpandableSlot,
  IExpandableClose,
} from "./types";
