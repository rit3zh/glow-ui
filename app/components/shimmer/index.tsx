import { View, Text, ScrollView, SafeAreaView, Dimensions } from "react-native";
import React, { useState } from "react";
import { ShimmerEffect } from "@/components";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const ShimmerDemo: React.FC = (_$_): React.ReactNode => {
  const [isLoading] = useState<boolean>(true);
  const shimmerConfig: any = {
    duration: 800,
    shimmerColors: [
      "rgba(0, 0, 0, 0.5)",
      "rgba(255, 255, 255, 0.2)",
      "rgba(0, 0, 0, 0.5)",
    ],
    variant: "shimmer",
    direction: "leftToRight",
  };

  const ProfileCard: React.FC = (_$_) => (
    <View className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-6">
      <Text className="text-zinc-400 text-sm font-medium mb-4 tracking-wide">
        PROFILE CARD
      </Text>
      <View className="flex-row items-center">
        <ShimmerEffect
          isLoading={isLoading}
          {...shimmerConfig}
          className="w-16 h-16 bg-zinc-800 rounded-full"
        />

        <View className="flex-1 ml-4">
          <ShimmerEffect
            isLoading={isLoading}
            {...shimmerConfig}
            className="h-5 bg-zinc-800 rounded mb-2 w-full"
          />
          <ShimmerEffect
            isLoading={isLoading}
            {...shimmerConfig}
            className="h-4 bg-zinc-800 rounded w-3/4"
          />
        </View>
      </View>
    </View>
  );

  const StatsCard: React.FC = (_$_) => (
    <View className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-6">
      <Text className="text-zinc-400 text-sm font-medium mb-4 tracking-wide">
        STATISTICS
      </Text>
      <View className="flex-row justify-between">
        {[1, 2, 3].map((item, index) => (
          <View key={index} className="items-center flex-1">
            <ShimmerEffect
              isLoading={isLoading}
              {...shimmerConfig}
              className="w-12 h-12 bg-zinc-800 rounded-lg mb-3"
            />
            <ShimmerEffect
              isLoading={isLoading}
              {...shimmerConfig}
              className="h-6 bg-zinc-800 rounded mb-1 w-10"
            />
            <ShimmerEffect
              isLoading={isLoading}
              {...shimmerConfig}
              className="h-4 bg-zinc-800 rounded w-12"
            />
          </View>
        ))}
      </View>
    </View>
  );

  const ListItems: React.FC = () => (
    <View className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-6">
      <Text className="text-zinc-400 text-sm font-medium mb-4 tracking-wide">
        RECENT ACTIVITY
      </Text>
      {[1, 2, 3, 4].map((item, index) => (
        <View
          key={index}
          className={`flex-row items-center py-3 ${index < 3 ? "border-b border-zinc-800" : ""}`}
        >
          <ShimmerEffect
            isLoading={isLoading}
            {...shimmerConfig}
            className="w-10 h-10 bg-zinc-800 rounded-full mr-4"
          />
          <View className="flex-1">
            <ShimmerEffect
              isLoading={isLoading}
              {...shimmerConfig}
              className="h-4 bg-zinc-800 rounded mb-2 w-4/5"
            />
            <ShimmerEffect
              isLoading={isLoading}
              {...shimmerConfig}
              className="h-3 bg-zinc-800 rounded w-2/5"
            />
          </View>
          <ShimmerEffect
            isLoading={isLoading}
            {...shimmerConfig}
            className="w-6 h-6 bg-zinc-800 rounded"
          />
        </View>
      ))}
    </View>
  );

  const ImageGallery = () => (
    <View className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-6">
      <Text className="text-zinc-400 text-sm font-medium mb-4 tracking-wide">
        GALLERY
      </Text>
      <View className="flex-row flex-wrap justify-between">
        {[1, 2, 3, 4, 5, 6].map((item, index) => (
          <ShimmerEffect
            key={index}
            isLoading={isLoading}
            {...shimmerConfig}
            className="bg-zinc-800 rounded-lg mb-3"
            style={{ width: (width - 80) / 3, height: (width - 80) / 3 }}
          />
        ))}
      </View>
    </View>
  );

  const ActionButtons = () => (
    <View className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-6">
      <Text className="text-zinc-400 text-sm font-medium mb-4 tracking-wide">
        ACTIONS
      </Text>
      <View className="flex-row justify-between">
        {[1, 2, 3].map((action, index) => (
          <View key={index} className="flex-1 mx-1">
            <ShimmerEffect
              isLoading={isLoading}
              {...shimmerConfig}
              className="bg-zinc-800 rounded-lg p-4 h-20"
            />
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView
      className="flex-1 bg-black"
      showsVerticalScrollIndicator={false}
      scrollEnabled={true}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <SafeAreaView className="flex-1">
        <View className="px-6 pt-8 pb-6 border-b border-zinc-800">
          <View className="flex-row items-center flex-1 gap-3 border-b mb-3">
            <MaterialCommunityIcons name="shimmer" size={30} color="white" />
            <Text className="text-3xl font-bold text-zinc-100 mb-2">
              Shimmer
            </Text>
          </View>
          <Text className="text-zinc-400 mb-4">
            Beautiful loading states with dark theme
          </Text>
          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded-full mr-2 bg-blue-500" />
            <Text className="text-zinc-400 text-sm">Loading state active</Text>
          </View>
        </View>

        <View className="px-6 pt-6">
          <ProfileCard />
          <StatsCard />
          <ListItems />
          <ImageGallery />
          <ActionButtons />

          <View className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 items-center">
            <Feather name="zap" size={24} color="#71717a" />
            <Text className="text-zinc-400 text-center mt-2">
              Fast shimmer effects with 500ms duration
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default ShimmerDemo;
