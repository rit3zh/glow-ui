import React from "react";
import { StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { UnfoldMenu } from "@/components";
import { Showcase } from "~/showcase";

const ITEMS = [
  { value: "search", label: "Search", icon: "search" },
  { value: "share", label: "Share", icon: "share-2" },
  { value: "copy", label: "Copy", icon: "copy" },
  { value: "edit", label: "Edit", icon: "edit-2" },
  { value: "archive", label: "Archive", icon: "archive" },
  { value: "delete", label: "Delete", icon: "trash-2" },
] as const;

export default function UnfoldMenuScreen() {
  return (
    <Showcase>
      <View style={styles.center}>
        <UnfoldMenu theme="dark" onSelect={(value) => console.log(value)}>
          <UnfoldMenu.Trigger>
            <UnfoldMenu.Label>Add Task</UnfoldMenu.Label>
            <UnfoldMenu.Icon>
              {({ color, size }) => (
                <Feather name="plus" size={size} color={color} />
              )}
            </UnfoldMenu.Icon>
          </UnfoldMenu.Trigger>

          <UnfoldMenu.Content>
            <UnfoldMenu.Header>
              <UnfoldMenu.Title>Create</UnfoldMenu.Title>
              <UnfoldMenu.Close>
                {({ color, size }) => (
                  <Feather name="x" size={size} color={color} />
                )}
              </UnfoldMenu.Close>
            </UnfoldMenu.Header>

            <UnfoldMenu.Grid columns={3}>
              {ITEMS.map((item) => (
                <UnfoldMenu.Item key={item.value} value={item.value}>
                  <UnfoldMenu.Icon>
                    {({ color, size }) => (
                      <Feather name={item.icon} size={size} color={color} />
                    )}
                  </UnfoldMenu.Icon>
                  <UnfoldMenu.Label>{item.label}</UnfoldMenu.Label>
                </UnfoldMenu.Item>
              ))}
            </UnfoldMenu.Grid>
          </UnfoldMenu.Content>
        </UnfoldMenu>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
