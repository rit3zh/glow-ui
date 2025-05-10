import React from "react";
import { SafeAreaView, FlatList, StyleProp, ViewStyle } from "react-native";
import Item from "../item/Item";
import { ITimeline } from "./models/models";
import type { DashProps } from "@/package/";
/**
 * ? Local Imports
 */
import styles from "./style/styles";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface TimelineProps extends DashProps {
  timelineStyle?: CustomStyleProp;
  data: ITimeline[];
}

const PackageTimeline: React.FC<TimelineProps> = ({
  data,
  timelineStyle,
  ...rest
}) => {
  const renderItem = (item: any, index: number) => {
    const isLastMember = index === data.length - 1;
    return (
      <Item
        {...rest}
        data={item}
        list={item.data}
        isLastMember={isLastMember}
      />
    );
  };

  return (
    <FlatList
      data={data}
      style={styles.listStyle}
      contentInset={styles.contentInset}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.contentContainerStyle}
      renderItem={({ item, index }) => renderItem(item, index)}
      {...rest}
    />
  );
};

export default PackageTimeline;
