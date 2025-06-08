import { View, Text, ScrollView, SafeAreaView } from "react-native";
import React from "react";
import { AvatarGroup } from "@/components/index";

const AvatarGroupDemo: React.FC = (): React.ReactNode => {
  const teamMembers = [
    {
      name: "Alice Cooper",
      uri: "https://i.pravatar.cc/150?img=1",
      id: "1",
    },
    {
      name: "Bob Martinez",
      uri: "https://i.pravatar.cc/150?img=2",
      id: "2",
    },
    {
      name: "Charlie Davis",
      uri: "https://i.pravatar.cc/150?img=3",
      id: "3",
    },
    {
      name: "David Wilson",
      uri: "https://i.pravatar.cc/150?img=4",
      id: "4",
    },
    {
      name: "Emma Johnson",
      uri: "https://i.pravatar.cc/150?img=5",
      id: "5",
    },
  ];

  const designTeam = [
    {
      name: "Sophie Chen",
      uri: "https://i.pravatar.cc/150?img=6",
      id: "6",
    },
    {
      name: "Marcus Thompson",
      uri: "https://i.pravatar.cc/150?img=7",
      id: "7",
    },
    {
      name: "Luna Rodriguez",
      uri: "https://i.pravatar.cc/150?img=8",
      id: "8",
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-gray-900"
      contentInsetAdjustmentBehavior="always"
      contentContainerStyle={{
        flexGrow: 1,
        paddingVertical: 20,
      }}
      scrollEnabled={true}
      showsVerticalScrollIndicator={false}
    >
      <SafeAreaView className="flex-1">
        <View className="px-6 mb-8">
          <Text className="text-white text-4xl font-bold text-center mb-3">
            Team Avatars
          </Text>
          <Text className="text-gray-400 text-center text-base leading-6">
            Interactive avatar groups with stunning dark aesthetics
          </Text>
        </View>

        <View className="items-center mb-12">
          <View className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 mx-6 shadow-2xl border border-gray-700">
            <View className="absolute -top-3 -right-3 w-6 h-6 bg-blue-500 rounded-full opacity-70 blur-sm" />
            <View className="absolute -bottom-2 -left-2 w-4 h-4 bg-purple-500 rounded-full opacity-60" />
            <View className="absolute top-4 left-4 w-2 h-2 bg-cyan-400 rounded-full opacity-80" />

            <View className="items-center">
              <Text className="text-white text-xl font-semibold mb-6">
                Development Team
              </Text>

              <View className="relative">
                <View className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full blur-xl" />
                <AvatarGroup
                  size={80}
                  max={4}
                  onPress={(id) => console.log(`Avatar ${id} pressed`)}
                  overlap={20}
                  avatars={teamMembers}
                />
              </View>

              <Text className="text-gray-400 text-sm mt-4 text-center">
                5 active members • Tap to view profiles
              </Text>
            </View>
          </View>
        </View>

        <View className="px-6 space-y-6">
          <Text className="text-white text-2xl font-bold text-center mb-6">
            Group Variations
          </Text>

          <View className="bg-gray-800 rounded-2xl p-6 border border-gray-700 mb-5">
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-white text-lg font-semibold">
                  Design Team
                </Text>
                <Text className="text-gray-400 text-sm">
                  Creative professionals
                </Text>
              </View>
              <View className="bg-green-500 px-3 py-1 rounded-full">
                <Text className="text-white text-xs font-medium">Active</Text>
              </View>
            </View>

            <View className="items-center">
              <AvatarGroup
                size={60}
                max={3}
                onPress={(id) =>
                  console.log(`Design team avatar ${id} pressed`)
                }
                overlap={15}
                avatars={designTeam}
              />
            </View>
          </View>

          <View className="bg-gray-800 rounded-2xl p-6 border border-gray-700 mb-5">
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-white text-lg font-semibold">
                  Core Team
                </Text>
                <Text className="text-gray-400 text-sm">Key contributors</Text>
              </View>
              <View className="bg-yellow-500 px-3 py-1 rounded-full">
                <Text className="text-white text-xs font-medium">Meeting</Text>
              </View>
            </View>

            <View className="items-center">
              <AvatarGroup
                size={45}
                max={2}
                onPress={(id) => console.log(`Core team avatar ${id} pressed`)}
                overlap={12}
                avatars={teamMembers.slice(0, 3)}
              />
            </View>
          </View>

          <View className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-6 border border-gray-600 mb-5">
            <Text className="text-white text-lg font-semibold mb-4 text-center">
              Team Statistics
            </Text>

            <View className="flex-row justify-around">
              <View className="items-center">
                <Text className="text-2xl font-bold text-blue-400">12</Text>
                <Text className="text-gray-400 text-sm">Total Members</Text>
              </View>

              <View className="w-px bg-gray-600 mx-4" />

              <View className="items-center">
                <Text className="text-2xl font-bold text-green-400">8</Text>
                <Text className="text-gray-400 text-sm">Online Now</Text>
              </View>

              <View className="w-px bg-gray-600 mx-4" />

              <View className="items-center">
                <Text className="text-2xl font-bold text-purple-400">3</Text>
                <Text className="text-gray-400 text-sm">Teams</Text>
              </View>
            </View>
          </View>
          <View className="items-center mt-8 mb-6 opacity-70">
            <Text className="text-gray-500 text-center text-sm">
              ✨ Beautiful avatar groups • @glow-ui
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default AvatarGroupDemo;
