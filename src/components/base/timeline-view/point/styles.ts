import { ViewStyle, StyleSheet } from "react-native";

interface Style {
  innerContainer: ViewStyle;
  shadowStyle: ViewStyle;
  outerContainer: ViewStyle;
}

export default StyleSheet.create<Style>({
  innerContainer: {
    top: 0,
    left: -4,
    width: 10,
    height: 10,
    backgroundColor: "#984cf8",
    borderRadius: 30,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  shadowStyle: {
    shadowColor: "#984cf8",
    shadowRadius: 8,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  outerContainer: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 16,
    borderColor: "rgba(152, 76, 248, 0.1)",
    backgroundColor: "rgba(152, 76, 248, 0.05)",
  },
});
