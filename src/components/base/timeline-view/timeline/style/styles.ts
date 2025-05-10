import {
  ViewStyle,
  StyleSheet,
  Insets,
  Dimensions,
  Platform,
} from "react-native";

const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("screen");
const isAndroid = Platform.OS === "android";

interface Style {
  container: ViewStyle;
  listStyle: ViewStyle;
  contentContainerStyle: ViewStyle;
  contentInset: Insets;
}

export default StyleSheet.create<Style>({
  container: {
    marginLeft: 16,
    marginRight: 16,
    height: ScreenHeight,
    backgroundColor: "#fdfdfd",
  },
  listStyle: {
    paddingTop: 16,
    width: ScreenWidth,
    maxHeight: isAndroid ? ScreenHeight / 2 - 32 : ScreenHeight,
  },
  contentContainerStyle: {
    alignItems: "center",
  },
  contentInset: {
    bottom: ScreenHeight * 0.3,
  },
});
