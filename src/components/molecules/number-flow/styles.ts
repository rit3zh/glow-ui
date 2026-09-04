import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  digit: {
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  numberCell: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  glyph: {
    textAlign: "center",
    fontVariant: ["tabular-nums"],
  },
});
