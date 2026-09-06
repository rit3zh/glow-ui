import React, {
  memo,
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
  TextInput,
  View,
  type LayoutChangeEvent,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  Canvas,
  Fill,
  Shader,
  Skia,
  type Uniforms,
} from "@shopify/react-native-skia";
import { Feather } from "@expo/vector-icons";
import { GooeyContext, TabContext, useGooey, useTab } from "./context";
import { GOOEY_SHADER } from "./conf";
import {
  DEFAULT_COLOR_SCHEME,
  DEFAULT_INTENSITY,
  DEFAULT_PLACEHOLDER,
  DEFAULT_SPRING,
  GAP,
  H_PADDING,
  HEIGHT,
  ICON_SIZE,
  _TAB_PADDING_HORIZONTAL,
} from "./const";
import { parseColor } from "./utils";
import type {
  IGooeySearchTabs,
  IGooeyTab,
  IGooeyTabIcon,
  IGooeyTabLabel,
  IGooeyTabs,
  IGooeyTrigger,
  ITabLayout,
} from "./types";

const EFFECT = Skia.RuntimeEffect.Make(GOOEY_SHADER);

const CLOSE_W = HEIGHT;
const PAD_V = 8;

const hasChildType = (children: React.ReactNode, type: unknown): boolean =>
  React.Children.toArray(children).some(
    (c) => React.isValidElement(c) && c.type === type,
  );

/* -------------------------------------------------------------------------- */
/*                                    Root                                    */
/* -------------------------------------------------------------------------- */

const GooeyRoot: React.FC<IGooeySearchTabs> &
  React.FunctionComponent<IGooeySearchTabs> = memo<IGooeySearchTabs>(
  ({
    children,
    value: controlledValue,
    defaultValue = "",
    onChange,
    onSearch,
    activeTab: controlledActiveTab,
    defaultActiveTab,
    onTabChange,
    defaultExpanded = false,
    onExpandedChange,
    placeholder = DEFAULT_PLACEHOLDER,
    intensity = DEFAULT_INTENSITY,
    springConfig = DEFAULT_SPRING,
    colorScheme,
    style,
    textStyle,
  }: IGooeySearchTabs): React.JSX.Element => {
    const scheme = useMemo(
      () => ({ ...DEFAULT_COLOR_SCHEME, ...colorScheme }),
      [colorScheme],
    );
    const colorRGB = useMemo(() => parseColor(scheme.bg), [scheme.bg]);
    const kGoo = 2 + intensity * 30;

    const progress = useSharedValue(defaultExpanded ? 1 : 0);
    const [expanded, setExpanded] = useState(defaultExpanded);
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [order, setOrder] = useState<string[]>([]);
    const [internalActive, setInternalActive] = useState(defaultActiveTab ?? "");
    const [tabsW, setTabsW] = useState(0);
    const [layouts, setLayouts] = useState<Record<string, ITabLayout>>({});

    const inputRef = useRef<TextInput>(null);

    const value = controlledValue ?? internalValue;
    const activeTab = controlledActiveTab ?? internalActive ?? order[0] ?? "";

    const registerTab = useCallback((v: string) => {
      setOrder((prev) => (prev.includes(v) ? prev : [...prev, v]));
    }, []);

    const unregisterTab = useCallback((v: string) => {
      setOrder((prev) => prev.filter((x) => x !== v));
      setLayouts((prev) => {
        if (!(v in prev)) return prev;
        const next = { ...prev };
        delete next[v];
        return next;
      });
    }, []);

    const reportLayout = useCallback((v: string, layout: ITabLayout) => {
      setLayouts((prev) =>
        prev[v]?.x === layout.x && prev[v]?.width === layout.width
          ? prev
          : { ...prev, [v]: layout },
      );
    }, []);

    const setTabsWidth = useCallback(
      (w: number) => setTabsW((prev) => (prev === w ? prev : w)),
      [],
    );

    useEffect(() => {
      if (!internalActive && order.length > 0) setInternalActive(order[0]);
    }, [order, internalActive]);

    const expand = useCallback(() => {
      setExpanded(true);
      onExpandedChange?.(true);
      progress.value = withSpring(1, springConfig);
      requestAnimationFrame(() => inputRef.current?.focus());
    }, [onExpandedChange, progress, springConfig]);

    const collapse = useCallback(() => {
      setExpanded(false);
      onExpandedChange?.(false);
      progress.value = withSpring(0, springConfig);
      if (controlledValue === undefined) setInternalValue("");
      inputRef.current?.blur();
    }, [controlledValue, onExpandedChange, progress, springConfig]);

    const toggle = useCallback(
      () => (expanded ? collapse() : expand()),
      [expanded, expand, collapse],
    );

    const setValue = useCallback(
      (v: string) => {
        if (controlledValue === undefined) setInternalValue(v);
        onChange?.(v);
      },
      [controlledValue, onChange],
    );

    const selectTab = useCallback(
      (v: string) => {
        if (controlledActiveTab === undefined) setInternalActive(v);
        onTabChange?.(v);
      },
      [controlledActiveTab, onTabChange],
    );

    const contextValue = useMemo(
      () => ({
        progress,
        expanded,
        expand,
        collapse,
        toggle,
        value,
        setValue,
        activeTab,
        selectTab,
        registerTab,
        unregisterTab,
        reportLayout,
        layouts,
        setTabsWidth,
        colorScheme: scheme,
        springConfig,
      }),
      [
        progress,
        expanded,
        expand,
        collapse,
        toggle,
        value,
        setValue,
        activeTab,
        selectTab,
        registerTab,
        unregisterTab,
        reportLayout,
        layouts,
        setTabsWidth,
        scheme,
        springConfig,
      ],
    );

    const total = HEIGHT + GAP + tabsW;

    const uniforms = useDerivedValue<Uniforms>(() => {
      const p = progress.value;
      const sW = HEIGHT + (tabsW - HEIGHT) * p;
      const rW = tabsW + (CLOSE_W - tabsW) * p;
      return {
        u_resolution: [total, HEIGHT + PAD_V * 2],
        u_search: [0, PAD_V, sW, HEIGHT],
        u_right: [total - rW, PAD_V, rW, HEIGHT],
        u_radius: HEIGHT / 2,
        u_k: kGoo,
        u_color: colorRGB,
      };
    }, [progress, total, tabsW, kGoo, colorRGB]);

    const inputStyle = useAnimatedStyle(() => ({
      opacity: interpolate(progress.value, [0.35, 0.9], [0, 1], Extrapolation.CLAMP),
      transform: [
        {
          translateX: interpolate(
            progress.value,
            [0, 1],
            [-10, 0],
            Extrapolation.CLAMP,
          ),
        },
      ],
    }));

    const closeStyle = useAnimatedStyle(() => ({
      opacity: interpolate(progress.value, [0.55, 1], [0, 1], Extrapolation.CLAMP),
      transform: [
        {
          scale: interpolate(progress.value, [0.5, 1], [0.6, 1], Extrapolation.CLAMP),
        },
      ],
    }));

    const showDefaultTrigger = !hasChildType(children, GooeyTrigger);

    return (
      <GooeyContext.Provider value={contextValue}>
        <View style={[styles.root, { width: total, height: HEIGHT }, style]}>
          {EFFECT && tabsW > 0 ? (
            <Canvas
              pointerEvents="none"
              style={[styles.canvas, { height: HEIGHT + PAD_V * 2 }]}
            >
              <Fill>
                <Shader source={EFFECT} uniforms={uniforms} />
              </Fill>
            </Canvas>
          ) : null}

          {showDefaultTrigger ? <GooeyTrigger /> : null}

          {children}

          <Animated.View
            style={[styles.inputWrap, inputStyle]}
            pointerEvents={expanded ? "auto" : "none"}
          >
            <TextInput
              ref={inputRef}
              style={[styles.input, { color: scheme.fg }, textStyle]}
              placeholder={placeholder}
              placeholderTextColor={scheme.muted}
              value={value}
              editable={expanded}
              onChangeText={setValue}
              onSubmitEditing={() => onSearch?.(value)}
              returnKeyType="search"
            />
          </Animated.View>

          <Animated.View
            style={[styles.closeButton, closeStyle]}
            pointerEvents={expanded ? "auto" : "none"}
          >
            <Pressable style={styles.iconInner} onPress={collapse} hitSlop={8}>
              <Feather name="x" size={ICON_SIZE} color={scheme.fg} />
            </Pressable>
          </Animated.View>
        </View>
      </GooeyContext.Provider>
    );
  },
);

GooeyRoot.displayName = "GooeySearchTabs";

/* -------------------------------------------------------------------------- */
/*                                  Trigger                                   */
/* -------------------------------------------------------------------------- */

const GooeyTrigger = memo<IGooeyTrigger>(
  ({ children, style }: IGooeyTrigger): React.JSX.Element => {
    const { expanded, expand, colorScheme } = useGooey();
    return (
      <Pressable
        style={[styles.trigger, style]}
        onPress={expanded ? undefined : expand}
        hitSlop={8}
      >
        {children ?? (
          <Feather name="search" size={ICON_SIZE} color={colorScheme.fg} />
        )}
      </Pressable>
    );
  },
);

GooeyTrigger.displayName = "GooeySearchTabs.Trigger";

/* -------------------------------------------------------------------------- */
/*                                   Tabs                                     */
/* -------------------------------------------------------------------------- */

const GooeyTabs = memo<IGooeyTabs>(
  ({ children, style }: IGooeyTabs): React.JSX.Element => {
    const { progress, expanded, activeTab, layouts, setTabsWidth, colorScheme, springConfig } =
      useGooey();

    const idxX = useSharedValue(0);
    const idxW = useSharedValue(0);

    useEffect(() => {
      const l = layouts[activeTab];
      if (!l) return;
      const immediate = idxW.value === 0;
      idxX.value = immediate ? l.x : withSpring(l.x, springConfig);
      idxW.value = immediate ? l.width : withSpring(l.width, springConfig);
    }, [activeTab, layouts, springConfig, idxX, idxW]);

    const rowStyle = useAnimatedStyle(() => ({
      opacity: interpolate(progress.value, [0, 0.45], [1, 0], Extrapolation.CLAMP),
    }));

    const indicatorStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: idxX.value }],
      width: idxW.value,
    }));

    return (
      <Animated.View
        style={[styles.tabsRow, rowStyle, style]}
        pointerEvents={expanded ? "none" : "auto"}
        onLayout={(e: LayoutChangeEvent) =>
          setTabsWidth(e.nativeEvent.layout.width)
        }
      >
        <Animated.View
          style={[
            styles.indicator,
            { backgroundColor: colorScheme.indicator },
            indicatorStyle,
          ]}
        />
        {children}
      </Animated.View>
    );
  },
);

GooeyTabs.displayName = "GooeySearchTabs.Tabs";

/* -------------------------------------------------------------------------- */
/*                                    Tab                                     */
/* -------------------------------------------------------------------------- */

const GooeyTab = memo<IGooeyTab>(
  ({
    value,
    children,
    tabPaddingHorizontal = _TAB_PADDING_HORIZONTAL,
    onPress,
    style,
  }: IGooeyTab): React.JSX.Element => {
    const { activeTab, selectTab, registerTab, unregisterTab, reportLayout } =
      useGooey();

    useEffect(() => {
      registerTab(value);
      return () => unregisterTab(value);
    }, [value, registerTab, unregisterTab]);

    const active = value === activeTab;
    const tabCtx = useMemo(() => ({ value, active }), [value, active]);

    return (
      <TabContext.Provider value={tabCtx}>
        <Pressable
          style={[styles.tab, { paddingHorizontal: tabPaddingHorizontal }, style]}
          onPress={() => {
            selectTab(value);
            onPress?.(value);
          }}
          onLayout={(e: LayoutChangeEvent) =>
            reportLayout(value, {
              x: e.nativeEvent.layout.x,
              width: e.nativeEvent.layout.width,
            })
          }
        >
          {children}
        </Pressable>
      </TabContext.Provider>
    );
  },
);

GooeyTab.displayName = "GooeySearchTabs.Tab";

/* -------------------------------------------------------------------------- */
/*                                 TabIcon                                    */
/* -------------------------------------------------------------------------- */

const GooeyTabIcon = memo<IGooeyTabIcon>(
  ({ children, style }: IGooeyTabIcon): React.JSX.Element => {
    const { active } = useTab();
    return (
      <View style={[styles.tabIcon, { opacity: active ? 1 : 0.6 }, style]}>
        {children}
      </View>
    );
  },
);

GooeyTabIcon.displayName = "GooeySearchTabs.TabIcon";

/* -------------------------------------------------------------------------- */
/*                                 TabLabel                                   */
/* -------------------------------------------------------------------------- */

const GooeyTabLabel = memo<IGooeyTabLabel>(
  ({ children, style }: IGooeyTabLabel): React.JSX.Element => {
    const { active } = useTab();
    const { colorScheme } = useGooey();
    return (
      <Text
        style={[
          styles.tabLabel,
          { color: active ? colorScheme.fg : colorScheme.muted },
          style,
        ]}
        numberOfLines={1}
      >
        {children}
      </Text>
    );
  },
);

GooeyTabLabel.displayName = "GooeySearchTabs.TabLabel";

/* -------------------------------------------------------------------------- */
/*                            Compound wiring                                 */
/* -------------------------------------------------------------------------- */

const GooeySearchTabs = Object.assign(GooeyRoot, {
  Trigger: GooeyTrigger,
  Tabs: GooeyTabs,
  Tab: GooeyTab,
  TabIcon: GooeyTabIcon,
  TabLabel: GooeyTabLabel,
});

export { GooeySearchTabs };
export default GooeySearchTabs;
export type { IGooeySearchTabs } from "./types";

const styles = StyleSheet.create({
  root: {
    alignSelf: "center",
    justifyContent: "center",
  },
  canvas: {
    position: "absolute",
    left: 0,
    right: 0,
    top: -PAD_V,
  },
  trigger: {
    position: "absolute",
    left: 0,
    top: 0,
    width: HEIGHT,
    height: HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  iconInner: {
    width: HEIGHT,
    height: HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  inputWrap: {
    position: "absolute",
    left: HEIGHT,
    right: HEIGHT,
    top: 0,
    height: HEIGHT,
    justifyContent: "center",
    paddingRight: H_PADDING,
  },
  input: {
    fontSize: 15,
    paddingVertical: 0,
  },
  tabsRow: {
    position: "absolute",
    right: 0,
    top: 0,
    height: HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  indicator: {
    position: "absolute",
    top: (HEIGHT - 32) / 2,
    left: 0,
    height: 32,
    borderRadius: 16,
  },
  tab: {
    height: HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tabIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  closeButton: {
    position: "absolute",
    right: 0,
    top: 0,
    width: CLOSE_W,
    height: HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
});
