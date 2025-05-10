import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const timelineData = [
  { id: "1", title: "Timeline Title 1", description: "Description 1" },
  { id: "2", title: "Timeline Title 2", description: "Description 2" },
  { id: "3", title: "Timeline Title 3", description: "Description 3" },
  { id: "4", title: "Timeline Title 4", description: "Description 4" },
];

const TimelineItem = ({ item, isFirst, isLast }: any) => (
  <View style={styles.itemRow}>
    {/* Line & Dot */}
    <View style={styles.lineColumn}>
      {/* Top vertical line */}
      {!isFirst && <View style={styles.verticalLine} />}

      {/* Dot */}
      <View style={styles.circle} />

      {/* Bottom vertical line */}
      {!isLast && <View style={styles.verticalLine} />}
    </View>

    {/* Horizontal Connector */}
    {/* <View style={styles.horizontalLine} /> */}

    {/* Card */}
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  </View>
);

export function Timeline() {
  return (
    <FlatList
      data={timelineData}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <TimelineItem
          item={item}
          isFirst={index === 0}
          isLast={index === timelineData.length - 1}
        />
      )}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 30,
  },
  lineColumn: {
    width: 30,
    alignItems: "center",
  },
  verticalLine: {
    width: 0.5,
    flex: 1,
    backgroundColor: "#007aff",
  },
  circle: {
    width: 12,

    backgroundColor: "#007aff",
    zIndex: 5,
  },
  horizontalLine: {
    width: 20,
    height: 2,
    backgroundColor: "#007aff",
    marginTop: 5,
    marginRight: 10,
  },
  card: {
    backgroundColor: "#f0f4ff",
    borderRadius: 8,
    padding: 12,
    flex: 0,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
});
