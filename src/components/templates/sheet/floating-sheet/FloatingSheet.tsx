import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Dimensions,
  Animated,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { sheetSizes } from "./constants/sizes/sheetSizes";
import { BlurView } from "expo-blur";
import { useVideoPlayer, VideoView } from "expo-video";
import { Ionicons } from "@expo/vector-icons";
import { SeekBar } from "modules/seekbarnative";
import { SymbolView } from "expo-symbols";
import {
  onHandleSizeChange,
  onHandleDragEnd,
  onHandleDragChange,
  onHandleMinimize,
} from "./utils/animation-utils";
import { getValueFromIndex } from "./utils/helpers/getValueFromIndex";
import { dismiss } from "./utils/animation-utils/reference/dismiss";
import { present } from "./utils/animation-utils/reference/present";

const { width, height } = Dimensions.get("window");

const AnimatedBlur = Animated.createAnimatedComponent(BlurView);

const COVER_URL: string = `https://i.scdn.co/image/ab67616d0000b2730c471c36970b9406233842a5`;

const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export const FloatingSheet = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [value, setValue] = useState<number>(0);
  const [sheetPosition, setSheetPosition] = useState<number>(85);
  const sheetRef = useRef<TrueSheet>(null);
  const scrollRef = useRef<ScrollView>(null);
  const animation = useRef(new Animated.Value(0)).current;
  const [isPresented, setIsPresented] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [songTitle, setSongTitle] = useState("SZA - Kill Bill");
  const [songArtist, setSongArtist] = useState("SOS");
  const [isScrollEnabled, setIsScrollEnabled] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const minimizeAnimation = useRef(new Animated.Value(0)).current;

  const animatedImageSize = animation.interpolate({
    inputRange: [0, height * 0.5, height * 0.9],
    outputRange: [20, 250, 400],
    extrapolate: "clamp",
  });

  const animatedVideoSize = animation.interpolate({
    inputRange: [2, height * 0.5],
    outputRange: [50, 450],
    extrapolate: "clamp",
  });

  const animatedVideoInitialMargin = animation.interpolate({
    inputRange: [5, height * 0.8],
    outputRange: [20, 0],
    extrapolate: "clamp",
  });

  const animatedVideoHeight = animation.interpolate({
    inputRange: [40, height * 0.9],
    outputRange: [10, height],
    extrapolate: "clamp",
  });

  const animatedMarginTop = animation.interpolate({
    inputRange: [85, height * 0.8, height * 0.9],
    outputRange: [0, 18, 20],
    extrapolate: "clamp",
  });

  const animatedMarginLeft = animation.interpolate({
    inputRange: [85, height * 0.8, height * 0.9],
    outputRange: [0, 18, 15],
    extrapolate: "clamp",
  });

  const animatedBorderRadius = animation.interpolate({
    inputRange: [85, height * 0.9],
    outputRange: [10, 20],
    extrapolate: "clamp",
  });

  const animatedBackgroundColor = animation.interpolate({
    inputRange: [85, height * 0.9],
    outputRange: ["rgb(255, 82, 82)", "rgb(76, 175, 80)"],
    extrapolate: "clamp",
  });

  const coverOpacity = animation.interpolate({
    inputRange: [85, height * 0.3, height * 0.5],
    outputRange: [1, 0.7, 0],
    extrapolate: "clamp",
  });

  const videoOpacity = animation.interpolate({
    inputRange: [85, height * 0.3, height * 0.5],
    outputRange: [0, 0.5, 1],
    extrapolate: "clamp",
  });

  const isFullyOpened = animation.interpolate({
    inputRange: [height * 0.89, height * 0.9],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const controlsOpacity = Animated.multiply(
    animation.interpolate({
      inputRange: [85, height * 0.3, height * 0.9],
      outputRange: [0.3, 0.5, 1],
      extrapolate: "clamp",
    }),
    minimizeAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
      extrapolate: "clamp",
    })
  );

  const animatedBlurIntensity = animation.interpolate({
    inputRange: [
      85,
      85 + (height * 0.9 - 85) * 0.15,
      85 + (height * 0.9 - 85) * 0.5,
      85 + (height * 0.9 - 85) * 0.85,
      height * 0.9,
    ],
    outputRange: [0, 10, 15, 10, 0],
    extrapolate: "clamp",
  });

  const newContentOpacity = minimizeAnimation.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [0, 0.5, 1],
    extrapolate: "clamp",
  });

  const newContentTranslateY = minimizeAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
    extrapolate: "clamp",
  });

  useEffect(() => {
    if (!isExpanded) {
      setIsMinimized(false);
    }
  }, [isExpanded]);
  useEffect(() => {
    const listenerId = animation.addListener(({ value }) => {
      if (value >= sheetSizes[1] - 10) {
        setIsScrollEnabled(true);
      } else {
        setIsScrollEnabled(false);
      }
    });

    return () => {
      animation.removeListener(listenerId);
    };
  }, []);
  const presentSheet = async () => {
    try {
      if (sheetRef.current) {
        await sheetRef.current.present();
        setIsPresented(true);
      }
    } catch (error) {
      console.log("Error presenting sheet:", error);
    }
  };

  const videoSource = useVideoPlayer(
    require("@/assets/video/sza.mp4"),
    (player) => {
      player.loop = true;
      player.volume = 0;
      player.play();
    }
  );

  const togglePlayPause = () => {
    if (isPlaying) {
      videoSource.pause();
    } else {
      videoSource.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <View style={styles.container}>
      <Button
        onPress={presentSheet}
        title="Present Sheet"
        disabled={isPresented}
      />

      <TrueSheet
        ref={sheetRef}
        sizes={sheetSizes}
        blurTint="dark"
        cornerRadius={20}
        collapsable={false}
        dismissible={true}
        onPresent={(e) =>
          present({
            animation,
            setIsPresented,
            isMinimized,
            getValueFromIndex: (index) =>
              getValueFromIndex({ index, sheetSizes }),
            event: e,
          })
        }
        onDragChange={(e) =>
          onHandleDragChange({
            event: e,
            animation,
            isMinimized,
            setIsExpanded,
          })
        }
        onSizeChange={(e) =>
          onHandleSizeChange({
            event: e,
            animation,
            isMinimized,
            setIsExpanded,
            setSheetPosition,
            sheetSizes,
          })
        }
        onDragEnd={(e) =>
          onHandleDragEnd({
            event: e,
            animation,
            setIsExpanded,
            setSheetPosition,
            isMinimized,
            sheetSizes,
          })
        }
        scrollRef={scrollRef}
        onDismiss={() =>
          dismiss({
            animation,
            minimizeAnimation,
            setIsPresented,
            setIsMinimized,
            setSheetPosition,
          })
        }
        initialIndexAnimated={true}
        style={{ flex: 1 }}
        contentContainerStyle={{ flex: 1 }}
      >
        <AnimatedScrollView
          ref={scrollRef}
          scrollEnabled={isScrollEnabled}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={styles.sheetContent}>
            <Animated.View style={{ position: "relative" }}>
              <AnimatedImage
                source={{ uri: COVER_URL }}
                style={[
                  styles.coverImage,
                  {
                    width: animatedImageSize,
                    height: animatedImageSize,
                    borderRadius: animatedBorderRadius,
                    // opacity: coverOpacity,
                    position: "absolute",
                    top: animatedVideoInitialMargin,
                    left: animatedVideoInitialMargin,
                    marginTop: animatedMarginTop,
                    marginLeft: animatedMarginLeft,
                  },
                ]}
                resizeMode="cover"
              />

              <Animated.View
                style={[
                  styles.newContent,
                  {
                    opacity: newContentOpacity,
                    transform: [{ translateY: newContentTranslateY }],
                    display: isMinimized ? "flex" : "none",
                  },
                ]}
              >
                <Text style={styles.newContentTitle}>Next Up</Text>

                <View style={styles.playlistItem}>
                  <Image
                    source={{
                      uri: "https://i.scdn.co/image/ab67616d0000b273b89175b369cf61d4d1b4f093",
                    }}
                    style={styles.playlistItemImage}
                  />
                  <View style={styles.playlistItemInfo}>
                    <Text style={styles.playlistItemTitle}>Snooze</Text>
                    <Text style={styles.playlistItemArtist}>SZA</Text>
                  </View>
                  <TouchableOpacity style={styles.playlistItemButton}>
                    <Ionicons
                      name="ellipsis-horizontal"
                      size={24}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.playlistItem}>
                  <Image
                    source={{
                      uri: "https://i.scdn.co/image/ab67616d0000b273b89175b369cf61d4d1b4f093",
                    }}
                    style={styles.playlistItemImage}
                  />
                  <View style={styles.playlistItemInfo}>
                    <Text style={styles.playlistItemTitle}>Nobody Gets Me</Text>
                    <Text style={styles.playlistItemArtist}>SZA</Text>
                  </View>
                  <TouchableOpacity style={styles.playlistItemButton}>
                    <Ionicons
                      name="ellipsis-horizontal"
                      size={24}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.playlistItem}>
                  <Image
                    source={{
                      uri: "https://i.scdn.co/image/ab67616d0000b273b89175b369cf61d4d1b4f093",
                    }}
                    style={styles.playlistItemImage}
                  />
                  <View style={styles.playlistItemInfo}>
                    <Text style={styles.playlistItemTitle}>Blind</Text>
                    <Text style={styles.playlistItemArtist}>SZA</Text>
                  </View>
                  <TouchableOpacity style={styles.playlistItemButton}>
                    <Ionicons
                      name="ellipsis-horizontal"
                      size={24}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              </Animated.View>

              <Animated.View
                style={[
                  styles.musicControls,
                  {
                    opacity: controlsOpacity,
                    position: "absolute",
                    transform: [
                      {
                        translateY: animation.interpolate({
                          inputRange: [85, height * 0.9],
                          outputRange: [50, 0],
                          extrapolate: "clamp",
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.songInfo}>
                  <Text style={styles.songTitle}>{songTitle}</Text>
                  <Text style={styles.songArtist}>{songArtist}</Text>
                </View>

                <View style={styles.progressContainer}>
                  <SeekBar
                    value={value}
                    onValueChange={(newValue) => setValue(newValue)}
                    frame={{
                      width: width - 40,
                      height: 12,
                    }}
                  />
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

                  <TouchableOpacity
                    style={styles.playPauseButton}
                    onPress={togglePlayPause}
                  >
                    <Ionicons
                      name={isPlaying ? "pause" : "play"}
                      size={30}
                      color="white"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.controlButton}>
                    <Ionicons
                      name="play-skip-forward"
                      size={24}
                      color="white"
                    />
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
                    <Ionicons
                      name="ellipsis-horizontal"
                      size={24}
                      color="white"
                    />
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
                    value={value}
                    onValueChange={(newValue) => setValue(newValue)}
                    frame={{
                      width: width - 100,
                      height: 9,
                    }}
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
                  <Pressable
                    onPress={() =>
                      onHandleMinimize({
                        animation,
                        setIsMinimized,
                        isMinimized,
                        height,
                        setSheetPosition,
                      })
                    }
                  >
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
              </Animated.View>

              {isMinimized && (
                <Animated.View
                  style={[
                    styles.minimizedControls,
                    {
                      opacity: newContentOpacity,
                    },
                  ]}
                >
                  <Text style={styles.minimizedTitle} numberOfLines={1}>
                    {songTitle}
                  </Text>
                  <TouchableOpacity
                    onPress={togglePlayPause}
                    style={styles.minimizedPlayButton}
                  >
                    <Ionicons
                      name={isPlaying ? "pause" : "play"}
                      size={24}
                      color="white"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      onHandleMinimize({
                        animation,
                        setIsMinimized,
                        isMinimized,
                        height,
                        setSheetPosition,
                      })
                    }
                    style={styles.expandButton}
                  >
                    <Ionicons name="chevron-up" size={24} color="white" />
                  </TouchableOpacity>
                </Animated.View>
              )}

              <Animated.View
                style={{
                  position: "absolute",
                  top: 10,
                  left: 20,
                  width: animatedImageSize,
                  height: animatedImageSize,
                  borderRadius: animatedBorderRadius,
                  overflow: "hidden",
                  opacity: coverOpacity,
                }}
              >
                <AnimatedBlur
                  intensity={animatedBlurIntensity}
                  tint={"systemUltraThinMaterialDark"}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                />
              </Animated.View>
            </Animated.View>
          </Animated.View>
        </AnimatedScrollView>
      </TrueSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sheetContent: {
    position: "relative",
    minHeight: height,
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
    top: height * 0.4_99,
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
    backgroundColor: "red",
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
});
