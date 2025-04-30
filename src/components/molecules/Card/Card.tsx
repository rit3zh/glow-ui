import { View, Text, StyleSheet, ImageBackground } from "react-native";
import React from "react";
import type { CardProps } from "./Card.types";

export const Card: React.FunctionComponent<CardProps> = ({
  children,
  className,
  style,
  image,
  useImage = false,
}: CardProps): React.ReactNode & React.JSX.Element => {
  return (
    <React.Fragment>
      <View style={[styles.container, style]} className={className}>
        {useImage ? (
          <ImageBackground
            source={{
              uri: image,
            }}
            resizeMode="cover"
            style={[
              StyleSheet.absoluteFillObject,
              {
                borderRadius: 13,
                overflow: "hidden",
              },
            ]}
          >
            {children}
          </ImageBackground>
        ) : (
          children
        )}
      </View>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 350,
    height: 450,
    backgroundColor: "#121212",
    borderRadius: 13,
  },
});
