import { View, Text, ScrollView, SafeAreaView } from "react-native";
import React from "react";
import { Avatar } from "@/components/index";

const AvatarDemo: React.FunctionComponent = (): React.ReactNode => {
  return (
    <ScrollView
      className="flex-1 bg-gray-900"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <SafeAreaView className="flex-1 items-center justify-center px-6">
        <View className="mb-12 items-center">
          <Text className="text-white text-3xl font-bold mb-2">
            Profile Avatar
          </Text>
          <Text className="text-gray-400 text-base text-center leading-6">
            Interactive avatar component with modern dark styling
          </Text>
        </View>

        <View className="bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-700 mb-8">
          <View className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full opacity-80" />
          <View className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-500 rounded-full opacity-60" />

          <View className="items-center">
            <View className="relative">
              <View className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-30 blur-lg" />

              <View className="relative bg-gray-700 rounded-full p-2">
                <Avatar
                  image={{
                    uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
                    name: "John Doe",
                  }}
                  showAvatar={false}
                  loading={true}
                  showOnlineIndicator={true}
                  size={80}
                />
              </View>
            </View>
          </View>
        </View>

        <View className="w-full max-w-sm">
          <Text className="text-white text-xl font-semibold mb-6 text-center">
            Avatar Variations
          </Text>

          <View className="flex-row justify-around items-center mb-8">
            <View className="items-center">
              <View className="bg-gray-800 rounded-2xl p-3 border border-gray-700">
                <Avatar
                  image={{
                    uri: "https://plus.unsplash.com/premium_photo-1747861981486-05f2969c8f58?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    name: "Lara Adams",
                  }}
                  showAvatar={true}
                  loading={false}
                  showOnlineIndicator={true}
                  size={50}
                />
              </View>
              <Text className="text-gray-400 text-xs mt-2">Small</Text>
            </View>

            <View className="items-center">
              <View className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
                <Avatar
                  image={{
                    uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
                    name: "Mike Johnson",
                  }}
                  showAvatar={true}
                  loading={false}
                  showOnlineIndicator={false}
                  size={65}
                />
              </View>
              <Text className="text-gray-400 text-xs mt-2">Medium</Text>
            </View>

            <View className="items-center">
              <View className="bg-gray-800 rounded-2xl p-3 border border-gray-700">
                <Avatar
                  image={{
                    uri: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
                    name: "Sarah Wilson",
                  }}
                  showAvatar={true}
                  loading={false}
                  showOnlineIndicator={true}
                  size={50}
                />
              </View>
              <Text className="text-gray-400 text-xs mt-2">Active</Text>
            </View>
          </View>
        </View>

        <View className="bg-gray-800 rounded-2xl p-6 w-full max-w-sm border border-gray-700">
          <Text className="text-white text-lg font-semibold mb-4 text-center">
            Status Options
          </Text>

          <View className="space-y-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-green-500 rounded-full mr-3" />
                <Text className="text-gray-300">Online</Text>
              </View>
              <Text className="text-gray-500 text-sm">Active now</Text>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-gray-500 rounded-full mr-3" />
                <Text className="text-gray-300">Offline</Text>
              </View>
              <Text className="text-gray-500 text-sm">Last seen 2h ago</Text>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-yellow-500 rounded-full mr-3" />
                <Text className="text-gray-300">Away</Text>
              </View>
              <Text className="text-gray-500 text-sm">Idle 5m ago</Text>
            </View>
          </View>
        </View>

        <View className="mt-8 opacity-60">
          <Text className="text-gray-500 text-center text-sm">
            Are you ready to use glow-ui?
            {"\n"}npx rn-glow add avatar
          </Text>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default AvatarDemo;
