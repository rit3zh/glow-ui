import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type LayoutRectangle,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { createCompoundComponent } from "@/utils/create-compound-component";
import { TabsContext, TabsListContext, useTabs, useTabsList } from "./context";
import {
  TABS_DISABLED_OPACITY,
  TABS_INDICATOR_SHADOW,
  TABS_INDICATOR_SIZE_SPRING,
  TABS_INDICATOR_SPRING,
  TABS_LABEL_TIMING,
  TABS_PRESS_SCALE,
  TABS_PRESS_SPRING,
  TABS_ITEM_ICON_OPACITY,
  TABS_METRICS,
  TABS_THEME,
} from "./const";
import type {
  ITabLayout,
  ITabsContextValue,
  ITabsList,
  ITabsListContextValue,
  ITabsPanel,
  ITabsRoot,
  ITabsTab,
} from "./types";

const TabsRoot: React.FC<ITabsRoot> = ({
  children,
  value,
  defaultValue = "",
  onValueChange,
  orientation = "horizontal",
  theme = "dark",
  style,
  testID,
}): React.JSX.Element => {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string>(defaultValue);
  const activeValue = isControlled ? value : internal;

  const palette = TABS_THEME[theme];

  const setValue = useCallback(
    (next: string): void => {
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const ctx = useMemo<ITabsContextValue>(
    () => ({
      value: activeValue,
      setValue,
      orientation,
      theme,
      palette,
    }),
    [activeValue, setValue, orientation, theme, palette],
  );

  return (
    <TabsContext.Provider value={ctx}>
      <View
        testID={testID}
        style={[
          styles.root,
          orientation === "vertical" ? styles.rootVertical : null,
          style,
        ]}
      >
        {children}
      </View>
    </TabsContext.Provider>
  );
};

const TabsList: React.FC<ITabsList> = ({
  children,
  variant = "default",
  size = "default",
  style,
}): React.JSX.Element => {
  const { value, orientation, palette } = useTabs("Tabs.List");
  const metrics = TABS_METRICS[size];
  const isVertical = orientation === "vertical";

  const x = useSharedValue<number>(0);
  const y = useSharedValue<number>(0);
  const width = useSharedValue<number>(0);
  const height = useSharedValue<number>(0);
  const ready = useSharedValue<number>(0);

  const layouts = useRef<Map<string, ITabLayout>>(new Map());

  const applyLayout = useCallback(
    (layout: ITabLayout): void => {
      const rect =
        variant === "underline"
          ? {
              x: layout.contentX,
              y: layout.contentY,
              width: layout.contentWidth,
              height: layout.contentHeight,
            }
          : layout;
      const animate = ready.value === 1;
      const move = (next: number) =>
        animate ? withSpring(next, TABS_INDICATOR_SPRING) : next;
      const resize = (next: number) =>
        animate ? withSpring(next, TABS_INDICATOR_SIZE_SPRING) : next;

      x.value = move(rect.x);
      y.value = move(rect.y);
      width.value = resize(rect.width);
      height.value = resize(rect.height);
      ready.value = 1;
    },
    [height, ready, variant, width, x, y],
  );

  const registerTab = useCallback(
    (tabValue: string, layout: ITabLayout): void => {
      layouts.current.set(tabValue, layout);
      if (tabValue === value) applyLayout(layout);
    },
    [applyLayout, value],
  );

  useEffect(() => {
    const layout = layouts.current.get(value);
    if (layout) applyLayout(layout);
  }, [applyLayout, value]);

  const listCtx = useMemo<ITabsListContextValue>(
    () => ({
      variant,
      size,
      metrics,
      registerTab,
      indicator: { x, y, width, height, ready },
    }),
    [variant, size, metrics, registerTab, x, y, width, height, ready],
  );

  const indicatorStyle = useAnimatedStyle(() => {
    if (variant === "underline") {
      return isVertical
        ? {
            opacity: ready.value,
            height: height.value,
            transform: [{ translateY: y.value }],
          }
        : {
            opacity: ready.value,
            width: width.value,
            transform: [{ translateX: x.value }],
          };
    }

    return {
      opacity: ready.value,
      width: width.value,
      height: height.value,
      transform: [{ translateX: x.value }, { translateY: y.value }],
    };
  });

  const isSegmented = variant === "default";
  const listRadius = isSegmented
    ? metrics.height / 2 + metrics.listPadding
    : metrics.height / 2;

  return (
    <TabsListContext.Provider value={listCtx}>
      <View
        style={[
          styles.list,
          isVertical ? styles.listVertical : null,
          isSegmented
            ? {
                backgroundColor: palette.listBg,
                padding: metrics.listPadding,
                borderRadius: listRadius,
              }
            : isVertical
              ? styles.listUnderlineVertical
              : styles.listUnderlineHorizontal,
          style,
        ]}
      >
        <View
          style={[
            styles.listContent,
            isVertical ? styles.listContentVertical : null,
          ]}
        >
          <Animated.View
            pointerEvents="none"
            style={[
              styles.indicator,
              isSegmented
                ? {
                    backgroundColor: palette.indicator,
                    borderRadius: metrics.height / 2,
                    top: 0,
                    left: 0,
                    ...TABS_INDICATOR_SHADOW,
                  }
                : {
                    backgroundColor: palette.underline,
                    borderRadius: metrics.underlineSize / 2,
                    zIndex: 10,
                  },
              !isSegmented &&
                (isVertical
                  ? { left: 0, top: 0, width: metrics.underlineSize }
                  : { bottom: 0, left: 0, height: metrics.underlineSize }),
              indicatorStyle,
            ]}
          />
          {children}
        </View>
      </View>
    </TabsListContext.Provider>
  );
};

const TabsTab: React.FC<ITabsTab> = ({
  children,
  value,
  size,
  disabled = false,
  icon,
  style,
  labelStyle,
}): React.JSX.Element => {
  const {
    value: activeValue,
    setValue,
    orientation,
    palette,
  } = useTabs("Tabs.Tab");
  const { metrics: listMetrics, registerTab } = useTabsList("Tabs.Tab");
  const metrics = size ? TABS_METRICS[size] : listMetrics;

  const isActive = activeValue === value;
  const isVertical = orientation === "vertical";

  const active = useSharedValue<number>(isActive ? 1 : 0);
  const pressed = useSharedValue<number>(0);

  useEffect(() => {
    active.value = withTiming(isActive ? 1 : 0, TABS_LABEL_TIMING);
  }, [active, isActive]);

  const tabRect = useRef<ITabLayout | null>(null);
  const contentRect = useRef<LayoutRectangle | null>(null);

  const publishLayout = useCallback((): void => {
    const tab = tabRect.current;
    const content = contentRect.current;
    if (!(tab && content)) return;

    registerTab(value, {
      ...tab,
      contentX: tab.x + content.x,
      contentY: tab.y + content.y,
      contentWidth: content.width,
      contentHeight: content.height,
    });
  }, [registerTab, value]);

  const onLayout = useCallback(
    (event: LayoutChangeEvent): void => {
      const { x, y, width, height } = event.nativeEvent.layout;
      tabRect.current = {
        x,
        y,
        width,
        height,
        contentX: x,
        contentY: y,
        contentWidth: width,
        contentHeight: height,
      };
      publishLayout();
    },
    [publishLayout],
  );

  const onContentLayout = useCallback(
    (event: LayoutChangeEvent): void => {
      contentRect.current = event.nativeEvent.layout;
      publishLayout();
    },
    [publishLayout],
  );

  const onPressIn = useCallback((): void => {
    if (disabled) return;
    pressed.value = withSpring(1, TABS_PRESS_SPRING);
  }, [disabled, pressed]);

  const onPressOut = useCallback((): void => {
    pressed.value = withSpring(0, TABS_PRESS_SPRING);
  }, [pressed]);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: 1 - pressed.value * (1 - TABS_PRESS_SCALE),
      },
    ],
  }));

  const labelColorStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      active.value,
      [0, 1],
      [palette.inactiveText, palette.activeText],
    ),
  }));

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive, disabled }}
      disabled={disabled}
      onLayout={onLayout}
      onPress={() => setValue(value)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[
        styles.tab,
        {
          height: metrics.height,
          paddingHorizontal: metrics.paddingHorizontal,
          borderRadius: metrics.height / 2,
        },
        isVertical ? styles.tabVertical : null,
        disabled && { opacity: TABS_DISABLED_OPACITY },
        style,
      ]}
    >
      <Animated.View
        onLayout={onContentLayout}
        style={[styles.tabInner, { gap: metrics.gap }, pressStyle]}
      >
        {icon ? (
          <View
            style={[
              styles.icon,
              {
                width: metrics.iconSize,
                height: metrics.iconSize,
                opacity: TABS_ITEM_ICON_OPACITY,
              },
            ]}
          >
            {icon}
          </View>
        ) : null}
        {typeof children === "string" || typeof children === "number" ? (
          <Animated.Text
            numberOfLines={1}
            style={[
              styles.label,
              { fontSize: metrics.fontSize },
              labelColorStyle,
              labelStyle,
            ]}
          >
            {children}
          </Animated.Text>
        ) : (
          children
        )}
      </Animated.View>
    </Pressable>
  );
};

const TabsPanel: React.FC<ITabsPanel> = ({
  children,
  value,
  keepMounted = false,
  style,
}): React.JSX.Element | null => {
  const { value: activeValue, orientation } = useTabs("Tabs.Panel");
  const isActive = activeValue === value;

  if (!(isActive || keepMounted)) return null;

  return (
    <View
      pointerEvents={isActive ? "auto" : "none"}
      style={[
        styles.panel,
        orientation === "vertical" ? styles.panelVertical : null,
        !isActive && styles.panelHidden,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: "column",
    gap: 8,
  },
  rootVertical: {
    flexDirection: "row",
  },
  list: {
    alignSelf: "flex-start",
  },
  listVertical: {
    alignItems: "stretch",
  },
  listContent: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  listContentVertical: {
    flexDirection: "column",
    alignItems: "stretch",
  },
  listUnderlineHorizontal: {
    paddingVertical: 4,
  },
  listUnderlineVertical: {
    paddingHorizontal: 4,
  },
  indicator: {
    position: "absolute",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "transparent",
  },
  tabInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  tabVertical: {
    width: "100%",
    justifyContent: "flex-start",
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontWeight: "500",
    letterSpacing: -0.1,
  },
  panel: {
    flexGrow: 0,
    flexShrink: 1,
  },
  panelVertical: {
    flexShrink: 1,
  },
  panelHidden: {
    display: "none",
  },
});

const Tabs = createCompoundComponent("Tabs", TabsRoot, {
  Root: TabsRoot,
  List: TabsList,
  Tab: TabsTab,
  Trigger: TabsTab,
  Panel: TabsPanel,
  Content: TabsPanel,
});

export {
  Tabs,
  TabsRoot,
  TabsList,
  TabsTab,
  TabsTab as TabsTrigger,
  TabsPanel,
  TabsPanel as TabsContent,
  useTabs,
};
export default Tabs;
export type {
  ITabsRoot,
  ITabsList,
  ITabsTab,
  ITabsPanel,
  TTabsVariant,
  TTabsSize,
  TTabsTheme,
  TTabsOrientation,
} from "./types";
