import React, { Fragment } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import AirbnbV1 from "@/components/blocks/bottom-sheet/airbnb-v1";
import { Showcase } from "~/showcase";
import { StatusBar } from "expo-status-bar";

export default function AirbnbV1Screen() {
  return (
    <Fragment>
      <StatusBar hidden />
      <AirbnbV1
        onActionPress={() => console.log("browse hotels")}
        onClose={() => console.log("sheet closed")}
      />
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    marginHorizontal: 20,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  searchTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222222",
  },
  searchSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: "#767676",
  },
  filters: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#dddddd",
    backgroundColor: "#ffffff",
    justifyContent: "center",
  },
  filterLabel: {
    fontSize: 13,
    color: "#222222",
  },
  pins: {
    flex: 1,
    marginTop: 60,
  },
  pin: {
    position: "absolute",
    paddingHorizontal: 12,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  pinLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#222222",
  },
});
