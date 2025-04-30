import React from "react";
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  useWindowDimensions,
} from "react-native";

interface FooterProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Footer: React.FC<FooterProps> = ({
  children,

  style,
}) => {
  const { height: windowHeight } = useWindowDimensions();

  return (
    <View
      style={[
        styles.contentContainer,
        { position: "absolute", bottom: 20, width: "100%" },
      ]}
    >
      <View
        style={[
          styles.container,
          style,
          {
            height: windowHeight * 0.1,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    width: "100%",
  },
});
