import "./global.css";
import { ActionCard, Touchable, TouchableRipple } from "@/components/base";
import { SymbolView } from "expo-symbols";
import { act, Fragment } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { BottomSheet } from "@/components/molecules/BottomSheet";
import { walletActions } from "@/components/molecules/BottomSheet/constants";
import * as List from "@/components/molecules/List";
import { Center, Row } from "@/components/atoms";
4;
export function App<T>(
  props: T & {
    children?: React.ReactNode;
  }
) {
  const BACKGROUND_COLOR: string = `#1a1a1a`;
  const INDICATOR_COLOR: string = `#9e9e9e`;
  return <></>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
