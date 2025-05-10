import React from "react";
import {
  View,
  StyleProp,
  FlatList,
  ViewStyle,
  StyleSheet,
  Dimensions,
  Text,
} from "react-native";

import PointLine from "../point-line/Pointline";

import { ITimeline, ITimelineData } from "../timeline/models/models";

const ScreenWidth = Dimensions.get("window").width;

/**
 * ? Local Imports
 */

interface ItemProps {
  style?: StyleProp<ViewStyle>;
  data: ITimeline;
  list: ITimelineData[];
  isLastMember: boolean;
}

const Item: React.FC<ItemProps> = ({
  style,
  data,
  list,
  isLastMember,
  ...rest
}) => {
  const renderItem = (item: ITimelineData, index: number) => {
    return <Text className="text-white">{item.title}</Text>;
  };

  return (
    <View style={[styles.container, style]}>
      <PointLine
        {...rest}
        date={data.date}
        length={list.length}
        isLastMember={isLastMember}
      />
      <FlatList
        data={list}
        renderItem={({ item, index }) => renderItem(item, index)}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default Item;
const styles = StyleSheet.create({
  container: {
    width: ScreenWidth,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 0,
  },
  insideListContainer: {
    marginTop: -24,
    flexDirection: "column",
  },
});
