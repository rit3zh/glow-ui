import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useId,
  useEffect,
  memo,
} from "react";
import { StyleSheet, View, Pressable, ViewStyle, AppState } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  useAnimatedProps,
  interpolate,
  withSpring,
} from "react-native-reanimated";
import { setStatusBarHidden } from "expo-status-bar";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";
import { BlurView, BlurViewProps } from "expo-blur";
import type {
  IContent,
  IDynamicIslandConfig,
  IDynamicIslandContext,
  IProvider,
  ISlotRegistry,
  ITrigger,
  SlotType,
} from "./types";
import { DEFAULT_CONFIG } from "./conf";

const AnimatedBlurView =
  Animated.createAnimatedComponent<BlurViewProps>(BlurView);

const DynamicIslandContext: React.Context<IDynamicIslandContext | null> =
  createContext<IDynamicIslandContext | null>(null);

export const useDynamicIsland = (): {
  isExpanded: boolean;
  expand: () => void;
  collapse: () => void;
  toggle: () => void;
} => {
  const context: IDynamicIslandContext | null =
    useContext(DynamicIslandContext);
  if (context === null) {
    throw new Error(
      "useDynamicIsland must be used within DynamicIsland.Provider",
    );
  }
  return {
    isExpanded: context.isExpanded,
    expand: context.expand,
    collapse: context.collapse,
    toggle: context.toggle,
  };
};

export const DynamicIslandProvider: React.FC<
  React.PropsWithChildren<IProvider>
> = memo<IProvider>(
  ({
    children,
    config: configProp,
    theme,
    onExpand,
    onCollapse,
    haptics = true,
    style,
  }: React.PropsWithChildren<IProvider>): React.ReactNode &
    React.JSX.Element => {
    const config: IDynamicIslandConfig = useMemo<IDynamicIslandConfig>(
      () => ({
        ...DEFAULT_CONFIG,
        ...configProp,
        theme: theme ?? DEFAULT_CONFIG.theme,
      }),
      [configProp, theme],
    );

    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const [slots, setSlots] = useState<ISlotRegistry>({
      trigger: new Map<string, React.ReactNode>(),
      content: new Map<string, React.ReactNode>(),
    });

    const progress = useSharedValue<number>(0);
    const activeAppState = useSharedValue<number>(1);

    const registerSlot = useCallback<IDynamicIslandContext["registerSlot"]>(
      (type: SlotType, id: string, node: React.ReactNode): void => {
        setSlots((prev) => {
          const next = new Map(prev[type]);
          next.set(id, node);
          return { ...prev, [type]: next };
        });
      },
      [],
    );

    const unregisterSlot = useCallback<IDynamicIslandContext["unregisterSlot"]>(
      (type: SlotType, id: string): void => {
        setSlots((prev) => {
          const next = new Map(prev[type]);
          next.delete(id);
          return { ...prev, [type]: next };
        });
      },
      [],
    );

    const triggerContent: React.ReactNode | null =
      useMemo<React.ReactNode | null>(() => {
        const values = Array.from(slots.trigger.values());
        return values[values.length - 1] ?? null;
      }, [slots.trigger]);

    const expandedContent: React.ReactNode | null =
      useMemo<React.ReactNode | null>(() => {
        const values = Array.from(slots.content.values());
        return values[values.length - 1] ?? null;
      }, [slots.content]);

    const animateTo = useCallback<(expanded: boolean) => void>(
      (expanded: boolean): void => {
        progress.value = withTiming(expanded ? 1 : 0, {
          duration: config.duration,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
        setStatusBarHidden(expanded, "slide");
      },
      [config.duration, progress],
    );

    const expand = useCallback((): void => {
      setIsExpanded(true);
      animateTo(true);
      if (haptics) {
        impactAsync(ImpactFeedbackStyle.Medium);
      }
      onExpand?.();
    }, [animateTo, haptics, onExpand]);

    const collapse = useCallback((): void => {
      setIsExpanded(false);
      animateTo(false);
      if (haptics) {
        impactAsync(ImpactFeedbackStyle.Light);
      }
      onCollapse?.();
    }, [animateTo, haptics, onCollapse]);

    const toggle = useCallback((): void => {
      setIsExpanded((prev) => {
        const next = !prev;
        animateTo(next);
        if (haptics) {
          impactAsync(
            next ? ImpactFeedbackStyle.Medium : ImpactFeedbackStyle.Light,
          );
        }
        next ? onExpand?.() : onCollapse?.();
        return next;
      });
    }, [animateTo, haptics, onExpand, onCollapse]);

    const islandStyle = useAnimatedStyle<ViewStyle>(() => ({
      width:
        config.collapsedWidth +
        (config.expandedWidth - config.collapsedWidth) * progress.value,
      height:
        config.collapsedHeight +
        (config.expandedHeight - config.collapsedHeight) * progress.value,
    }));

    const triggerStyle = useAnimatedStyle<ViewStyle>(() => ({
      opacity: interpolate(progress.value, [0, 0.6, 1], [1, 0, 0]),
      transform: [
        { scale: interpolate(progress.value, [0, 1], [1, 0.6]) },
        { translateY: interpolate(progress.value, [0, 1], [0, -20]) },
      ],
    }));

    const contentStyle = useAnimatedStyle<ViewStyle>(() => ({
      opacity: interpolate(progress.value, [0, 0.4, 1], [0, 0, 1]),
      transform: [
        { scale: interpolate(progress.value, [0.5, 1], [0.6, 1]) },
        { translateY: interpolate(progress.value, [0, 1], [100, 0]) },
      ],
    }));

    const contextValue: IDynamicIslandContext = useMemo<IDynamicIslandContext>(
      () => ({
        isExpanded,
        expand,
        collapse,
        toggle,
        registerSlot,
        unregisterSlot,
      }),
      [isExpanded, expand, collapse, toggle, registerSlot, unregisterSlot],
    );

    const animatedBlurProps = useAnimatedProps<BlurViewProps>(() => ({
      intensity: withSpring(
        interpolate(progress.value, [0, 0.4, 0.8, 1], [10.5, 25.5, 45.5, 0]),
      ),
    }));
    const animatedStylez = useAnimatedStyle<ViewStyle>(() => ({
      opacity: interpolate(activeAppState.value, [1, 0], [1, 0]),
    }));

    useEffect(() => {
      const subscription = AppState.addEventListener("change", (state) => {
        if (state === "active") {
          console.log("active");
          activeAppState.value = withTiming(1, { duration: 300 });
        } else {
          console.log("inactive");
          activeAppState.value = withTiming(0, { duration: 300 });
        }
      });

      return () => subscription.remove();
    }, []);

    return (
      <DynamicIslandContext.Provider value={contextValue}>
        <Animated.View
          style={[styles.container, { top: config.topOffset }, animatedStylez]}
          pointerEvents="box-none"
        >
          <Pressable onPress={toggle}>
            <Animated.View
              style={[
                styles.island,
                {
                  backgroundColor: config.theme.backgroundColor,
                  borderRadius: config.theme.borderRadius,
                },
                islandStyle,
                style,
              ]}
            >
              <Animated.View style={[styles.slot, triggerStyle]}>
                {triggerContent}
              </Animated.View>
              <Animated.View
                style={[styles.slot, styles.expandedSlot, contentStyle]}
              >
                {expandedContent}
              </Animated.View>
              <AnimatedBlurView
                animatedProps={animatedBlurProps}
                tint="dark"
                style={[
                  StyleSheet.absoluteFill,
                  {
                    overflow: "hidden",
                    borderRadius: config.theme.borderRadius,
                  },
                ]}
              />
            </Animated.View>
          </Pressable>
        </Animated.View>
        {children}
      </DynamicIslandContext.Provider>
    );
  },
);

export const DynamicIslandTrigger: React.FC<ITrigger> = memo(
  ({
    children,
    style,
  }: ITrigger): (React.ReactNode & React.JSX.Element) | null => {
    const context = useContext(DynamicIslandContext);
    const id: string = useId();

    if (context === null) {
      throw new Error(
        "DynamicIsland.Trigger must be used within DynamicIsland.Provider",
      );
    }

    useEffect(() => {
      const node: React.ReactNode = style ? (
        <View style={style}>{children}</View>
      ) : (
        children
      );
      context.registerSlot<"trigger", typeof id, typeof node>(
        "trigger",
        id,
        node,
      );
      return () => {
        context.unregisterSlot<"trigger", typeof id>("trigger", id);
      };
    }, [id, children, style, context]);

    return null;
  },
);

export const DynamicIslandContent: React.FC<IContent> = memo(
  ({
    children,
    style,
  }: IContent): (React.ReactNode & React.JSX.Element) | null => {
    const context = useContext(DynamicIslandContext);
    const id: string = useId();

    if (context === null) {
      throw new Error(
        "DynamicIsland.Content must be used within DynamicIsland.Provider",
      );
    }

    useEffect(() => {
      const node: React.ReactNode = (
        <View style={[styles.contentInner, style]}>{children}</View>
      );
      context.registerSlot<"content", typeof id, typeof node>(
        "content",
        id,
        node,
      );
      return () => {
        context.unregisterSlot<"content", typeof id>("content", id);
      };
    }, [id, children, style, context]);

    return null;
  },
);

export const DynamicIsland: {
  Provider: React.FC<React.PropsWithChildren<IProvider>>;
  Trigger: React.FC<ITrigger>;
  Content: React.FC<IContent>;
} = {
  Provider: DynamicIslandProvider,
  Trigger: DynamicIslandTrigger,
  Content: DynamicIslandContent,
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 9999,
  },
  island: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  slot: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  expandedSlot: {
    width: "100%",
    height: "100%",
    padding: 16,
  },
  contentInner: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
