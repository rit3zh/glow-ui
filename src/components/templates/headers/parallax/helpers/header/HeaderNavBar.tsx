import { View, StyleSheet, Dimensions, SafeAreaView } from "react-native";
import React, { isValidElement } from "react";
import type { HeaderNavBarProps } from "../../types";
import { BlurView } from "expo-blur";

const WIDTH = Dimensions.get("window").width;

export const HeaderNavBar: React.FC<HeaderNavBarProps> = ({
  children,
  headerHeight = 100,
  intensity = 50,
  tint = "systemUltraThinMaterialDark",
  // @ts-ignore
  ...props
}) => {
  const childrenArray = React.Children.toArray(children).filter((child) =>
    isValidElement(child)
  );
  const childCount = childrenArray.length;

  const renderChildren = () => {
    if (childCount === 0) {
      return null;
    }

    if (childCount === 1) {
      return <View style={styles.centerContainer}>{childrenArray[0]}</View>;
    }

    if (childCount === 2) {
      return (
        <>
          <View style={styles.leftContainer}>{childrenArray[0]}</View>
          <View style={styles.rightContainer}>{childrenArray[1]}</View>
        </>
      );
    }

    if (childCount === 3) {
      return (
        <>
          <View style={styles.leftContainer}>{childrenArray[0]}</View>
          <View style={styles.centerContainer}>{childrenArray[1]}</View>
          <View style={styles.rightContainer}>{childrenArray[2]}</View>
        </>
      );
    }

    const leftItem = childrenArray[0];
    const rightItem = childrenArray[childCount - 1];
    const centerItems = childrenArray.slice(1, childCount - 1);

    return (
      <>
        <View style={styles.leftContainer}>{leftItem}</View>
        <View style={styles.centerContainer}>{centerItems}</View>
        <View style={styles.rightContainer}>{rightItem}</View>
      </>
    );
  };

  return (
    <BlurView
      style={[
        styles.container,
        {
          height: headerHeight,
          backgroundColor: "transparent",
        },
      ]}
      intensity={intensity}
      tint={tint}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>{renderChildren()}</View>
      </SafeAreaView>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 100,
  },
  safeArea: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  leftContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  centerContainer: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  rightContainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
});
