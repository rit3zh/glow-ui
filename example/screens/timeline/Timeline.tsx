import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { Timeline } from "@/components/molecules/index";
import type { TimelineItem } from "@/components/molecules/Timeline/TimelineView.types";

const ShippedComponent = () => {
  return (
    <View style={styles.shippingDetails}>
      <Text style={styles.shippingTitle}>Shipping Details</Text>
      <View style={styles.shippingInfo}>
        <Text style={styles.shippingLabel}>Carrier:</Text>
        <Text style={styles.shippingValue}>FedEx</Text>
      </View>
      <View style={styles.shippingInfo}>
        <Text style={styles.shippingLabel}>Tracking Number:</Text>
        <Text style={styles.shippingValue}>1234567890</Text>
      </View>
    </View>
  );
};

export const App = () => {
  const timelineItems: TimelineItem[] = [
    {
      id: 1,
      title: "Order Placed",
      description: "Your order has been received and is being processed.",
      timestamp: "May 7, 10:23 AM",
      icon: "shopping-bag",
      status: "complete",
      meta: "Order #38492",
    },
    {
      id: 2,
      title: "Order Confirmed",
      description:
        "Your order has been confirmed and is being prepared for shipping.",
      timestamp: "May 7, 11:05 AM",
      icon: "check-circle",
      status: "complete",
      meta: "Processing time: 42 minutes",
    },
    {
      id: 3,
      title: "Shipped",
      description: "Your package is on its way to you.",
      timestamp: "May 8, 9:15 AM",
      icon: "package",
      status: "complete",
      children: <ShippedComponent />,
      meta: "Tracking #TRK293847",
    },
    {
      id: 4,
      title: "Out for Delivery",
      description: "Your package is out for delivery and will arrive today.",
      timestamp: "May 10, 8:30 AM",
      icon: "truck",
      status: "complete",
    },
    {
      id: 5,
      title: "Delivered",

      timestamp: "Estimated May 10, by 6:00 PM",
      icon: "home",
      status: "current",
      meta: "Delivered to your doorstep",
      description: "Your package has been delivered successfully.",
    },
  ];
  const handleItemPress = (item: TimelineItem) => {
    console.log("Item pressed:", item.title);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Order Timeline</Text>
          <Text style={styles.headerSubtitle}>Track your order progress</Text>
        </View>

        <Timeline
          animationType="rotate"
          items={timelineItems}
          onItemPress={handleItemPress}
          activeColor="#6366f1"
          animated={true}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
  },
  shippingDetails: {
    padding: 4,
  },
  shippingTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },
  shippingInfo: {
    flexDirection: "row",
    marginBottom: 4,
  },
  shippingLabel: {
    width: 100,
    fontSize: 13,
    color: "#64748b",
  },
  shippingValue: {
    fontSize: 13,
    color: "#334155",
    fontWeight: "500",
  },
});
