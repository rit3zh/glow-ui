import "./global.css";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  useWindowDimensions,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";

import {
  AnimatedScrollView,
  AnimatedScrollViewTitle,
  AnimatedScrollViewTitleWrapper,
  HeaderComponentWrapper,
} from "@/components/templates/headers/parallax/index";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { HeaderNavBar } from "@/components/templates/headers/parallax/helpers/header/HeaderNavBar";
import { SymbolView } from "expo-symbols";
import { Avatar, Center, Row } from "@/components";
import { MediaList } from "@/components/templates/media-list";
// import { randomSongs } from "./songs";
import { MediaListTitle } from "@/components/templates/media-list/children/MediaListTitle";
import { MediaListTitleWrapper } from "@/components/templates/media-list/children/MediaListTitleWrapper";
import { MediaListSubTitle } from "@/components/templates/media-list/children/MediaListSubtitle";

const ALBUM_COVER = {
  uri: "https://i.scdn.co/image/ab67616d0000b273af5fa7cc499fbcf4923b5cba",
};
const ALBUM_BACKGROUND = {
  uri: "https://www.hollywoodreporter.com/wp-content/uploads/2017/02/eminem_-_getty_-_h_2017.jpg?w=1296&h=730&crop=1",
};

export const App = () => {
  const videoSource = useVideoPlayer(
    require("@/assets/video/video-artist.mp4"),
    (player) => {
      player.loop = true;
      player.volume = 0;
      player.play();
    }
  );

  const { isPlaying, oldIsPlaying } = useEvent(videoSource, "playingChange", {
    isPlaying: videoSource.playing,
    oldIsPlaying: videoSource.playing,
  });

  const { width, height } = useWindowDimensions();

  const songs = Array(20)
    .fill(0)
    .map((_, i) => ({
      id: i,
      title: `Track ${i + 1}`,
      duration: `${3 + Math.floor(Math.random() * 3)}:${Math.floor(
        Math.random() * 59
      )
        .toString()
        .padStart(2, "0")}`,
      liked: Math.random() > 0.5,
    }));

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "black",
      }}
    >
      <AnimatedScrollView
        renderHeaderNavBarComponent={() => <></>}
        renderTopNavBarComponent={() => (
          <>
            <HeaderNavBar>
              <SymbolView
                name="chevron.backward"
                size={18}
                tintColor={"white"}
              />
              <Text className="text-white text-xl font-semibold">Dua Lipa</Text>
              <></>
            </HeaderNavBar>
          </>
        )}
        renderOveralComponent={() => (
          <>
            <AnimatedScrollViewTitleWrapper>
              <AnimatedScrollViewTitle size={40}>
                Dua Lipa
              </AnimatedScrollViewTitle>
            </AnimatedScrollViewTitleWrapper>

            <TouchableOpacity className="">
              <View
                className="bg-red-500 rounded-full items-center justify-center"
                style={{
                  height: 50,
                  width: 50,
                  position: "absolute",
                  right: 10,
                  bottom: 3,
                }}
              >
                <SymbolView name="play.fill" tintColor={"white"} size={19} />
              </View>
            </TouchableOpacity>
          </>
        )}
        topBarHeight={100}
        renderHeaderComponent={() => (
          <HeaderComponentWrapper useGradient={false}>
            <VideoView
              style={{
                width: width,
                height: 400,
              }}
              contentFit="cover"
              player={videoSource}
              nativeControls={false}
              allowsPictureInPicture={false}
              startsPictureInPictureAutomatically={false}
              onPictureInPictureStart={() => alert("Helo")}
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,5)"]}
              style={{
                position: "absolute",
                width: width,
                height: 400,
                top: 0,
              }}
            />
          </HeaderComponentWrapper>
        )}
      >
        <>
          <MediaListTitleWrapper>
            <Avatar
              image={{
                uri: "https://i.scdn.co/image/ab6761610000e5eb0c68f6c95232e716f0abee8d",
              }}
            />
            <MediaListTitle>Top Songs</MediaListTitle>
            <MediaListSubTitle>
              The best trending songs of Dua Lipa
            </MediaListSubTitle>
          </MediaListTitleWrapper>

          {Array.from({ length: 20 }).map((_, i) => (
            <View
              key={i}
              style={{
                width: width - 40,
                height: 60,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                padding: 20,
                borderRadius: 10,
              }}
            >
              <Text>hey</Text>
            </View>
          ))}
        </>
      </AnimatedScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {},
  songRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  songNumberContainer: {
    width: 30,
    alignItems: "center",
  },
  songNumber: {
    color: "#AAAAAA",
    fontSize: 16,
  },
  songInfo: {
    flex: 1,
    marginLeft: 12,
  },
  songTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  songArtist: {
    color: "#AAAAAA",
    fontSize: 14,
    marginTop: 4,
  },
  songActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeIcon: {
    marginRight: 16,
  },
  songDuration: {
    color: "#AAAAAA",
    fontSize: 14,
    marginRight: 16,
  },
});

export default App;
