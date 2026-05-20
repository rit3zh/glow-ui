import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, Text, LayoutAnimation } from "react-native";
import { GiftedChat, IMessage, Bubble } from "react-native-gifted-chat";
import { StreamingText } from "./streaming-text";
import { useHeaderHeight } from "@react-navigation/elements";
import { InputBar } from "./input-bar";
import { useResponsive } from "@/helpers/hooks/use-responsive";
import { useFonts } from "expo-font";
import { IChipOption } from "./types";
import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome,
} from "@expo/vector-icons";
import { EmptyChipGrid } from "./empty-chat-options";
import { ChatHeader } from "./header";

const FAST_LAYOUT_ANIMATION = {
  duration: 900,
  create: {
    type: LayoutAnimation.Types.easeOut,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    type: LayoutAnimation.Types.easeOut,
  },
  delete: {
    type: LayoutAnimation.Types.easeOut,
    property: LayoutAnimation.Properties.opacity,
  },
};

const BOT_REPLIES = [
  "That's an interesting thought! Let me think about that for a moment... I believe the best approach would be to break it down step by step.",
  "Great question! Here's what I think — there are multiple ways to look at this, and each has its own merit.",
  "I'd be happy to help with that! Let me walk you through the process so it's clear and easy to follow.",
  "Hmm, that's a good point. From my perspective, the key thing to consider here is the overall context.",
  "Sure thing! Here's a quick summary of what I found that might be useful for you.",
];

export default function ChatV1() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [streamingIds, setStreamingIds] = useState<Set<string>>(new Set());
  const headerHeight = useHeaderHeight();
  const screen = useResponsive();

  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
  });

  const handleStreamComplete = useCallback((id: string) => {
    setStreamingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const onSend = useCallback((msgs: IMessage[]) => {
    LayoutAnimation.configureNext(FAST_LAYOUT_ANIMATION);
    setMessages((prev) => GiftedChat.append(prev, msgs));

    const botId = Math.random().toString(36).substring(7);
    const botReply: IMessage = {
      _id: botId,
      text: BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)],
      createdAt: new Date(),
      user: { _id: 2, name: "AI" },
    };

    setStreamingIds((prev) => new Set(prev).add(botId));

    setTimeout(() => {
      setMessages((prev) => GiftedChat.append(prev, [botReply]));
    }, 400);
  }, []);

  useEffect(() => {
    setMessages([]);
  }, []);
  const CHIP_OPTIONS: IChipOption[] = [
    {
      text: "Surprise me",
      icon: (
        <MaterialCommunityIcons name="party-popper" size={18} color="#E5E5E5" />
      ),
      onPress: () =>
        onSend([
          {
            _id: Math.random().toString(36).substring(7),
            text: "Here's a surprise message for you! 🎉",
            createdAt: new Date(),
            user: {
              _id: 1,
            },
          },
        ]),
    },
    {
      text: "Transform image",
      icon: <Ionicons name="image-outline" size={18} color="#E5E5E5" />,
      onPress: () =>
        onSend([
          {
            _id: Math.random().toString(36).substring(7),
            text: "Here's an image transformation message for you! 🖼️",
            createdAt: new Date(),
            user: {
              _id: 1,
            },
          },
        ]),
    },
    {
      text: "Learn maths",
      icon: <FontAwesome name="balance-scale" size={16} color="#E5E5E5" />,
      onPress: () =>
        onSend([
          {
            _id: Math.random().toString(36).substring(7),
            text: "Here's a maths lesson for you! 📚",
            createdAt: new Date(),
            user: {
              _id: 1,
            },
          },
        ]),
    },
    {
      text: "Learn coding",
      icon: <Ionicons name="code-slash-outline" size={18} color="#E5E5E5" />,
      onPress: () =>
        onSend([
          {
            _id: Math.random().toString(36).substring(7),
            text: "Here's a coding lesson for you! 💻",
            createdAt: new Date(),
            user: {
              _id: 1,
            },
          },
        ]),
    },
  ];

  return (
    <View style={styles.container}>
      <ChatHeader />
      <GiftedChat
        messages={messages}
        renderMessageText={(props) => {
          const msg = props.currentMessage;
          if (msg && msg.user._id === 2 && streamingIds.has(String(msg._id))) {
            return (
              <View style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
                <StreamingText
                  text={msg.text}
                  style={{ color: "#E5E5E5", fontSize: 15 }}
                  onComplete={() => handleStreamComplete(String(msg._id))}
                />
              </View>
            );
          }
          return (
            <View style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
              <Text
                style={{
                  color: msg?.user._id === 1 ? "#fff" : "#E5E5E5",
                  fontSize: 15,
                }}
              >
                {msg?.text}
              </Text>
            </View>
          );
        }}
        renderTime={() => <></>}
        isAvatarVisibleForEveryMessage={false}
        isUserAvatarVisible={false}
        renderAvatar={() => <></>}
        renderBubble={(messageBubbleProps) => {
          return (
            <Bubble
              {...messageBubbleProps}
              containerStyle={{
                right: {
                  paddingRight: 20,
                },
                left: {
                  paddingLeft: 0,
                },
              }}
              wrapperStyle={{
                right: {
                  backgroundColor: "#242424",
                },
                left: {
                  backgroundColor: "transparent",
                },
              }}
            />
          );
        }}
        onSend={(messages) => onSend(messages as any)}
        user={{ _id: 1 }}
        renderInputToolbar={() => (
          <InputBar
            onSend={(message: Required<string>) => {
              LayoutAnimation.configureNext(FAST_LAYOUT_ANIMATION);
              onSend([
                {
                  _id: Math.random().toString(36).substring(7),
                  text: message,
                  createdAt: new Date(),
                  user: {
                    _id: 1,
                  },
                },
              ]);
            }}
          />
        )}
        scrollToBottomOffset={headerHeight}
        renderChatEmpty={() => (
          <>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                height: screen.rv({
                  compact: screen.height - headerHeight - 50,
                  nano: screen.height - headerHeight - 50,
                  medium: screen.height - headerHeight - 50,
                  expanded: screen.height * 0.7,
                }),
              }}
            >
              <View style={{ alignItems: "center", gap: 8 }}>
                <Text
                  style={{
                    fontSize: screen.rf(32),
                    color: "#fff",
                    fontFamily: fontLoaded ? "HelveticaNowDisplay" : undefined,
                  }}
                >
                  👋 Hello, rit3zh
                </Text>
                <Text
                  style={{
                    fontSize: screen.rf(18),
                    color: "#555",
                    fontFamily: fontLoaded ? "SfProRounded" : undefined,
                  }}
                >
                  How can i assist you today?
                </Text>
              </View>
              <View
                style={{
                  marginTop: screen.rf(32),
                  width: "100%",
                  paddingHorizontal: screen.rf(18),
                }}
              >
                <EmptyChipGrid
                  options={CHIP_OPTIONS}
                  columns={2}
                  containerStyle={{
                    paddingHorizontal: screen.rf(28),
                  }}
                  labelStyle={{
                    fontFamily: fontLoaded ? "SfProRounded" : undefined,
                    fontSize: screen.rv({
                      compact: 14,
                      medium: 16,
                      expanded: 18,
                      nano: 12,
                    }),
                  }}
                />
              </View>
            </View>
          </>
        )}
        listProps={{
          inverted: messages.length !== 0,

          contentContainerStyle: {
            paddingTop: screen.rv({
              compact: 10,
              medium: 160,
              expanded: 200,
            }),
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
