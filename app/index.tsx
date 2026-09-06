import { Fragment, useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import { Stack, useRouter } from "expo-router";
import type { IComponentLink } from "../hooks/use-components/interface";
import { useComponents } from "../hooks/use-components";
import { useFonts } from "expo-font";

interface Section {
  title: string;
  data: IComponentLink[];
}

export default function App() {
  const { components } = useComponents();
  const [query, setQuery] = useState("");

  const sections = useMemo<Section[]>(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? components.filter(
          (c) =>
            c.title.toLowerCase().includes(q) ||
            c.category.toLowerCase().includes(q),
        )
      : components;

    const groups = new Map<string, IComponentLink[]>();
    for (const c of list) {
      const bucket = groups.get(c.category) ?? [];
      bucket.push(c);
      groups.set(c.category, bucket);
    }

    return [...groups.entries()]
      .map(([title, data]) => ({
        title,
        data: [...data].sort((a, b) => a.title.localeCompare(b.title)),
      }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [components, query]);

  return (
    <Fragment>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Components",
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: true,
          headerTransparent: true,

          headerSearchBarOptions: {
            onChangeText: (event) => setQuery(event.nativeEvent.text),
            textColor: LABEL,
            hintTextColor: SECONDARY,
            headerIconColor: SECONDARY,
          },
        }}
      />
      <StatusBar style="light" />
      <SectionList
        sections={sections}
        contentInsetAdjustmentBehavior="automatic"
        keyExtractor={(item) => item.href}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        renderItem={({ item, index, section }) => (
          <Row
            item={item}
            first={index === 0}
            last={index === section.data.length - 1}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No components found</Text>
            <Text style={styles.emptySubtitle}>Try a different search</Text>
          </View>
        }
      />
    </Fragment>
  );
}

function Row({
  item,
  first,
  last,
}: {
  item: IComponentLink;
  first: boolean;
  last: boolean;
}) {
  const router = useRouter();
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    SfProRoundedBold: require("~/assets/fonts/SF-Pro-Rounded-Bold.otf"),
    SfProRoundedMedium: require("~/assets/fonts/SF-Pro-Rounded-Medium.otf"),
  });

  const handlePress = () => {
    if (Platform.OS === "ios") Haptics.selectionAsync();
    router.push(item.href as never);
  };

  return (
    <Fragment>
      <Pressable onPress={handlePress} style={styles.row}>
        <Text
          style={[
            styles.rowTitle,
            {
              fontFamily: fontLoaded ? "SfProRounded" : undefined,
            },
          ]}
          numberOfLines={1}
        >
          {item.title}
        </Text>

        {!last ? <View style={styles.separator} /> : null}
      </Pressable>
    </Fragment>
  );
}

// iOS system colors (dark mode)
const CARD = "#1c1c1e";
const CARD_PRESSED = "#2c2c2e";
const SEPARATOR = "#38383a";
const LABEL = "#ffffff";
const SECONDARY = "#8e8e93";
const TERTIARY = "#6c6c70";
const INSET = 12;

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: INSET,
    paddingBottom: 40,
  },
  sectionHeader: {
    color: SECONDARY,
    fontSize: 13,
    letterSpacing: -0.08,
    textTransform: "uppercase",
    marginLeft: INSET,
    marginTop: 24,
    marginBottom: 7,
  },
  row: {
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: INSET,
    // backgroundColor: CARD,
  },
  rowFirst: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  rowLast: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  rowPressed: {
    backgroundColor: CARD_PRESSED,
  },
  rowTitle: {
    color: LABEL,
    fontSize: 17,
    letterSpacing: -0.21,
  },
  separator: {
    position: "absolute",
    left: INSET,
    right: 0,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: SEPARATOR,
  },
  empty: {
    paddingTop: 100,
    alignItems: "center",
    gap: 4,
  },
  emptyTitle: {
    color: LABEL,
    fontSize: 16,
    fontWeight: "600",
  },
  emptySubtitle: {
    color: TERTIARY,
    fontSize: 14,
  },
});
