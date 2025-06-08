import { View, Text, ScrollView, SafeAreaView, Dimensions } from "react-native";
import React from "react";
import { AnimatedMaskedText } from "@/components/index";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const AnimatedMaskedTextDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-black"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
      contentInsetAdjustmentBehavior="always"
      scrollEnabled
      scrollToOverflowEnabled={false}
      showsVerticalScrollIndicator={false}
    >
      <SafeAreaView className="flex-1">
        <View className="px-6 pt-8 pb-6 border-b border-zinc-800">
          <View className="flex-row items-center mb-2">
            <Ionicons name="sparkles" size={24} color="#3b82f6" />
            <Text className="text-zinc-400 text-sm ml-2 font-medium">
              COMPONENT SHOWCASE
            </Text>
          </View>
          <Text className="text-white text-3xl font-bold">
            Animated Masked Text
          </Text>
          <Text className="text-zinc-400 text-base mt-2 leading-relaxed">
            Beautiful shimmer effects with customizable animations
          </Text>
        </View>

        <View className="flex-1 justify-center items-center px-6">
          <View className="w-full max-w-sm">
            <View className="bg-zinc-950 rounded-2xl p-8 mb-8 border border-zinc-800">
              <View className="flex-row items-center justify-center mb-4">
                <Ionicons name="flash" size={20} color="#10b981" />
                <Text className="text-zinc-400 text-sm ml-2 font-medium">
                  PRIMARY
                </Text>
              </View>
              <View className="items-center">
                <AnimatedMaskedText
                  baseTextColor="#18181b"
                  colors={[
                    "transparent",
                    "rgba(59, 130, 246, 0.9)",
                    "transparent",
                  ]}
                  speed={0.6}
                  style={{
                    fontSize: 32,
                    fontWeight: "800",
                    textAlign: "center",
                    lineHeight: 38,
                  }}
                >
                  Beautiful Text
                </AnimatedMaskedText>
              </View>
            </View>

            <View className="bg-zinc-950 rounded-2xl p-8 mb-8 border border-zinc-800">
              <View className="flex-row items-center justify-center mb-4">
                <Ionicons name="color-palette" size={20} color="#f59e0b" />
                <Text className="text-zinc-400 text-sm ml-2 font-medium">
                  GRADIENT
                </Text>
              </View>
              <View className="items-center">
                <AnimatedMaskedText
                  baseTextColor="#27272a"
                  colors={[
                    "transparent",
                    "rgba(236, 72, 153, 0.8)",
                    "rgba(59, 130, 246, 0.8)",
                    "transparent",
                  ]}
                  speed={0.4}
                  style={{
                    fontSize: 28,
                    fontWeight: "700",
                    textAlign: "center",
                    lineHeight: 34,
                  }}
                >
                  Shimmer Effect
                </AnimatedMaskedText>
              </View>
            </View>

            <View className="bg-zinc-950 rounded-2xl p-8 border border-zinc-800">
              <View className="flex-row items-center justify-center mb-4">
                <Ionicons name="star" size={20} color="#8b5cf6" />
                <Text className="text-zinc-400 text-sm ml-2 font-medium">
                  ACCENT
                </Text>
              </View>
              <View className="items-center">
                <AnimatedMaskedText
                  baseTextColor="#1f2937"
                  colors={[
                    "transparent",
                    "rgba(16, 185, 129, 0.9)",
                    "transparent",
                  ]}
                  speed={0.8}
                  style={{
                    fontSize: 24,
                    fontWeight: "600",
                    textAlign: "center",
                    lineHeight: 30,
                  }}
                >
                  Smooth Animation
                </AnimatedMaskedText>
              </View>
            </View>
          </View>
        </View>

        <View className="px-6 pt-6 border-t border-zinc-800">
          <View className="flex-row items-center justify-center">
            <Ionicons name="code-slash" size={16} color="#6b7280" />
            <Text className="text-zinc-500 text-sm ml-2">
              Made with ❤️ and glow-ui.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default AnimatedMaskedTextDemo;
