import { View, Text, ScrollView, SafeAreaView } from "react-native";
import React, { useState } from "react";
import { SegmentedControl } from "@/components";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SegmentedControlDemo: React.FC = (): React.ReactNode => {
  const [selectedValue, setSelectedValue] = useState("analytics");

  return (
    <ScrollView
      className="flex-1 bg-zinc-950"
      contentContainerStyle={{ flexGrow: 1 }}
      contentInsetAdjustmentBehavior="always"
      scrollEnabled
    >
      <SafeAreaView className="flex-1 px-6 py-12">
        <View className="mb-12 mt-12 ml-5">
          <Text className="text-3xl font-bold text-white mb-2">Dashboard</Text>
          <Text className="text-zinc-400 text-base">
            Monitor your application performance and analytics
          </Text>
        </View>

        <View className="mb-8 ml-5">
          <SegmentedControl.Root
            value={selectedValue}
            onValueChange={setSelectedValue}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-1 shadow-2xl"
          >
            <SegmentedControl.Item
              value="analytics"
              className={`flex-1 py-3 px-4 rounded-md transition-all duration-200 ${
                selectedValue === "analytics"
                  ? "bg-zinc-700 shadow-lg"
                  : "bg-transparent"
              }`}
            >
              <View className="flex-row items-center justify-center space-x-2">
                <MaterialCommunityIcons
                  name="chart-line"
                  size={20}
                  color={selectedValue === "analytics" ? "#ffffff" : "#a1a1aa"}
                  className="mr-2"
                />
                <Text
                  className={`text-center font-medium transition-colors duration-200 ${
                    selectedValue === "analytics"
                      ? "text-white"
                      : "text-zinc-400"
                  }`}
                >
                  Analytics
                </Text>
              </View>
            </SegmentedControl.Item>

            <SegmentedControl.Item
              value="reports"
              className={`flex-1 py-3 px-4 rounded-md transition-all duration-200 ${
                selectedValue === "reports"
                  ? "bg-zinc-700 shadow-lg"
                  : "bg-transparent"
              }`}
            >
              <View className="flex-row items-center justify-center space-x-2">
                <MaterialCommunityIcons
                  name="file-document"
                  size={20}
                  color={selectedValue === "reports" ? "#ffffff" : "#a1a1aa"}
                  className="mr-2"
                />
                <Text
                  className={`text-center font-medium transition-colors duration-200 ${
                    selectedValue === "reports" ? "text-white" : "text-zinc-400"
                  }`}
                >
                  Reports
                </Text>
              </View>
            </SegmentedControl.Item>

            <SegmentedControl.Item
              value="insights"
              className={`flex-1 py-3 px-4 rounded-md transition-all duration-200 ${
                selectedValue === "insights"
                  ? "bg-zinc-700 shadow-lg"
                  : "bg-transparent"
              }`}
            >
              <View className="flex-row items-center justify-center space-x-2">
                <MaterialCommunityIcons
                  name="lightbulb"
                  size={20}
                  color={selectedValue === "insights" ? "#ffffff" : "#a1a1aa"}
                  className="mr-2"
                />
                <Text
                  className={`text-center font-medium transition-colors duration-200 ${
                    selectedValue === "insights"
                      ? "text-white"
                      : "text-zinc-400"
                  }`}
                >
                  Insights
                </Text>
              </View>
            </SegmentedControl.Item>
          </SegmentedControl.Root>
        </View>

        <View className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
          <View className="mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-xl font-semibold text-white capitalize">
                {selectedValue}
              </Text>
              <View className="bg-emerald-500/20 px-3 py-1 rounded-full">
                <Text className="text-emerald-400 text-xs font-medium">
                  Live
                </Text>
              </View>
            </View>
            <Text className="text-zinc-400 leading-5">
              {selectedValue === "analytics" &&
                "Real-time performance metrics and user engagement data"}
              {selectedValue === "reports" &&
                "Comprehensive reports and detailed breakdowns"}
              {selectedValue === "insights" &&
                "AI-powered insights and recommendations"}
            </Text>
          </View>

          <View className="space-y-4">
            <View className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-white font-medium">
                  {selectedValue === "analytics" && "Active Users"}
                  {selectedValue === "reports" && "Monthly Report"}
                  {selectedValue === "insights" && "Key Insight"}
                </Text>
                <Text className="text-zinc-400 text-sm">
                  {selectedValue === "analytics" && "Last 24h"}
                  {selectedValue === "reports" && "December 2024"}
                  {selectedValue === "insights" && "Q1 2025"}
                </Text>
              </View>
              <Text className="text-2xl font-bold text-white mb-1">
                {selectedValue === "analytics" && "1,247"}
                {selectedValue === "reports" && "89%"}
                {selectedValue === "insights" && "+23%"}
              </Text>
              <Text className="text-zinc-400 text-sm">
                {selectedValue === "analytics" && "+12% from yesterday"}
                {selectedValue === "reports" && "Performance increase"}
                {selectedValue === "insights" && "Conversion improvement"}
              </Text>
            </View>

            <View className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 mt-5">
              <View className="flex-row items-center justify-between">
                <Text className="text-white font-medium">
                  {selectedValue === "analytics" && "Bounce Rate"}
                  {selectedValue === "reports" && "Export Data"}
                  {selectedValue === "insights" && "Next Action"}
                </Text>
                <View
                  className={`px-2 py-1 rounded text-xs ${
                    selectedValue === "analytics"
                      ? "bg-red-500/20 text-red-400"
                      : selectedValue === "reports"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      selectedValue === "analytics"
                        ? "text-red-400"
                        : selectedValue === "reports"
                          ? "text-blue-400"
                          : "text-yellow-400"
                    }`}
                  >
                    {selectedValue === "analytics" && "High"}
                    {selectedValue === "reports" && "Ready"}
                    {selectedValue === "insights" && "Pending"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View className="mt-8 pt-6 border-t border-zinc-800">
          <Text className="text-zinc-500 text-center text-sm">
            Data updates every 5 minutes
          </Text>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default SegmentedControlDemo;
