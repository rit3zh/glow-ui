import React from "react";
import { StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { List } from "@/components";
import { Showcase } from "~/showcase";

const ICON_COLOR = "rgba(235,235,245,0.5)";

export default function ListScreen() {
  return (
    <Showcase>
      <View style={styles.stage}>
        <List.Root>
          <List.Section>
            <List.Section.Title>General</List.Section.Title>
            <List.Section.Content>
              <List.Item onPress={() => {}}>
                <List.Item.Icon>
                  <Feather name="moon" size={16} color={ICON_COLOR} />
                </List.Item.Icon>
                <List.Item.Title>Appearance</List.Item.Title>
                <List.Item.Value>Dark</List.Item.Value>
                <List.Item.Chevron />
              </List.Item>

              <List.Item onPress={() => {}}>
                <List.Item.Icon>
                  <Feather name="bell" size={16} color={ICON_COLOR} />
                </List.Item.Icon>
                <List.Item.Title>Notifications</List.Item.Title>
                <List.Item.Value>On</List.Item.Value>
                <List.Item.Chevron />
              </List.Item>

              <List.Item onPress={() => {}}>
                <List.Item.Icon>
                  <Feather name="globe" size={16} color={ICON_COLOR} />
                </List.Item.Icon>
                <List.Item.Title>Language</List.Item.Title>
                <List.Item.Value>English</List.Item.Value>
                <List.Item.Chevron />
              </List.Item>
            </List.Section.Content>
          </List.Section>

          <List.Section>
            <List.Section.Title>Account</List.Section.Title>
            <List.Section.Content>
              <List.Item onPress={() => {}}>
                <List.Item.Content>
                  <List.Item.Title>Reacticx</List.Item.Title>
                  <List.Item.Subtitle>hey@reacticx.dev</List.Item.Subtitle>
                </List.Item.Content>
                <List.Item.Chevron />
              </List.Item>

              <List.Item destructive onPress={() => {}}>
                <List.Item.Title>Sign Out</List.Item.Title>
              </List.Item>
            </List.Section.Content>
            <List.Section.Footer>Version 1.0.0</List.Section.Footer>
          </List.Section>
        </List.Root>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
});
