import React, { useState } from "react";
import { Platform, ScrollView } from "react-native";
import * as Settings from "./components";
import { COLOR_SCHEME } from "./const";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { SymbolView } from "expo-symbols";

export function SettingsV1() {
  const [notifications, setNotifications] = useState<boolean>(true);
  const [analytics, setAnalytics] = useState<boolean>(false);
  const [autoSync, setAutoSync] = useState<boolean>(true);
  const [developerMode, setDeveloperMode] = useState<boolean>(false);

  return (
    <React.Fragment>
      <Stack.Screen
        options={{
          headerShown: true,
          headerLargeTitleEnabled: true,
          headerTransparent: true,
          headerSearchBarOptions: {},
          title: "Settings",
        }}
      />

      <ScrollView
        style={{ flex: 1, backgroundColor: COLOR_SCHEME.BACKGROUND_PRIMARY }}
        contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
        contentInsetAdjustmentBehavior="always"
      >
        <Settings.Root>
          <Settings.Section>
            <Settings.Group>
              <Settings.LargeItem onPress={() => {}}>
                <Settings.Avatar
                  source={{
                    uri: "https://i.pinimg.com/736x/24/90/2c/24902c56c166329f01fbf421c6f2197f.jpg",
                  }}
                />
                <Settings.Content>
                  <Settings.Title style={{ fontSize: 20, fontWeight: "600" }}>
                    Ritesh CX
                  </Settings.Title>
                  <Settings.Subtitle>
                    Apple Account, iCloud, and more
                  </Settings.Subtitle>
                </Settings.Content>
                <Settings.Chevron size={18} />
              </Settings.LargeItem>
            </Settings.Group>
          </Settings.Section>

          <Settings.Section>
            <Settings.Group>
              <Settings.Item onPress={() => {}}>
                <Settings.Icon
                  color="#aaaaaa"
                  icon={
                    Platform.OS === "ios" ? (
                      <>
                        <SymbolView
                          name="airpodsmax"
                          size={20}
                          resizeMode="scaleAspectFit"
                          tintColor={"#ffffff"}
                        />
                      </>
                    ) : (
                      <FontAwesome6
                        name="headphones-simple"
                        size={18}
                        color="#ffffff"
                      />
                    )
                  }
                />
                <Settings.Content>
                  {Platform.OS === "ios" ? (
                    <Settings.Title>rit3zh's Airpods Max</Settings.Title>
                  ) : (
                    <Settings.Title>rit3zh's Sony WH-1000XM5</Settings.Title>
                  )}
                </Settings.Content>
                <Settings.Chevron />
              </Settings.Item>
            </Settings.Group>
          </Settings.Section>

          <Settings.Section>
            <Settings.Group>
              <Settings.Item>
                <Settings.Icon
                  color="#FF9F0A"
                  icon={
                    <Ionicons
                      name="notifications-outline"
                      size={18}
                      color="#FFFFFF"
                    />
                  }
                />
                <Settings.Content>
                  <Settings.Title>Notifications</Settings.Title>
                </Settings.Content>
                <Settings.Switch
                  value={notifications}
                  onValueChange={setNotifications}
                />
              </Settings.Item>

              <Settings.Item>
                <Settings.Icon
                  color="#AF52DE"
                  icon={
                    <Ionicons
                      name="analytics-outline"
                      size={18}
                      color="#FFFFFF"
                    />
                  }
                />
                <Settings.Content>
                  <Settings.Title>Analytics</Settings.Title>
                </Settings.Content>
                <Settings.Switch
                  value={analytics}
                  onValueChange={setAnalytics}
                />
              </Settings.Item>

              <Settings.Item>
                <Settings.Icon
                  color="#5AC8FA"
                  icon={
                    <Ionicons
                      name="cloud-upload-outline"
                      size={18}
                      color="#FFFFFF"
                    />
                  }
                />
                <Settings.Content>
                  <Settings.Title>Auto Sync</Settings.Title>
                </Settings.Content>
                <Settings.Switch value={autoSync} onValueChange={setAutoSync} />
              </Settings.Item>
            </Settings.Group>
          </Settings.Section>

          <Settings.Section>
            <Settings.Group>
              <Settings.Item onPress={() => {}}>
                <Settings.Icon
                  color="#5856D6"
                  icon={
                    <Ionicons
                      name="color-palette-outline"
                      size={18}
                      color="#FFFFFF"
                    />
                  }
                />
                <Settings.Content>
                  <Settings.Title>Appearance</Settings.Title>
                </Settings.Content>
                <Settings.Value>Dark</Settings.Value>
                <Settings.Chevron />
              </Settings.Item>

              <Settings.Item onPress={() => {}}>
                <Settings.Icon
                  color="#32D74B"
                  icon={
                    <Ionicons name="globe-outline" size={18} color="#FFFFFF" />
                  }
                />
                <Settings.Content>
                  <Settings.Title>Language</Settings.Title>
                </Settings.Content>
                <Settings.Value>English</Settings.Value>
                <Settings.Chevron />
              </Settings.Item>
            </Settings.Group>
          </Settings.Section>

          <Settings.Section>
            <Settings.Group>
              <Settings.Item>
                <Settings.Icon
                  color="#FF375F"
                  icon={
                    <Ionicons
                      name="code-slash-outline"
                      size={18}
                      color="#FFFFFF"
                    />
                  }
                />
                <Settings.Content>
                  <Settings.Title>Developer Mode</Settings.Title>
                </Settings.Content>
                <Settings.Switch
                  value={developerMode}
                  onValueChange={setDeveloperMode}
                />
              </Settings.Item>

              <Settings.Item disabled>
                <Settings.Icon
                  color="#8E8E93"
                  icon={
                    <Ionicons name="server-outline" size={18} color="#FFFFFF" />
                  }
                />
                <Settings.Content>
                  <Settings.Title>Experimental API</Settings.Title>
                </Settings.Content>
                <Settings.Value>Unavailable</Settings.Value>
              </Settings.Item>
            </Settings.Group>
            <Settings.Footer>
              Advanced settings are intended for testing and debugging purposes.
            </Settings.Footer>
          </Settings.Section>

          <Settings.Section>
            <Settings.Label>About</Settings.Label>
            <Settings.Group>
              <Settings.Item onPress={() => {}}>
                <Settings.Content>
                  <Settings.Title>Terms of Service</Settings.Title>
                </Settings.Content>
                <Settings.Chevron />
              </Settings.Item>

              <Settings.Item onPress={() => {}}>
                <Settings.Content>
                  <Settings.Title>Privacy Policy</Settings.Title>
                </Settings.Content>
                <Settings.Chevron />
              </Settings.Item>

              <Settings.Item>
                <Settings.Content>
                  <Settings.Title>Version</Settings.Title>
                </Settings.Content>
                <Settings.Value>1.0.0</Settings.Value>
              </Settings.Item>
            </Settings.Group>
          </Settings.Section>
        </Settings.Root>
      </ScrollView>
    </React.Fragment>
  );
}

export default SettingsV1;
