import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StyleProp,
  ViewStyle,
} from "react-native";
import React from "react";

export const MediaListTitleWrapper: React.FC<{
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}> = ({
  children,
  ...props
}: { children: React.ReactNode } & {
  style?: StyleProp<ViewStyle>;
}): React.ReactNode & React.JSX.Element => {
  const childrenArray = React.Children.toArray(children);

  if (childrenArray.length === 3) {
    return (
      <View style={[styles.container, props.style]}>
        <View style={styles.row}>
          <View style={styles.image}>{childrenArray[0]}</View>
          <View style={styles.column}>
            {childrenArray[1]}
            {childrenArray[2]}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, props.style]}>
      {childrenArray.map((child, index) => (
        <View key={index} style={styles.column}>
          {child}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 10,
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",

    marginBottom: 10,
  },
  column: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  image: {
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
