import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import type {
  CardActionProps,
  CardFooterProps,
  CardImageProps,
  CardProps,
  CardStatusProps,
  CardTitleProps,
  CardUserInfoProps,
} from "./types";

const CardTitle: React.FC<CardTitleProps> = ({ children, style }) => {
  return <Text style={[styles.cardTitle, style]}>{children}</Text>;
};

const CardStatus: React.FC<CardStatusProps> = ({ children, icon, style }) => {
  return (
    <View style={[styles.cardStatus, style]}>
      {icon}
      <Text style={styles.statusText}>{children}</Text>
    </View>
  );
};

const CardImage: React.FC<CardImageProps> = ({
  source,
  children,
  style,
  imageStyle,
}) => {
  return (
    <View style={[styles.cardImage, style]}>
      <Image source={source} style={[styles.image, imageStyle]} />
      {children}
    </View>
  );
};

const CardUserInfo: React.FC<CardUserInfoProps> = ({
  avatar,
  username,
  timestamp,
  style,
}) => {
  return (
    <View style={[styles.userInfo, style]}>
      <Image source={avatar} style={styles.avatar} />
      <View>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>
    </View>
  );
};

const CardAction: React.FC<CardActionProps> = ({
  onPress,
  children,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity style={[styles.cardAction, style]} onPress={onPress}>
      <Text style={[styles.actionText, textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
};

const CardFooter: React.FC<CardFooterProps> = ({ children, style }) => {
  return <View style={[styles.cardFooter, style]}>{children}</View>;
};

const Card: React.FC<CardProps> = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  cardTitle: {
    fontSize: 40,
    fontWeight: "500",
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
  cardStatus: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  statusText: {
    color: "#fff",
    fontSize: 16,
  },
  cardImage: {
    width: "100%",
    height: 400,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    bottom: 16,
    padding: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    position: "absolute",
    bottom: 16,
    padding: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  timestamp: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
  },
  cardAction: {
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

// Export with types
export {
  Card,
  CardTitle,
  CardStatus,
  CardImage,
  CardUserInfo,
  CardAction,
  CardFooter,
};

export type {
  CardProps,
  CardTitleProps,
  CardStatusProps,
  CardImageProps,
  CardUserInfoProps,
  CardActionProps,
  CardFooterProps,
};
