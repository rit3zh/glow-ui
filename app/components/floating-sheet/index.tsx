import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Pressable,
  Button,
} from "react-native";
import React, { useState } from "react";
import { FloatingSheet, SeekBar } from "@/components/index";
import { Ionicons } from "@expo/vector-icons";
import { SymbolView } from "expo-symbols";
import { GestureHandlerRootView } from "react-native-gesture-handler";
const FloatingSheetDemo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState<number>(0.1);
  const [isLiked, setIsLiked] = useState(false);
  const [songTitle, setSongTitle] = useState<string>(
    "Levitating (Feat. DaBaby)",
  );
  const [songArtist, setSongArtist] = useState<string>("Dua Lipa");

  const renderMinimizedContent = () => (
    <>
      <View style={styles.collapsedSongTextContainer}>
        <Text style={styles.collapsedSongTitle} numberOfLines={1}>
          {songTitle}
        </Text>
        <Text style={styles.collapsedSongArtist} numberOfLines={1}>
          {songArtist}
        </Text>
      </View>
      <TouchableOpacity onPress={() => {}} style={styles.collapsedPlayButton}>
        <Ionicons name={isPlaying ? "pause" : "play"} size={20} color="white" />
      </TouchableOpacity>
    </>
  );

  const renderMaximizedContent = () => (
    <>
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{songTitle}</Text>
        <Text style={styles.songArtist}>{songArtist}</Text>
      </View>
      <View style={styles.progressContainer}>
        <View className="items-center mb-3">
          <SeekBar
            value={0.4}
            onValueChange={(val) => {}}
            width={380}
            height={8}
            activeHeight={12}
            tapToSeek={false}
          />
        </View>
        <View style={styles.timeInfo}>
          <Text style={styles.timeText}>1:30</Text>
          <Text style={styles.timeText}>3:45</Text>
        </View>
      </View>

      <View style={styles.controlsRow}>
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="shuffle" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="play-skip-back" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.playPauseButton} onPress={() => {}}>
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={30}
            color="white"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="play-skip-forward" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="repeat" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.additionalControls}>
        <TouchableOpacity style={styles.additionalButton}>
          <Ionicons name="heart-outline" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.additionalButton}>
          <Ionicons name="share-outline" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.additionalButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View
        style={{
          marginTop: 40,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <SymbolView
          name="speaker.1.fill"
          resizeMode="scaleAspectFit"
          tintColor={"gray"}
          style={{
            width: 20,
            height: 20,
            marginRight: 10,
          }}
        />
        <SeekBar
          value={0.3}
          onValueChange={() => {}}
          height={4}
          activeHeight={8}
          tapToSeek={false}
        />
        <SymbolView
          name="speaker.wave.2.fill"
          resizeMode="scaleAspectFit"
          tintColor={"gray"}
          style={{
            width: 20,
            height: 20,
            marginLeft: 10,
          }}
        />
      </View>
      <View style={styles.minimizeButtonContainer}>
        <Pressable>
          <SymbolView
            name="button.angledbottom.horizontal.left"
            resizeMode="scaleAspectFit"
            tintColor={"gray"}
            style={{
              width: 20,
              height: 20,
            }}
          />
        </Pressable>
      </View>
    </>
  );
  const { height } = Dimensions.get("window");
  const [isSheetPresented, setIsSheetPresented] = useState<boolean>(false);
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <GestureHandlerRootView className="flex-1 items-center justify-center">
        <Button
          title="Show Sheet"
          touchSoundDisabled={true}
          accessibilityLabel="Opens a floating sheet with music controls"
          accessibilityState={{
            busy: isSheetPresented,
            expanded: isSheetPresented,
            disabled: false,
            checked: false,
            selected: false,
          }}
          onPress={() => setIsSheetPresented(true)}
          color={"white"}
        />

        <FloatingSheet
          onSheetDismiss={() => setIsSheetPresented(false)}
          image={{
            uri: "https://i.scdn.co/image/ab67616d0000b2734bc66095f8a70bc4e6593f4f",
          }}
          isPresented={isSheetPresented}
          showImageWhenExpanded={true}
          // customImageAnimation={(animation, defaults) => ({
          //   transform: [
          //     {
          //       scale: animation?.interpolate({
          //         inputRange: [80, height * 0.1],
          //         outputRange: [0.7, 0.8],
          //         extrapolate: "clamp",
          //       }),
          //     },
          //     {
          //       rotate: animation?.interpolate({
          //         inputRange: [85, height * 0.9],
          //         outputRange: ["0deg", "360deg"],
          //         extrapolate: "clamp",
          //       }),
          //     },
          //   ],
          //   width: defaults?.width,
          //   height: defaults?.height,
          // })}
          renderMinimizedContent={renderMinimizedContent}
          renderMaximizedContent={renderMaximizedContent}
        />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default FloatingSheetDemo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sheetContent: {
    position: "relative",
    minHeight: Dimensions.get("window").height,
  },
  mediaContent: {
    position: "relative",
  },
  coverImage: {
    zIndex: 10,
  },
  gradient: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "absolute",
  },
  musicControls: {
    position: "absolute",
    top: Dimensions.get("window").height * 0.4_99,
    left: 0,
    right: 0,
    padding: 20,
  },
  songInfo: {
    marginBottom: 30,
    alignItems: "center",
  },
  songTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  songArtist: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 18,
    marginTop: 5,
    textAlign: "center",
  },
  progressContainer: {
    marginBottom: 20,
  },
  timeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  timeText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: 30,
  },
  controlButton: {
    padding: 10,
  },
  playPauseButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  additionalControls: {
    flexDirection: "row",
    justifyContent: "center",
  },
  additionalButton: {
    marginHorizontal: 25,
  },
  minimizeButtonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  newContent: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    backgroundColor: "rgba(25, 20, 20, 1)",
  },
  newContentTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 60,
  },
  playlistItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 10,
  },
  playlistItemImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  playlistItemInfo: {
    flex: 1,
    marginLeft: 15,
  },
  playlistItemTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  playlistItemArtist: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
  },
  playlistItemButton: {
    padding: 5,
  },
  minimizedControls: {
    position: "absolute",
    top: 20,
    left: 80,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  minimizedTitle: {
    flex: 1,
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  minimizedPlayButton: {
    marginHorizontal: 15,
  },
  expandButton: {
    padding: 5,
  },
  collapsedSongInfo: {
    position: "absolute",
    top: 20,
    left: 80,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    zIndex: 5,
  },
  collapsedSongTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  collapsedSongTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  collapsedSongArtist: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
  },
  collapsedPlayButton: {
    padding: 8,
    marginRight: 10,
  },
});
