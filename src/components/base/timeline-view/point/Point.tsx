import * as React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import styles from "./styles";

interface PointProps {
  innerContainer?: StyleProp<ViewStyle>;
  outerContainer?: StyleProp<ViewStyle>;
}

const Point: React.FC<PointProps> = ({ innerContainer, outerContainer }) => {
  return (
    <View style={[styles.innerContainer, styles.shadowStyle, innerContainer]}>
      <View style={[styles.outerContainer, outerContainer]} />
    </View>
  );
};

export default Point;
