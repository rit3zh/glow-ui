import { View, Text, StyleSheet, Dimensions } from "react-native";
import React from "react";
import type { MediaListTitleProps } from "../MediaList.types";

const WIDTH = Dimensions.get("window").width;

export const MediaListSubTitle: React.FC<MediaListTitleProps> = ({
  children,
}: MediaListTitleProps): React.ReactNode & React.JSX.Element => {
  return (
    <View style={styles.container}>
      <Text
        className="text-neutral-400"
        style={{ fontSize: 10.8, textAlign: "center" }}
      >
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  contentContainer: {},
});
