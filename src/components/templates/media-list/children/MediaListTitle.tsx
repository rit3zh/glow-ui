import { View, Text, StyleSheet, Dimensions } from "react-native";
import React from "react";
import type { MediaListTitleProps } from "../MediaList.types";

const WIDTH = Dimensions.get("window").width;

export const MediaListTitle: React.FC<MediaListTitleProps> = ({
  children,
}: MediaListTitleProps): React.ReactNode & React.JSX.Element => {
  return (
    <View style={{}}>
      <Text className="text-white text-2xl font-bold">{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  contentContainer: {},
});
