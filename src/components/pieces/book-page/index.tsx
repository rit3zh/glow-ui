import React, { useId, useMemo } from "react";
import { Image, StyleSheet, Text, View, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Defs, Pattern, Rect } from "react-native-svg";

import {
  ASPECT_RATIO,
  BOOK_WIDTH,
  COVER_RADIUS,
  DEFAULT_PALETTE,
  MONO_FONT,
  PAGE_BLEED,
  PAGE_GAP,
  PAGE_INSET,
  PAGE_LINE,
  SERIF_FONT,
  SPINE_INSET,
  SPINE_RADIUS,
  SPINE_WIDTH,
} from "./const";
import { BookPageContext, useBookPage } from "./context";
import type {
  IBookPageContext,
  IBookPageCover,
  IBookPagePages,
  IBookPageRoot,
  IBookPageSlot,
  IBookPageText,
} from "./types";

import { createCompoundComponent } from "@/utils/create-compound-component";

const BookPageRoot: React.FC<IBookPageRoot> = ({
  children,
  palette,
  width = BOOK_WIDTH,
  aspectRatio = ASPECT_RATIO,
  openAngle = 0,
  perspective = 1000,
  style,
}: IBookPageRoot): React.JSX.Element => {
  const context = useMemo<IBookPageContext>(
    () => ({
      palette: { ...DEFAULT_PALETTE, ...palette },
      serifFont: SERIF_FONT,
      monoFont: MONO_FONT,
      width,
      openAngle,
    }),
    [palette, width, openAngle],
  );

  return (
    <BookPageContext.Provider value={context}>
      <View
        style={[
          styles.root,
          { width, aspectRatio },
          openAngle !== 0 && { transform: [{ perspective }] },
          style,
        ]}
      >
        {children}
      </View>
    </BookPageContext.Provider>
  );
};

const BookPagePages: React.FC<IBookPagePages> = ({
  bleed = PAGE_BLEED,
  inset = PAGE_INSET,
  spineInset = SPINE_INSET,
  style,
}: IBookPagePages): React.JSX.Element => {
  const { palette } = useBookPage("BookPage.Pages");

  const patternId = `book-pages-${useId()}`;

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.pages,
        { right: -bleed, top: inset, bottom: inset, left: spineInset },
        style,
      ]}
    >
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern
            id={patternId}
            width={PAGE_LINE + PAGE_GAP}
            height={PAGE_LINE + PAGE_GAP}
            patternUnits="userSpaceOnUse"
          >
            <Rect
              width={PAGE_LINE + PAGE_GAP}
              height={PAGE_LINE}
              fill={palette.page}
            />
            <Rect
              y={PAGE_LINE}
              width={PAGE_LINE + PAGE_GAP}
              height={PAGE_GAP}
              fill={palette.pageEdge}
            />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </Svg>
    </View>
  );
};

const BookPageCover: React.FC<IBookPageCover> = ({
  children,
  source,
  alt,
  scrim = true,
  spineWidth = SPINE_WIDTH,
  radius = COVER_RADIUS,
  style,
}: IBookPageCover): React.JSX.Element => {
  const { palette, width, openAngle } = useBookPage("BookPage.Cover");

  const hinge: ViewStyle["transform"] =
    openAngle === 0
      ? undefined
      : [
          { translateX: -width / 2 },
          { rotateY: `${-openAngle}deg` },
          { translateX: width / 2 },
        ];

  return (
    <View
      style={[
        styles.cover,
        {
          backgroundColor: palette.cover,
          borderTopLeftRadius: SPINE_RADIUS,
          borderBottomLeftRadius: SPINE_RADIUS,
          borderTopRightRadius: radius,
          borderBottomRightRadius: radius,
        },
        hinge && { transform: hinge },
        style,
      ]}
    >
      {source && (
        <React.Fragment>
          <Image
            source={source}
            accessible={Boolean(alt)}
            accessibilityLabel={alt}
            resizeMode="cover"
            style={StyleSheet.absoluteFill}
          />
          {scrim && (
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.1)", "rgba(0,0,0,0.7)"]}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
          )}
        </React.Fragment>
      )}

      {spineWidth > 0 && (
        <LinearGradient
          colors={[palette.spine, "transparent"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          pointerEvents="none"
          style={[styles.spine, { width: spineWidth }]}
        />
      )}

      {children}
    </View>
  );
};

const BookPageAuthor: React.FC<IBookPageText> = ({
  children,
  numberOfLines = 1,
  style,
}: IBookPageText): React.JSX.Element => {
  const { palette, monoFont } = useBookPage("BookPage.Author");

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        styles.author,
        { color: palette.coverText, fontFamily: monoFont },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

const BookPageFooter: React.FC<IBookPageSlot> = ({
  children,
  style,
}: IBookPageSlot): React.JSX.Element => (
  <View style={[styles.footer, style]}>{children}</View>
);

const BookPageTitle: React.FC<IBookPageText> = ({
  children,
  numberOfLines,
  style,
}: IBookPageText): React.JSX.Element => {
  const { palette, serifFont } = useBookPage("BookPage.Title");

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        styles.title,
        { color: palette.coverText, fontFamily: serifFont },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

const BookPageNote: React.FC<IBookPageText> = ({
  children,
  numberOfLines = 1,
  style,
}: IBookPageText): React.JSX.Element => {
  const { palette, monoFont } = useBookPage("BookPage.Note");

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        styles.note,
        {
          color: palette.coverText,
          fontFamily: monoFont,
          borderTopColor: palette.rule,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  root: {
    position: "relative",
  },
  pages: {
    position: "absolute",
    overflow: "hidden",
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 1, height: 1 },
    elevation: 1,
  },
  cover: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    overflow: "hidden",
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 2, height: 6 },
    elevation: 8,
  },
  spine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
  },
  author: {
    fontSize: 12,
    letterSpacing: 2,
    textTransform: "uppercase",
    opacity: 0.7,
  },
  footer: {
    gap: 12,
  },
  title: {
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.4,
  },
  note: {
    paddingTop: 8,
    borderTopWidth: 1,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: "uppercase",
    opacity: 0.6,
  },
});

const Root = createCompoundComponent("BookPage.Root", BookPageRoot);
const Pages = createCompoundComponent("BookPage.Pages", BookPagePages);
const Cover = createCompoundComponent("BookPage.Cover", BookPageCover);
const Author = createCompoundComponent("BookPage.Author", BookPageAuthor);
const Footer = createCompoundComponent("BookPage.Footer", BookPageFooter);
const Title = createCompoundComponent("BookPage.Title", BookPageTitle);
const Note = createCompoundComponent("BookPage.Note", BookPageNote);

const BookPage = createCompoundComponent("BookPage", BookPageRoot, {
  Root,
  Pages,
  Cover,
  Author,
  Footer,
  Title,
  Note,
});

export {
  BookPage,
  Root,
  Pages,
  Cover,
  Author,
  Footer,
  Title,
  Note,
  useBookPage,
};
export default BookPage;
export { DEFAULT_PALETTE, PAPER_PALETTE } from "./const";
export type {
  IBookPageRoot,
  IBookPagePages,
  IBookPageCover,
  IBookPageSlot,
  IBookPageText,
  TBookPalette,
} from "./types";
