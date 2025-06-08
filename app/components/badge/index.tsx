import { View, Text, ScrollView, SafeAreaView } from "react-native";
import React from "react";
import { Badge } from "@/components";
import { SymbolView } from "expo-symbols";
import {
  FontAwesome5,
  FontAwesome6,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
const BadgeDemo: React.FC = (): React.ReactNode => {
  return (
    <ScrollView
      className="flex-1 bg-gray-950"
      contentContainerStyle={{
        flexGrow: 1,
        paddingVertical: 24,
      }}
      scrollEnabled={true}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="always"
    >
      <SafeAreaView className="flex-1">
        <View className="px-6 mb-12 mt-5">
          <Text className="text-white text-2xl font-semibold text-center mb-2">
            Badge Components
          </Text>
          <Text className="text-gray-400 text-center text-sm">
            Status indicators and labels
          </Text>
        </View>

        <View className="px-6 mb-10">
          <Text className="text-white text-lg font-medium mb-6">
            Status Indicators
          </Text>
          <View className="flex-row flex-wrap gap-4">
            <Badge
              label="Online"
              radius="full"
              size="md"
              variant="notifications"
              icon={
                <SymbolView
                  name="circle.fill"
                  size={12}
                  tintColor={"lightgreen"}
                />
              }
            />
            <Badge
              label="Away"
              radius="full"
              size="md"
              variant="notifications"
              icon={
                <SymbolView name="moon.fill" size={12} tintColor={"#FFFF00"} />
              }
            />
            <Badge
              label="Busy"
              radius="full"
              size="md"
              variant="notifications"
              icon={
                <SymbolView
                  name="minus.circle.fill"
                  size={12}
                  tintColor={"#DF0000"}
                />
              }
            />
            <Badge
              label="Offline"
              radius="full"
              size="md"
              variant="notifications"
              icon={
                <SymbolView name="circle.fill" size={12} tintColor={"gray"} />
              }
            />
          </View>
        </View>

        <View className="px-6 mb-10">
          <Text className="text-white text-lg font-medium mb-6">
            Notifications
          </Text>
          <View className="flex-row flex-wrap gap-4">
            <Badge
              label="New Message"
              radius="lg"
              size="md"
              variant="notifications"
              icon={<SymbolView name="message.fill" size={14} />}
            />
            <Badge
              label="5 Updates"
              radius="lg"
              size="md"
              variant="notifications"
              icon={
                <SymbolView name="bell.fill" size={14} tintColor={"#FFEE8C"} />
              }
            />
            <Badge
              label="Reminder"
              radius="lg"
              size="md"
              variant="pending"
              icon={
                <SymbolView name="clock.fill" size={14} tintColor={"#7F00FF"} />
              }
            />
          </View>
        </View>

        <View className="px-6 mb-10">
          <Text className="text-white text-lg font-medium mb-6">
            Activities
          </Text>
          <View className="flex-row flex-wrap gap-3">
            <Badge
              label="Coding"
              radius="2xl"
              size="md"
              variant="success"
              icon={
                <SymbolView
                  name="chevron.left.forwardslash.chevron.right"
                  size={14}
                  resizeMode="scaleAspectFit"
                />
              }
            />
            <Badge
              label="Meeting"
              radius="2xl"
              size="md"
              variant="warning"
              icon={
                <SymbolView
                  name="video.fill"
                  size={14}
                  resizeMode="scaleAspectFit"
                />
              }
            />
            <Badge
              label="Focus"
              radius="2xl"
              size="md"
              variant="pending"
              icon={
                <SymbolView
                  name="brain.head.profile.fill"
                  size={14}
                  resizeMode="scaleAspectFit"
                />
              }
            />
            <Badge
              label="Break"
              radius="2xl"
              size="md"
              variant="default"
              icon={
                <SymbolView
                  name="cup.and.saucer.fill"
                  size={14}
                  resizeMode="scaleAspectFit"
                />
              }
            />
          </View>
        </View>

        <View className="px-6 mb-10">
          <Text className="text-white text-lg font-medium mb-6">
            Tech Stack
          </Text>
          <View className="flex-row flex-wrap gap-2">
            <Badge
              label="React Native"
              radius="full"
              size="sm"
              variant="notifications"
              icon={<FontAwesome5 name="react" size={20} color="#61DBFB" />}
            />
            <Badge
              label="TypeScript"
              radius="full"
              size="sm"
              variant="notifications"
              icon={
                <MaterialCommunityIcons
                  name="language-typescript"
                  size={20}
                  color="#007acc"
                />
              }
            />
            <Badge
              label="Node.js"
              radius="full"
              size="sm"
              variant="success"
              icon={<FontAwesome6 name="node" size={20} color="green" />}
            />
            <Badge
              label="MongoDB"
              radius="full"
              size="sm"
              variant="success"
              icon={<Fontisto name="mongodb" size={20} color="green" />}
            />
          </View>
        </View>

        <View className="px-6 mb-8">
          <Text className="text-white text-lg font-medium mb-6">Featured</Text>
          <View className="items-center">
            <Badge
              label="Currently Active"
              radius="2xl"
              size="lg"
              variant="notifications"
              icon={
                <SymbolView
                  name="sparkles"
                  size={28}
                  animationSpec={{
                    effect: { type: "pulse", direction: "up" },
                  }}
                />
              }
            />
          </View>
        </View>

        <View className="items-center opacity-60">
          <Text className="text-gray-500 text-center text-xs">
            Interactive status and label components
          </Text>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default BadgeDemo;
