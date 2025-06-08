import { View, Text, ScrollView, SafeAreaView } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  SpinnerArc,
  SpinnerSegments,
  RotatingSquaresSpinner,
  PulsingDots,
  OrbitDotLoader,
  CircleLoadingIndicator,
} from "@/components";

const SpinnerCard: React.FC<{
  title: string;
  description: string;
  children: React.ReactNode;
  icon?: keyof typeof Ionicons.glyphMap;
}> = ({ title, description, children, icon }) => (
  <View className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-4 backdrop-blur">
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

const LoaderDemo: React.FC = () => {
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      scrollEnabled={true}
      contentInsetAdjustmentBehavior="always"
    >
      <View className="flex-1 bg-zinc-950">
        <SafeAreaView className="flex-1">
          <View className="px-6 pt-6 pb-4 border-b border-zinc-800/50">
            <View className="flex-row items-center mb-2">
              <Ionicons name="refresh" size={24} color="#fafafa" />
              <Text className="text-zinc-50 font-bold text-2xl ml-3">
                Loading Components
              </Text>
            </View>
            <Text className="text-zinc-400 text-base">
              Beautiful, accessible loading indicators built for React Native
            </Text>
          </View>

          <View className="px-6 py-6">
            <SpinnerCard
              title="Arc Spinner"
              description="Elegant circular progress indicator with customizable arc length and gradient colors"
              icon="pie-chart"
            >
              <SpinnerArc
                arcLength={270}
                colorEnd="#6366f1"
                colorStart="#8b5cf6"
                backgroundColor="transparent"
                size={64}
                speed={500}
                strokeWidth={3}
              />
            </SpinnerCard>

            <SpinnerCard
              title="Segments Spinner"
              description="Dynamic segmented loader with pulsing animation and customizable segment count"
              icon="radio-button-on"
            >
              <SpinnerSegments
                centerColor="#18181b"
                color="#71717a"
                pulseSize={1.5}
                segmentColor="#f4f4f5"
                segmentCount={12}
                size={64}
                speed={1500}
              />
            </SpinnerCard>

            <SpinnerCard
              title="Rotating Squares"
              description="Smooth rotating geometric pattern with configurable timing and spacing"
              icon="square"
            >
              <RotatingSquaresSpinner
                color="#10b981"
                squareSize={8}
                spacing={14}
                size={64}
                duration={1000}
                repeatCount={-1}
              />
            </SpinnerCard>

            <SpinnerCard
              title="Pulsing Dots"
              description="Rhythmic dot animation with gradient support and flexible positioning"
              icon="ellipse"
            >
              <PulsingDots
                color="#ef4444"
                dotCount={3}
                duration={1800}
                gradient={[{ from: "#ef4444", to: "#f97316" }]}
                radius={32}
                spacing={16}
              />
            </SpinnerCard>

            <SpinnerCard
              title="Orbit Loader"
              description="Planetary motion inspired loader with orbiting dots around a central point"
              icon="planet"
            >
              <OrbitDotLoader
                dotColor="#06b6d4"
                dotRadius={4}
                centerRadius={8}
                size={64}
                duration={2000}
                numDots={8}
              />
            </SpinnerCard>

            <SpinnerCard
              title="Circle Indicator"
              description="Classic dot-based circular loading pattern with smooth transitions"
              icon="refresh-circle"
            >
              <CircleLoadingIndicator
                dotColor="#8b5cf6"
                dotRadius={3}
                duration={600}
                dotSpacing={6}
              />
            </SpinnerCard>

            <SpinnerCard
              title="Compact Squares"
              description="Minimalist square rotation with faster timing for quick feedback scenarios"
              icon="grid"
            >
              <RotatingSquaresSpinner
                squareSize={6}
                color="#f59e0b"
                spacing={8}
                size={48}
                duration={800}
                repeatCount={-1}
              />
            </SpinnerCard>

            <View className="mt-8 pt-6 border-t border-zinc-800/50">
              <Text className="text-zinc-500 text-center text-sm">
                Choose the right loading indicator for your use case
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </ScrollView>
  );
};

export default LoaderDemo;
