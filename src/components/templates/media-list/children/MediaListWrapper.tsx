import { View, Text, StyleSheet, Dimensions } from "react-native";
import React from "react";
import type { MediaListWrapperProps } from "../MediaList.types";

const WIDTH = Dimensions.get("window").width;

export const MediaListWrapper: React.FC<MediaListWrapperProps> = ({
  children,
}: MediaListWrapperProps): React.ReactNode & React.JSX.Element => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    width: WIDTH - 200,
  },
  contentContainer: {},
});
