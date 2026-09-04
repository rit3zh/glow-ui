import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CurvedBottomTabs } from "@/components/base/curved-bottom-tabs";

export default function TabLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        tabBar={(props) => <CurvedBottomTabs {...props} />}
        screenOptions={{
          headerShown: true,
          headerTitle: "Reacticx",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",

            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={20}
                color={focused ? "#FFFFFF" : "#B9B9B9"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="second"
          options={{
            title: "Search",
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? "search" : "search-outline"}
                size={20}
                color={focused ? "#FFFFFF" : "#B9B9B9"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="third"
          options={{
            title: "Profile",
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={20}
                color={focused ? "#FFFFFF" : "#B9B9B9"}
              />
            ),
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}
