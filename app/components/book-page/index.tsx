import { ScrollView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import { BookPage, PAPER_PALETTE } from "@/components/pieces/book-page";
import { Showcase } from "~/showcase";

const SLATE_PALETTE = {
  cover: "#243B53",
  coverText: "#F8FAFC",
  rule: "rgba(255, 255, 255, 0.24)",
};

const CLAY_PALETTE = {
  cover: "#7C2D12",
  coverText: "#FFF7ED",
  rule: "rgba(255, 255, 255, 0.24)",
};

export default function App() {
  return (
    <Showcase>
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar style="light" />

        <BookPage width={252} openAngle={26} palette={PAPER_PALETTE}>
          <BookPage.Pages />
          <BookPage.Cover>
            <BookPage.Author>Reacticx Press</BookPage.Author>
            <BookPage.Footer>
              <BookPage.Title numberOfLines={2}>
                The Reacticx Handbook
              </BookPage.Title>
              <BookPage.Note>Second edition · 2026</BookPage.Note>
            </BookPage.Footer>
          </BookPage.Cover>
        </BookPage>
      </ScrollView>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0a0a0a",
    alignItems: "center",
    justifyContent: "center",
    gap: 48,
    paddingVertical: 48,
  },
  shelf: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 28,
  },
  smallCover: {
    padding: 12,
  },
  smallAuthor: {
    fontSize: 9,
    letterSpacing: 1.5,
  },
  smallFooter: {
    gap: 8,
  },
  smallTitle: {
    fontSize: 16,
  },
  smallNote: {
    fontSize: 9,
    letterSpacing: 1.5,
  },
  caption: {
    fontSize: 11,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: "#52525B",
  },
});
