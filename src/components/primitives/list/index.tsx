import React, { Children, isValidElement, useMemo } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SquircleView } from "@/components/base/squircle-view";
import { createCompoundComponent } from "@/utils/create-compound-component";
import {
  ListContext,
  ListItemContentContext,
  ListItemContext,
  ListRowContext,
  useIsInListItemContent,
  useList,
  useListItem,
  useListRow,
} from "./context";
import {
  LIST_CORNER_RADIUS,
  LIST_ICON_GAP,
  LIST_ICON_WIDTH,
  LIST_ROW_HEIGHT,
  LIST_ROW_PADDING_X,
  LIST_SECTION_GAP,
  LIST_SEPARATOR_INSET,
  LIST_SEPARATOR_INSET_ICON,
  LIST_THEME,
} from "./const";
import type {
  IListContextValue,
  IListItem,
  IListItemChevron,
  IListItemContent,
  IListItemContextValue,
  IListItemIcon,
  IListItemSubtitle,
  IListItemTitle,
  IListItemValue,
  IListRoot,
  IListSection,
  IListSectionContent,
  IListSectionFooter,
  IListSectionTitle,
  IListSeparator,
} from "./types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ListRoot: React.FC<IListRoot> = ({
  children,
  theme = "dark",
  style,
}): React.JSX.Element & React.ReactNode => {
  const palette = LIST_THEME[theme];

  const ctx = useMemo<IListContextValue>(
    () => ({ theme, palette }),
    [theme, palette],
  );

  return (
    <ListContext.Provider value={ctx}>
      <View style={[styles.root, style]}>{children}</View>
    </ListContext.Provider>
  );
};

const ListSeparator: React.FC<IListSeparator> = ({
  inset = LIST_SEPARATOR_INSET,
  spacing,
  style,
}): React.JSX.Element & React.ReactNode => {
  const { palette } = useList("List.Separator");

  if (spacing != null) {
    return <View style={[{ height: spacing }, style]} />;
  }

  return (
    <View
      style={[
        styles.separator,
        { backgroundColor: palette.separator, marginLeft: inset },
        style,
      ]}
    />
  );
};

const ListSectionTitle: React.FC<IListSectionTitle> = ({
  children,
  style,
}): React.JSX.Element & React.ReactNode => {
  const { palette } = useList("List.Section.Title");

  return (
    <Text style={[styles.sectionTitle, { color: palette.header }, style]}>
      {children}
    </Text>
  );
};

const ListSectionFooter: React.FC<IListSectionFooter> = ({
  children,
  style,
}): React.JSX.Element & React.ReactNode => {
  const { palette } = useList("List.Section.Footer");

  return (
    <Text style={[styles.sectionFooter, { color: palette.footer }, style]}>
      {children}
    </Text>
  );
};

const isSeparator = (node: React.ReactNode): boolean =>
  isValidElement(node) && node.type === ListSeparator;

const ListSectionContent: React.FC<IListSectionContent> = ({
  children,
  style,
}): React.JSX.Element => {
  const { palette } = useList("List.Section.Content");
  const rows = Children.toArray(children);

  return (
    <SquircleView
      cornerRadius={LIST_CORNER_RADIUS}
      cornerSmoothing={1}
      backgroundColor={palette.cardBg}
      borderColor={palette.cardBorder}
      borderWidth={0.5}
      style={[styles.card, style]}
    >
      {rows.map((row, index) => {
        const next = rows[index + 1];
        const isLast = next == null || isSeparator(next);

        return (
          <ListRowContext.Provider key={index} value={{ isLast }}>
            {row}
          </ListRowContext.Provider>
        );
      })}
    </SquircleView>
  );
};

const ListSection: React.FC<IListSection> = ({
  children,
  style,
}): React.JSX.Element => {
  useList("List.Section");
  return <View style={[styles.section, style]}>{children}</View>;
};

const ListItemIcon: React.FC<IListItemIcon> = ({
  children,
  style,
}): React.JSX.Element => {
  useListItem("List.Item.Icon");
  return <View style={[styles.icon, style]}>{children}</View>;
};

const ListItemContent: React.FC<IListItemContent> = ({
  children,
  style,
}): React.JSX.Element => {
  useListItem("List.Item.Content");
  return (
    <ListItemContentContext.Provider value={true}>
      <View style={[styles.content, style]}>{children}</View>
    </ListItemContentContext.Provider>
  );
};

const ListItemTitle: React.FC<IListItemTitle> = ({
  children,
  numberOfLines = 1,
  style,
}): React.JSX.Element => {
  const { palette } = useList("List.Item.Title");
  const { destructive } = useListItem("List.Item.Title");

  const inContent = useIsInListItemContent();

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        styles.title,
        inContent ? null : styles.titleFill,
        { color: destructive ? palette.destructive : palette.text },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

const ListItemSubtitle: React.FC<IListItemSubtitle> = ({
  children,
  numberOfLines = 1,
  style,
}): React.JSX.Element => {
  const { palette } = useList("List.Item.Subtitle");
  useListItem("List.Item.Subtitle");

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[styles.subtitle, { color: palette.secondaryText }, style]}
    >
      {children}
    </Text>
  );
};

const ListItemValue: React.FC<IListItemValue> = ({
  children,
  numberOfLines = 1,
  style,
}): React.JSX.Element => {
  const { palette } = useList("List.Item.Value");
  useListItem("List.Item.Value");

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[styles.value, { color: palette.secondaryText }, style]}
    >
      {children}
    </Text>
  );
};

const ListItemChevron: React.FC<IListItemChevron> = ({
  size = 18,
  color,
  style,
}): React.JSX.Element => {
  const { palette } = useList("List.Item.Chevron");
  useListItem("List.Item.Chevron");

  return (
    <Feather
      name="chevron-right"
      size={size}
      color={color ?? palette.chevron}
      style={[styles.chevron, style]}
    />
  );
};

const hasIcon = (children: React.ReactNode): boolean =>
  React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.type === ListItemIcon,
  );

const ListItem: React.FC<IListItem> = ({
  children,
  onPress,
  disabled = false,
  destructive = false,
  style,
}): React.JSX.Element => {
  const { palette } = useList("List.Item");
  const { isLast } = useListRow();
  const active = useSharedValue(0);

  const ctx = useMemo<IListItemContextValue>(
    () => ({ destructive, disabled }),
    [destructive, disabled],
  );

  const highlightStyle = useAnimatedStyle(() => ({
    opacity: active.value,
  }));

  const setActive = (v: number) => {
    active.value = withTiming(v, { duration: v ? 80 : 160 });
  };

  const rowStyle = [styles.row, disabled && styles.disabled, style];

  const row = onPress ? (
    <AnimatedPressable
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => setActive(1)}
      onPressOut={() => setActive(0)}
      style={rowStyle}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.highlight,
          { backgroundColor: palette.highlight },
          highlightStyle,
        ]}
      />
      {children}
    </AnimatedPressable>
  ) : (
    <View style={rowStyle}>{children}</View>
  );

  return (
    <ListItemContext.Provider value={ctx}>
      {row}
      {isLast ? null : (
        <View
          style={[
            styles.separator,
            {
              backgroundColor: palette.separator,
              marginLeft: hasIcon(children)
                ? LIST_SEPARATOR_INSET_ICON
                : LIST_SEPARATOR_INSET,
            },
          ]}
        />
      )}
    </ListItemContext.Provider>
  );
};

const styles = StyleSheet.create({
  root: {
    gap: LIST_SECTION_GAP,
  },
  section: {
    gap: 6,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    paddingLeft: LIST_ROW_PADDING_X,
  },
  sectionFooter: {
    fontSize: 13,
    lineHeight: 17,
    paddingLeft: LIST_ROW_PADDING_X,
  },
  card: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
      },
      android: { elevation: 4 },
    }),
  },
  row: {
    minHeight: LIST_ROW_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: LIST_ROW_PADDING_X,
    gap: LIST_ICON_GAP,
  },
  highlight: {
    ...StyleSheet.absoluteFillObject,
  },
  disabled: {
    opacity: 0.4,
  },
  icon: {
    width: LIST_ICON_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 8,
    gap: 1,
  },
  title: {
    fontSize: 17,
  },
  titleFill: {
    flex: 1,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 17,
  },
  value: {
    fontSize: 17,
    textAlign: "right",
    marginLeft: "auto",
  },
  chevron: {
    marginLeft: 2,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
  },
});

const Section = createCompoundComponent("List.Section", ListSection, {
  Title: ListSectionTitle,
  Content: ListSectionContent,
  Footer: ListSectionFooter,
});

const Item = createCompoundComponent("List.Item", ListItem, {
  Icon: ListItemIcon,
  Content: ListItemContent,
  Title: ListItemTitle,
  Subtitle: ListItemSubtitle,
  Value: ListItemValue,
  Chevron: ListItemChevron,
});

const List = createCompoundComponent("List", ListRoot, {
  Root: ListRoot,
  Section,
  Item,
  Separator: ListSeparator,
  Icon: ListItemIcon,
  Content: ListItemContent,
  Title: ListItemTitle,
  Subtitle: ListItemSubtitle,
  Value: ListItemValue,
  Chevron: ListItemChevron,
});

export {
  List,
  ListRoot,
  ListSection,
  ListSectionTitle,
  ListSectionContent,
  ListSectionFooter,
  ListItem,
  ListItemIcon,
  ListItemContent,
  ListItemTitle,
  ListItemSubtitle,
  ListItemValue,
  ListItemChevron,
  ListSeparator,
};
export default List;
export type {
  IListRoot,
  IListSection,
  IListSectionTitle,
  IListSectionContent,
  IListSectionFooter,
  IListItem,
  IListItemIcon,
  IListItemContent,
  IListItemTitle,
  IListItemSubtitle,
  IListItemValue,
  IListItemChevron,
  IListSeparator,
  TListTheme,
} from "./types";
