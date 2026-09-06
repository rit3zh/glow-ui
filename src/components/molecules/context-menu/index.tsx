// @ts-check
import React, {
  PropsWithChildren,
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import {
  Dimensions,
  LayoutChangeEvent,
  Modal,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { BlurView, BlurViewProps } from "expo-blur";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import {
  DEFAULT_MENU_WIDTH,
  IS_IOS,
  PREVIEW_SCALE,
  PRESS_SCALE,
  THEME,
} from "./const";
import { ContextMenuContext, useContextMenu } from "./context";
import { triggerHaptic } from "./helpers";
import { useContextMenuController, useMenuLayout } from "./hooks";
import type {
  IContextMenuContent,
  IContextMenuItem,
  IContextMenuItemIcon,
  IContextMenuItemLabel,
  IContextMenuItemSubtitle,
  IContextMenuLabel,
  IContextMenuRoot,
  IContextMenuTrigger,
} from "./types";
import { createCompoundComponent } from "@/utils/create-compound-component";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const Backdrop: React.FC = (): React.JSX.Element => {
  const { progress, theme, close } = useContextMenu("Backdrop");
  const palette = THEME[theme];

  const iosBlurProps = useAnimatedProps(() => ({
    intensity: interpolate(progress.value, [0, 1], [0, 30]),
  }));

  const androidStyle = useAnimatedStyle<Pick<ViewStyle, "opacity">>(() => ({
    opacity: progress.value,
  }));

  return (
    <Pressable style={StyleSheet.absoluteFill} onPress={close}>
      {IS_IOS ? (
        <AnimatedBlurView
          animatedProps={iosBlurProps}
          tint={palette.blurTint}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: palette.backdrop },
            androidStyle,
          ]}
        />
      )}
    </Pressable>
  );
};

const Preview: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren): React.JSX.Element &
  React.ReactNode &
  React.ReactElement => {
  const { progress, pressed, rect, layout } =
    useContextMenu<"Preview">("Preview");

  const style = useAnimatedStyle<Pick<ViewStyle, "transform">>(() => {
    const shift = layout ? layout.shift : 0;

    const restScale = interpolate(pressed.value, [0, 1], [1, PRESS_SCALE]);
    return {
      transform: [
        { translateY: shift * progress.value },
        {
          scale: interpolate(
            progress.value,
            [0, 1],
            [restScale, PREVIEW_SCALE],
          ),
        },
      ],
    };
  }, [layout]);

  if (!rect) return <></>;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          left: rect.x,
          top: rect.y,
          width: rect.w,
          height: rect.h,
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

const ContextMenuRoot: React.FC<IContextMenuRoot> &
  React.FunctionComponent<IContextMenuRoot> = ({
  children,
  theme = "light",
  menuWidth = DEFAULT_MENU_WIDTH,
  onOpenChange,
}: IContextMenuRoot): React.JSX.Element &
  React.ReactNode &
  React.ReactElement => {
  const controller = useContextMenuController(onOpenChange);
  const layout = useMenuLayout(
    controller.rect,
    controller.menuHeight,
    menuWidth,
  );
  const previewRef = useRef<ReactNode>(null);

  const ctx = useMemo(
    () => ({ theme, menuWidth, layout, previewRef, ...controller }),
    [theme, menuWidth, layout, controller],
  );

  return (
    <ContextMenuContext.Provider value={ctx}>
      {children}
    </ContextMenuContext.Provider>
  );
};

const ContextMenuTrigger: React.FC<IContextMenuTrigger> &
  React.FunctionComponent<IContextMenuTrigger> = ({
  children,
  disabled = false,
  longPressDuration = 250,
  style,
}: IContextMenuTrigger): React.JSX.Element &
  React.ReactNode &
  React.ReactElement => {
  const { openMenu, previewRef, progress, pressed } = useContextMenu(
    "ContextMenu.Trigger",
  );
  const ref = useRef<View>(null);

  previewRef.current = children;

  const handleLongPress = useCallback(() => {
    ref.current?.measureInWindow((x, y, w, h) => {
      openMenu({ x, y, w, h });
      triggerHaptic();

      pressed.value = withTiming(0, {
        duration: 220,
        easing: Easing.out(Easing.quad),
      });
    });
  }, [openMenu, pressed]);

  const pressStyle = useAnimatedStyle<Pick<ViewStyle, "opacity" | "transform">>(
    () => ({
      opacity: progress.value > 0 ? 0 : 1,
      transform: [
        { scale: interpolate(pressed.value, [0, 1], [1, PRESS_SCALE]) },
      ],
    }),
  );

  const handlePressIn = useCallback(() => {
    pressed.value = withTiming(1, {
      duration: longPressDuration,
      easing: Easing.out(Easing.quad),
    });
  }, [longPressDuration, pressed]);

  const handlePressOut = useCallback(() => {
    pressed.value = withTiming(0, {
      duration: 160,
      easing: Easing.out(Easing.quad),
    });
  }, [pressed]);

  return (
    <Pressable
      ref={ref}
      disabled={disabled}
      delayLongPress={longPressDuration}
      onLongPress={handleLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={style}
    >
      <Animated.View style={pressStyle}>{children}</Animated.View>
    </Pressable>
  );
};

const ContextMenuContent: React.FC<IContextMenuContent> &
  React.FunctionComponent<IContextMenuContent> = ({
  children,
  style,
}: IContextMenuContent): React.JSX.Element &
  React.ReactElement &
  React.ReactNode => {
  const {
    visible,
    progress,
    theme,
    menuWidth,
    layout,
    previewRef,
    setMenuHeight,
    close,
  } = useContextMenu("ContextMenu.Content");
  const palette = THEME[theme];

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => setMenuHeight(e.nativeEvent.layout.height),
    [setMenuHeight],
  );

  const blurProps = useAnimatedProps<Pick<BlurViewProps, "intensity">>(() => ({
    intensity: progress.value * 70,
  }));

  const animatedStyle = useAnimatedStyle<
    Pick<ViewStyle, "opacity" | "transform">
  >(() => {
    const shift = layout ? layout.shift : 0;
    return {
      opacity: interpolate(
        progress.value,
        [0, 0.9],
        [0, 1],
        Extrapolation.CLAMP,
      ),
      transform: [
        { translateY: shift * progress.value },
        { scale: interpolate(progress.value, [0, 1], [0.8, 1]) },
      ],
    };
  }, [layout]);

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="none"
      onRequestClose={close}
    >
      <Backdrop />
      <Preview>{previewRef.current}</Preview>

      <Animated.View
        onLayout={onLayout}
        style={[
          styles.menu,
          {
            width: menuWidth,
            left: layout?.menuLeft ?? 0,
            top: layout?.menuTop ?? 0,
            opacity: layout ? undefined : 0,
            transformOrigin: `${layout?.originX ?? 0}px ${layout?.originY ?? "top"}`,
          },
          animatedStyle,
        ]}
      >
        <AnimatedBlurView
          intensity={0}
          tint={palette.blurTint}
          animatedProps={blurProps}
          style={StyleSheet.absoluteFill}
        />
        <View
          style={[StyleSheet.absoluteFill, { backgroundColor: palette.menuBg }]}
        />
        <View style={[styles.menuInner, style]}>{children}</View>
      </Animated.View>
    </Modal>
  );
};

interface IItemTextStyle {
  color: string;
  labelColor: string;
  textStyle?: StyleProp<TextStyle>;
}

const ItemTextContext = React.createContext<IItemTextStyle | null>(null);

const buildRows = (
  children: ReactNode,
  renderText: (nodes: ReactNode[], key: string) => ReactNode,
): ReactNode[] => {
  const out: ReactNode[] = [];
  let buffer: ReactNode[] = [];

  const flush = () => {
    if (buffer.length === 0) return;
    out.push(renderText(buffer, `text-${out.length}`));
    buffer = [];
  };

  React.Children.toArray(children).forEach((child) => {
    if (typeof child === "string" || typeof child === "number") {
      buffer.push(child);
      return;
    }
    flush();
    out.push(child);
  });
  flush();

  return out;
};

const ContextMenuItemIcon: React.FC<IContextMenuItemIcon> = ({
  children,
}: IContextMenuItemIcon): React.JSX.Element => (
  <View style={styles.itemIcon}>{children}</View>
);

const ContextMenuItemSubtitle: React.FC<IContextMenuItemSubtitle> = ({
  children,
}: IContextMenuItemSubtitle): React.JSX.Element => {
  const text = React.useContext(ItemTextContext);
  return (
    <Text
      numberOfLines={2}
      style={[styles.itemSubtitle, { color: text?.labelColor }]}
    >
      {children}
    </Text>
  );
};

const ContextMenuItemLabelBase: React.FC<IContextMenuItemLabel> = ({
  children,
}: IContextMenuItemLabel): React.JSX.Element => {
  const text = React.useContext(ItemTextContext);
  const rows = buildRows(children, (nodes, key) => (
    <Text
      key={key}
      numberOfLines={1}
      style={[styles.itemText, { color: text?.color }, text?.textStyle]}
    >
      {nodes}
    </Text>
  ));
  return <View style={styles.itemTextCol}>{rows}</View>;
};

const ContextMenuItemLabel = Object.assign(ContextMenuItemLabelBase, {
  Subtitle: ContextMenuItemSubtitle,
});

const ContextMenuItem: React.FC<IContextMenuItem> &
  React.FunctionComponent<IContextMenuItem> = ({
  children,
  onPress,
  destructive = false,
  disabled = false,
  closeOnPress = true,
  style,
  textStyle,
}: IContextMenuItem): React.JSX.Element &
  React.ReactElement &
  React.ReactNode => {
  const { theme, close } = useContextMenu("ContextMenu.Item");
  const palette = THEME[theme];
  const color = destructive ? palette.destructive : palette.text;
  const active = useSharedValue<number>(0);

  const textCtx = useMemo<IItemTextStyle>(
    () => ({ color, labelColor: palette.label, textStyle }),
    [color, palette.label, textStyle],
  );

  const content = buildRows(children, (nodes, key) => (
    <View key={key} style={styles.itemTextCol}>
      <Text numberOfLines={1} style={[styles.itemText, { color }, textStyle]}>
        {nodes}
      </Text>
    </View>
  ));

  const handlePress = useCallback(() => {
    onPress?.();
    if (closeOnPress) close();
  }, [onPress, closeOnPress, close]);

  const highlightStyle = useAnimatedStyle(() => ({
    opacity: active.value,
  }));

  const setActive = (v: number) => {
    active.value = withTiming(v, {
      duration: v ? 120 : 220,
      easing: Easing.out(Easing.quad),
    });
  };

  return (
    <AnimatedPressable
      disabled={disabled}
      onPress={handlePress}
      onPressIn={() => setActive(1)}
      onPressOut={() => setActive(0)}
      onHoverIn={() => setActive(1)}
      onHoverOut={() => setActive(0)}
      style={[styles.item, disabled ? styles.disabled : null, style]}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.highlight,
          { backgroundColor: palette.highlight },
          highlightStyle,
        ]}
      />
      <ItemTextContext.Provider value={textCtx}>
        {content}
      </ItemTextContext.Provider>
    </AnimatedPressable>
  );
};

const ContextMenuLabel: React.FC<IContextMenuLabel> &
  React.FunctionComponent<IContextMenuItemLabel> = ({
  children,
  style,
}: IContextMenuLabel): React.JSX.Element &
  React.ReactElement &
  React.ReactNode => {
  const { theme } = useContextMenu("ContextMenu.Label");
  const palette = THEME[theme];
  return (
    <View style={styles.label}>
      <Text style={[styles.labelText, { color: palette.label }, style]}>
        {children}
      </Text>
    </View>
  );
};

const ContextMenuSeparator: React.FC = (): React.JSX.Element &
  React.ReactElement &
  React.ReactNode => {
  const { theme } = useContextMenu("ContextMenu.Separator");
  return (
    <View style={styles.separatorRow}>
      <View
        style={[
          styles.separator,
          {
            width: SCREEN_WIDTH * 0.55,
            backgroundColor: THEME[theme].separator,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  menu: {
    position: "absolute",
    borderRadius: 36,
    overflow: "hidden",
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 24,
      },
      android: { elevation: 12 },
    }),
    paddingBottom: 12,
    paddingTop: 12,
  },
  menuInner: {
    overflow: "hidden",
  },
  item: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 8,
    gap: 16,
  },
  highlight: {
    position: "absolute",
    top: 3,
    left: 8,
    right: 8,
    bottom: 3,
    borderRadius: 18,
  },
  itemIcon: {
    width: 26,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  itemTextCol: {
    flex: 1,
    justifyContent: "center",
  },
  itemText: {
    fontSize: 17,
    flexShrink: 1,
  },
  itemSubtitle: {
    fontSize: 13,
    marginTop: 1,
    flexShrink: 1,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  labelText: {
    fontSize: 13,
    fontWeight: "600",
  },
  separatorRow: {
    paddingVertical: 4,
    paddingLeft: 12,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
  },
});

const Trigger = createCompoundComponent("Trigger", ContextMenuTrigger);
const Root = createCompoundComponent("Root", ContextMenuRoot);
const Content = createCompoundComponent("Content", ContextMenuContent);
const Item = createCompoundComponent("Item", ContextMenuItem, {
  Icon: ContextMenuItemIcon,
  Label: createCompoundComponent("Label", ContextMenuItemLabel, {
    Subtitle: ContextMenuItemSubtitle,
  }),
});
const Label = createCompoundComponent("Label", ContextMenuLabel);
const Separator = createCompoundComponent("Separator", ContextMenuSeparator);

const ContextMenu = Object.assign(ContextMenuRoot, {
  Root: ContextMenuRoot,
  Trigger: ContextMenuTrigger,
  Content: ContextMenuContent,
  Item: Object.assign(ContextMenuItem, {
    Icon: ContextMenuItemIcon,
    Label: ContextMenuItemLabel,
  }),
  Label: ContextMenuLabel,
  Separator: ContextMenuSeparator,
});

export {
  ContextMenu,
  ContextMenuRoot,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuItemIcon,
  ContextMenuItemLabel,
  ContextMenuLabel,
  ContextMenuSeparator,
};
export { Trigger, Root, Content, Item, Label, Separator };
export default ContextMenu;
export type {
  IContextMenuRoot,
  IContextMenuTrigger,
  IContextMenuContent,
  IContextMenuItem,
  IContextMenuLabel,
} from "./types";
