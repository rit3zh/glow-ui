import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as ContextMenu from "@/components/molecules/context-menu";
import { Showcase } from "~/showcase";
import { useFonts } from "expo-font";

const ICON_COLOR = "#ffffff";
const DANGER = "#ff453a";

export default function ContextMenuScreen() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    SfProRoundedBold: require("~/assets/fonts/SF-Pro-Rounded-Bold.otf"),
    SfProRoundedMedium: require("~/assets/fonts/SF-Pro-Rounded-Medium.otf"),
  });

  return (
    <Showcase>
      <View style={styles.center}>
        <ContextMenu.Root theme="dark" menuWidth={250}>
          <ContextMenu.Trigger>
            <View style={styles.card}>
              <Image
                source={{
                  uri: "https://i.pinimg.com/736x/06/70/6b/06706b72f8aa7411e016e3998368fa25.jpg",
                }}
                style={styles.cardImage}
              />
              <View style={styles.cardBody}>
                <Text
                  style={[
                    styles.cardTitle,
                    {
                      fontFamily: fontLoaded ? "SfProRoundedBold" : undefined,
                    },
                  ]}
                >
                  Mountain Retreat
                </Text>
                <Text
                  style={[
                    styles.cardSubtitle,
                    {
                      fontFamily: fontLoaded
                        ? "SfProRoundedRegular"
                        : undefined,
                    },
                  ]}
                >
                  Hold for actions
                </Text>
              </View>
            </View>
          </ContextMenu.Trigger>

          <ContextMenu.Content>
            <ContextMenu.Item
              onPress={() => console.log("Reply")}
              textStyle={{
                fontFamily: fontLoaded ? "SfProRoundedMedium" : undefined,
              }}
            >
              <ContextMenu.Item.Icon>
                <Feather name="corner-up-right" size={20} color={ICON_COLOR} />
              </ContextMenu.Item.Icon>
              Reply
            </ContextMenu.Item>
            <ContextMenu.Item
              onPress={() => console.log("Attach Sticker")}
              textStyle={{
                fontFamily: fontLoaded ? "SfProRoundedMedium" : undefined,
              }}
            >
              <ContextMenu.Item.Icon>
                <Feather name="smile" size={20} color={ICON_COLOR} />
              </ContextMenu.Item.Icon>
              Attach Sticker
            </ContextMenu.Item>

            <ContextMenu.Separator />

            <ContextMenu.Item
              onPress={() => console.log("Copy")}
              textStyle={{
                fontFamily: fontLoaded ? "SfProRoundedMedium" : undefined,
              }}
            >
              <ContextMenu.Item.Icon>
                <Feather name="copy" size={20} color={ICON_COLOR} />
              </ContextMenu.Item.Icon>
              Copy
            </ContextMenu.Item>
            <ContextMenu.Item
              onPress={() => console.log("Translate")}
              textStyle={{
                fontFamily: fontLoaded ? "SfProRoundedMedium" : undefined,
              }}
            >
              <ContextMenu.Item.Icon>
                <Feather name="globe" size={20} color={ICON_COLOR} />
              </ContextMenu.Item.Icon>
              <ContextMenu.Item.Label>
                Translate
                <ContextMenu.Item.Label.Subtitle>
                  Detects language automatically
                </ContextMenu.Item.Label.Subtitle>
              </ContextMenu.Item.Label>
            </ContextMenu.Item>
            <ContextMenu.Item
              onPress={() => console.log("Select")}
              textStyle={{
                fontFamily: fontLoaded ? "SfProRoundedMedium" : undefined,
              }}
            >
              <ContextMenu.Item.Icon>
                <Feather name="crop" size={20} color={ICON_COLOR} />
              </ContextMenu.Item.Icon>
              Select
            </ContextMenu.Item>

            <ContextMenu.Separator />

            <ContextMenu.Item
              destructive
              onPress={() => console.log("Delete")}
              textStyle={{
                fontFamily: fontLoaded ? "SfProRoundedBold" : undefined,
              }}
            >
              <ContextMenu.Item.Icon>
                <Feather name="trash-2" size={20} color={DANGER} />
              </ContextMenu.Item.Icon>
              <ContextMenu.Item.Label>
                Delete
                <ContextMenu.Item.Label.Subtitle>
                  This can&apos;t be undone
                </ContextMenu.Item.Label.Subtitle>
              </ContextMenu.Item.Label>
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Root>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  hint: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
  },
  card: {
    width: 260,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#1c1c1e",
  },
  cardImage: {
    width: "100%",
    height: 150,
  },
  cardBody: {
    padding: 14,
    gap: 2,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 17,
  },
  cardSubtitle: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 13,
  },
});
