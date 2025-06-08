import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pagination } from "@/components";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const PaginationCard: React.FC<{
  title: string;
  description: string;
  children: React.ReactNode;
  icon?: keyof typeof Ionicons.glyphMap;
}> = ({ title, description, children, icon }) => (
  <View className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-6 backdrop-blur">
    <View className="flex-row items-center mb-3">
      {icon && (
        <Ionicons
          name={icon}
          size={18}
          color="#a1a1aa"
          style={{ marginRight: 8 }}
        />
      )}
      <Text className="text-zinc-100 font-semibold text-lg">{title}</Text>
    </View>
    <Text className="text-zinc-400 text-sm mb-6 leading-5">{description}</Text>
    <View className="items-center justify-center py-8">{children}</View>
  </View>
);

const InteractiveControls: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => (
  <View className="flex-row items-center justify-center space-x-3 mt-4">
    <TouchableOpacity
      onPress={() => onPageChange(Math.max(0, currentPage - 1))}
      disabled={currentPage === 0}
      className={`p-2 rounded-lg ${currentPage === 0 ? "opacity-40" : "bg-zinc-800"}`}
    >
      <Ionicons name="chevron-back" size={16} color="#fafafa" />
    </TouchableOpacity>

    <Text className="text-zinc-300 text-sm min-w-[60px] text-center">
      {currentPage + 1} of {totalPages}
    </Text>

    <TouchableOpacity
      onPress={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
      disabled={currentPage === totalPages - 1}
      className={`p-2 rounded-lg ${currentPage === totalPages - 1 ? "opacity-40" : "bg-zinc-800"}`}
    >
      <Ionicons name="chevron-forward" size={16} color="#fafafa" />
    </TouchableOpacity>
  </View>
);

const PaginationDemo = () => {
  const [classicIndex, setClassicIndex] = React.useState(0);
  const [modernIndex, setModernIndex] = React.useState(1);
  const [minimalIndex, setMinimalIndex] = React.useState(2);
  const [accentIndex, setAccentIndex] = React.useState(0);
  const [largeIndex, setLargeIndex] = React.useState(1);

  return (
    <GestureHandlerRootView>
      <View className="flex-1 bg-zinc-950">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          scrollEnabled
          contentInsetAdjustmentBehavior="always"
        >
          <SafeAreaView className="flex-1">
            <View className="px-6 pt-6 pb-4 border-b border-zinc-800/50">
              <View className="flex-row items-center mb-2">
                <Ionicons
                  name="ellipsis-horizontal"
                  size={24}
                  color="#fafafa"
                />
                <Text className="text-zinc-50 font-bold text-2xl ml-3">
                  Pagination Components
                </Text>
              </View>
              <Text className="text-zinc-400 text-base">
                Navigate through content with elegant dot indicators
              </Text>
            </View>

            <View className="px-6 py-6">
              <PaginationCard
                title="Classic"
                description="Traditional dot pagination with subtle styling and smooth transitions"
                icon="radio-button-on"
              >
                <View>
                  <Pagination
                    activeIndex={classicIndex}
                    dotSize={8}
                    inactiveColor="#3f3f46"
                    activeColor="#f4f4f5"
                    currentColor="#f4f4f5"
                    borderRadius={4}
                    dotContainer={4}
                    onIndexChange={setClassicIndex}
                    containerStyle={{
                      backgroundColor: "transparent",
                      padding: 8,
                    }}
                    totalItems={5}
                  />
                  <InteractiveControls
                    currentPage={classicIndex}
                    totalPages={5}
                    onPageChange={setClassicIndex}
                  />
                </View>
              </PaginationCard>

              <PaginationCard
                title="Modern Accent"
                description="Contemporary design with brand color accent and rounded container"
                icon="diamond"
              >
                <View>
                  <Pagination
                    activeIndex={modernIndex}
                    dotSize={6}
                    inactiveColor="#52525b"
                    activeColor="#6366f1"
                    currentColor="#6366f1"
                    borderRadius={3}
                    dotContainer={3}
                    onIndexChange={setModernIndex}
                    containerStyle={{
                      backgroundColor: "#18181b",
                      padding: 12,
                      borderRadius: 24,
                      borderWidth: 1,
                      borderColor: "#27272a",
                    }}
                    totalItems={7}
                  />
                  <InteractiveControls
                    currentPage={modernIndex}
                    totalPages={7}
                    onPageChange={setModernIndex}
                  />
                </View>
              </PaginationCard>

              <PaginationCard
                title="Minimal"
                description="Clean and understated design focusing on essential navigation elements"
                icon="remove"
              >
                <View>
                  <Pagination
                    activeIndex={minimalIndex}
                    dotSize={4}
                    inactiveColor="#404040"
                    activeColor="#a1a1aa"
                    currentColor="#a1a1aa"
                    borderRadius={2}
                    dotContainer={2}
                    onIndexChange={setMinimalIndex}
                    containerStyle={{
                      backgroundColor: "transparent",
                      padding: 6,
                    }}
                    totalItems={4}
                  />
                  <InteractiveControls
                    currentPage={minimalIndex}
                    totalPages={4}
                    onPageChange={setMinimalIndex}
                  />
                </View>
              </PaginationCard>

              <PaginationCard
                title="Vibrant"
                description="Bold color scheme perfect for highlighting important navigation sections"
                icon="color-palette"
              >
                <View>
                  <Pagination
                    activeIndex={accentIndex}
                    dotSize={10}
                    inactiveColor="#1e293b"
                    activeColor="#0ea5e9"
                    currentColor="#0ea5e9"
                    borderRadius={5}
                    dotContainer={5}
                    onIndexChange={setAccentIndex}
                    containerStyle={{
                      backgroundColor: "#0f172a",
                      padding: 14,
                      borderRadius: 28,
                      borderWidth: 1,
                      borderColor: "#334155",
                    }}
                    totalItems={6}
                  />
                  <InteractiveControls
                    currentPage={accentIndex}
                    totalPages={6}
                    onPageChange={setAccentIndex}
                  />
                </View>
              </PaginationCard>

              <PaginationCard
                title="Large Format"
                description="Prominent pagination ideal for hero sections and primary content areas"
                icon="resize"
              >
                <View>
                  <Pagination
                    activeIndex={largeIndex}
                    dotSize={12}
                    inactiveColor="#27272a"
                    activeColor="#10b981"
                    currentColor="#10b981"
                    borderRadius={6}
                    dotContainer={6}
                    onIndexChange={setLargeIndex}
                    containerStyle={{
                      backgroundColor: "#09090b",

                      height: 25,
                      borderRadius: 32,
                      borderWidth: 1,
                      borderColor: "#18181b",
                    }}
                    totalItems={4}
                  />
                  <InteractiveControls
                    currentPage={largeIndex}
                    totalPages={4}
                    onPageChange={setLargeIndex}
                  />
                </View>
              </PaginationCard>

              <View className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6 mt-2">
                <View className="flex-row items-center mb-4">
                  <Ionicons
                    name="information-circle"
                    size={18}
                    color="#6366f1"
                  />
                  <Text className="text-zinc-200 font-semibold text-base ml-2">
                    Usage Guidelines
                  </Text>
                </View>
                <View className="space-y-3">
                  <View className="flex-row">
                    <Text className="text-zinc-400 text-sm">• </Text>
                    <Text className="text-zinc-400 text-sm flex-1">
                      Use{" "}
                      <Text className="text-zinc-300 font-medium">Classic</Text>{" "}
                      for general content navigation
                    </Text>
                  </View>
                  <View className="flex-row">
                    <Text className="text-zinc-400 text-sm">• </Text>
                    <Text className="text-zinc-400 text-sm flex-1">
                      Choose{" "}
                      <Text className="text-zinc-300 font-medium">Modern</Text>{" "}
                      for dashboard interfaces
                    </Text>
                  </View>
                  <View className="flex-row">
                    <Text className="text-zinc-400 text-sm">• </Text>
                    <Text className="text-zinc-400 text-sm flex-1">
                      Apply{" "}
                      <Text className="text-zinc-300 font-medium">Minimal</Text>{" "}
                      when space is constrained
                    </Text>
                  </View>
                  <View className="flex-row">
                    <Text className="text-zinc-400 text-sm">• </Text>
                    <Text className="text-zinc-400 text-sm flex-1">
                      Use{" "}
                      <Text className="text-zinc-300 font-medium">
                        Large Format
                      </Text>{" "}
                      for hero carousels
                    </Text>
                  </View>
                </View>
              </View>

              <View className="mt-8 pt-6 border-t border-zinc-800/50">
                <Text className="text-zinc-500 text-center text-sm">
                  Tap the navigation controls to see pagination in action
                </Text>
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

export default PaginationDemo;
