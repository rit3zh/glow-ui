import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Alert,
  Pressable,
} from "react-native";
import React, { useState, memo } from "react";
import {
  Breadcrumbs,
  BreadcrumbsIcon,
  BreadcrumbsItem,
  BreadcrumbsList,
  BreadcrumbsSeparator,
} from "@/components";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

const BreadcrumbsDemo = () => {
  const [activeDemo, setActiveDemo] = useState<any | null>(null);

  const handlePress = (label: string) => {
    Alert.alert(
      "Navigation",
      `Navigate to "${label}"`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Go", style: "default" },
      ],
      { userInterfaceStyle: "dark" },
    );
  };

  const demos = [
    {
      id: "minimal",
      title: "Minimal Path",
      description: "Clean and simple navigation",
      component: (
        <Breadcrumbs>
          <BreadcrumbsList>
            <BreadcrumbsItem onPress={() => handlePress("Home")}>
              <Text className="text-zinc-400 text-sm font-medium">Home</Text>
            </BreadcrumbsItem>
            <BreadcrumbsSeparator>
              <View className="w-1 h-1 bg-zinc-600 rounded-full mx-3" />
            </BreadcrumbsSeparator>
            <BreadcrumbsItem onPress={() => handlePress("Projects")}>
              <Text className="text-zinc-400 text-sm font-medium">
                Projects
              </Text>
            </BreadcrumbsItem>
            <BreadcrumbsSeparator>
              <View className="w-1 h-1 bg-zinc-600 rounded-full mx-3" />
            </BreadcrumbsSeparator>
            <BreadcrumbsItem isCurrent>
              <Text className="text-white text-sm font-semibold">
                Dashboard
              </Text>
            </BreadcrumbsItem>
          </BreadcrumbsList>
        </Breadcrumbs>
      ),
    },
    {
      id: "icons",
      title: "With Icons",
      description: "Enhanced with subtle iconography",
      component: (
        <Breadcrumbs>
          <BreadcrumbsList>
            <BreadcrumbsItem
              className="flex-row items-center"
              onPress={() => handlePress("Dashboard")}
            >
              <BreadcrumbsIcon>
                <Feather
                  name="home"
                  size={14}
                  color="#71717A"
                  style={{ marginRight: 6 }}
                />
              </BreadcrumbsIcon>
              <Text className="text-zinc-400 text-sm font-medium">
                Dashboard
              </Text>
            </BreadcrumbsItem>
            <BreadcrumbsSeparator>
              <Feather
                name="chevron-right"
                size={14}
                color="#52525B"
                style={{ marginHorizontal: 8 }}
              />
            </BreadcrumbsSeparator>
            <BreadcrumbsItem
              className="flex-row items-center"
              onPress={() => handlePress("Analytics")}
            >
              <BreadcrumbsIcon>
                <MaterialCommunityIcons
                  name="chart-line"
                  size={14}
                  color="#71717A"
                  style={{ marginRight: 6 }}
                />
              </BreadcrumbsIcon>
              <Text className="text-zinc-400 text-sm font-medium">
                Analytics
              </Text>
            </BreadcrumbsItem>
            <BreadcrumbsSeparator>
              <Feather
                name="chevron-right"
                size={14}
                color="#52525B"
                style={{ marginHorizontal: 8 }}
              />
            </BreadcrumbsSeparator>
            <BreadcrumbsItem isCurrent className="flex-row items-center">
              <BreadcrumbsIcon>
                <MaterialCommunityIcons
                  name="file-chart"
                  size={14}
                  color="#FFFFFF"
                  style={{ marginRight: 6 }}
                />
              </BreadcrumbsIcon>
              <Text className="text-white text-sm font-semibold">Reports</Text>
            </BreadcrumbsItem>
          </BreadcrumbsList>
        </Breadcrumbs>
      ),
    },
    {
      id: "pill",
      title: "Pill Style",
      description: "Modern capsule design",
      component: (
        <Breadcrumbs>
          <BreadcrumbsList>
            {["Workspace", "Development", "Components"].map(
              (item, index, arr) => (
                <React.Fragment key={item}>
                  <BreadcrumbsItem
                    isCurrent={index === arr.length - 1}
                    onPress={() => handlePress(item)}
                  >
                    <View
                      className={`px-3 py-1.5 rounded-full transition-colors ${
                        index === arr.length - 1
                          ? "bg-white/10 border border-white/20"
                          : "bg-zinc-800/60 hover:bg-zinc-700/60"
                      }`}
                    >
                      <Text
                        className={`text-xs font-medium ${
                          index === arr.length - 1
                            ? "text-white"
                            : "text-zinc-300"
                        }`}
                      >
                        {item}
                      </Text>
                    </View>
                  </BreadcrumbsItem>
                  {index !== arr.length - 1 && (
                    <BreadcrumbsSeparator>
                      <Feather
                        name="chevron-right"
                        size={12}
                        color="#52525B"
                        style={{ marginHorizontal: 6 }}
                      />
                    </BreadcrumbsSeparator>
                  )}
                </React.Fragment>
              ),
            )}
          </BreadcrumbsList>
        </Breadcrumbs>
      ),
    },
    {
      id: "compact",
      title: "Compact",
      description: "Space-efficient navigation",
      component: (
        <Breadcrumbs>
          <BreadcrumbsList>
            {["Home", "Docs", "API", "Reference"].map((item, index, arr) => (
              <React.Fragment key={item}>
                <BreadcrumbsItem
                  isCurrent={index === arr.length - 1}
                  onPress={() => handlePress(item)}
                >
                  <Text
                    className={`text-xs font-medium px-2 py-1 rounded ${
                      index === arr.length - 1
                        ? "text-white bg-white/5"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {item}
                  </Text>
                </BreadcrumbsItem>
                {index !== arr.length - 1 && (
                  <BreadcrumbsSeparator>
                    <Text className="text-zinc-600 mx-1 text-xs">/</Text>
                  </BreadcrumbsSeparator>
                )}
              </React.Fragment>
            ))}
          </BreadcrumbsList>
        </Breadcrumbs>
      ),
    },
    {
      id: "extended",
      title: "Extended Path",
      description: "Horizontally scrollable for long paths",
      component: (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-1"
        >
          <Breadcrumbs>
            <BreadcrumbsList>
              {[
                "Root",
                "Workspace",
                "Projects",
                "Mobile App",
                "React Native",
                "Components",
                "Navigation",
                "Breadcrumbs",
              ].map((item, index, arr) => (
                <React.Fragment key={item}>
                  <BreadcrumbsItem
                    isCurrent={index === arr.length - 1}
                    onPress={() => handlePress(item)}
                  >
                    <Text
                      className={`text-xs font-medium whitespace-nowrap ${
                        index === arr.length - 1
                          ? "text-white"
                          : "text-zinc-400"
                      }`}
                    >
                      {item}
                    </Text>
                  </BreadcrumbsItem>
                  {index !== arr.length - 1 && (
                    <BreadcrumbsSeparator>
                      <View className="w-0.5 h-0.5 bg-zinc-600 rounded-full mx-2" />
                    </BreadcrumbsSeparator>
                  )}
                </React.Fragment>
              ))}
            </BreadcrumbsList>
          </Breadcrumbs>
        </ScrollView>
      ),
    },
  ];

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 32 }}
      scrollEnabled={true}
    >
      <View className="flex-1 bg-zinc-950">
        <SafeAreaView className="flex-1">
          <View className="px-6 pt-8 pb-6 border-b border-zinc-800/50">
            <Text className="text-2xl font-bold text-white mb-2">
              Breadcrumbs
            </Text>
            <Text className="text-zinc-400 text-sm leading-5">
              Modern navigation paths with clean, minimalist design
            </Text>
          </View>

          <View className="px-6 pt-8 space-y-8">
            {demos.map((demo) => (
              <Pressable
                key={demo.id}
                className={`p-5 rounded-xl border transition-colors ${
                  activeDemo === demo.id
                    ? "bg-zinc-900/80 border-zinc-700"
                    : "bg-zinc-900/40 border-zinc-800/60"
                }`}
              >
                {/* Demo Header */}
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-1">
                    <Text className="text-white font-semibold text-base mb-1">
                      {demo.title}
                    </Text>
                    <Text className="text-zinc-400 text-sm">
                      {demo.description}
                    </Text>
                  </View>
                  <Feather
                    name={
                      activeDemo === demo.id ? "chevron-up" : "chevron-down"
                    }
                    size={18}
                    color="#71717A"
                  />
                </View>

                <View className="bg-zinc-950/60 p-4 rounded-lg border border-zinc-800/40">
                  {demo.component}
                </View>
              </Pressable>
            ))}
          </View>

          <View className="px-6 pt-12 pb-8">
            <View className="p-4 bg-zinc-900/30 rounded-lg border border-zinc-800/30">
              <Text className="text-zinc-400 text-xs text-center">
                Tap any breadcrumb item to see the interaction
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </ScrollView>
  );
};

export default memo(BreadcrumbsDemo);
