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
import { useVideoPlayer } from "expo-video";
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
import { IFloatingPlayerProps } from "./types/FloatingPlayer.types";
const { width, height } = Dimensions.get("window");

const AnimatedBlur = Animated.createAnimatedComponent(BlurView);

const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export const FloatingSheet: React.FC<IFloatingPlayerProps> = ({
  renderMaximizedContent,
  renderMinimizedContent,
  image,
  isPresented: _isPresentedSheet = false,
  showImageWhenExpanded = true,
  customImageAnimation,
  onSheetDismiss,
}: IFloatingPlayerProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [value, setValue] = useState<number>(0);
  const [_, setSheetPosition] = useState<number>(85);
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

  useEffect(() => {
    if (_isPresentedSheet) {
      presentSheet();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [_isPresentedSheet]);

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
      inputRange: [0, 0.1],
      outputRange: [1, 0],
      extrapolate: "clamp",
    }),
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
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0.8, 1],
    extrapolate: "clamp",
  });

  const newContentTranslateY = minimizeAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
    extrapolate: "clamp",
  });

  const collapsedSongInfoOpacity = animation.interpolate({
    inputRange: [85, height * 0.2, height * 0.4],
    outputRange: [1, 0.8, 0],
    extrapolate: "clamp",
  });

  const collapsedSongInfoTranslateY = animation.interpolate({
    inputRange: [85, height * 0.3],
    outputRange: [0, -20],
    extrapolate: "clamp",
  });

  const imageOpacity = animation.interpolate({
    inputRange: [85, height * 0.5, height * 0.9],
    outputRange: [
      1,
      showImageWhenExpanded ? 0.8 : 0,
      showImageWhenExpanded ? 1 : 0,
    ],
    extrapolate: "clamp",
  });

  const defaultImageAnimations = {
    width: animatedImageSize,
    height: animatedImageSize,
    borderRadius: animatedBorderRadius,
    position: "absolute" as const,
    top: animatedVideoInitialMargin,
    left: animatedVideoInitialMargin,
    marginTop: animatedMarginTop,
    marginLeft: animatedMarginLeft,
    opacity: imageOpacity,
  };

  const finalImageAnimations = customImageAnimation
    ? {
        ...defaultImageAnimations,
        ...customImageAnimation(animation, {
          width: animatedImageSize,
          height: animatedImageSize,
          borderRadius: animatedBorderRadius,
          marginTop: animatedMarginTop,
          marginLeft: animatedMarginLeft,
          opacity: imageOpacity,
          initialMargin: animatedVideoInitialMargin,
        }),
      }
    : defaultImageAnimations;

  const shouldShowImage = showImageWhenExpanded || !isExpanded;

  useEffect(() => {
    if (!isExpanded) {
      setIsMinimized(false);

      minimizeAnimation.setValue(0);
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
    },
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
          setIsMinimized,
          sheetSizes,
        })
      }
      onDragEnd={(e) =>
        onHandleDragEnd({
          event: e,
          animation,
          setIsMinimized,
          setIsExpanded,
          setSheetPosition,
          isMinimized,
          sheetSizes,
        })
      }
      scrollRef={scrollRef}
      onDismiss={() => {
        typeof onSheetDismiss !== "undefined" || undefined
          ? onSheetDismiss!()
          : null;
        return dismiss({
          animation,
          minimizeAnimation,
          setIsPresented,
          setIsMinimized,
          setSheetPosition,
        });
      }}
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
            {shouldShowImage && (
              <AnimatedImage
                source={{ ...image }}
                style={[styles.coverImage, finalImageAnimations as any]}
                resizeMode="cover"
              />
            )}

            <Animated.View
              style={[
                styles.collapsedSongInfo,
                {
                  opacity: Animated.multiply(
                    collapsedSongInfoOpacity,
                    minimizeAnimation.interpolate({
                      inputRange: [0, 0.1],
                      outputRange: [1, 0],
                      extrapolate: "clamp",
                    }),
                  ),
                  transform: [{ translateY: collapsedSongInfoTranslateY }],
                  pointerEvents: !isExpanded && !isMinimized ? "auto" : "none",
                },
              ]}
            >
              {typeof renderMinimizedContent !== "undefined" || undefined
                ? renderMinimizedContent!()
                : null}
            </Animated.View>

            <Animated.View
              style={[
                styles.newContent,
                {
                  opacity: newContentOpacity,
                  transform: [{ translateY: newContentTranslateY }],
                  pointerEvents: isMinimized ? "auto" : "none",
                },
              ]}
            >
              <Text style={styles.newContentTitle}>Next Up</Text>

              <View style={styles.playlistItem}>
                <Image
                  source={{
                    ...image,
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
                    ...image,
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
                    ...image,
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
                  pointerEvents: isMinimized ? "none" : "auto",
                },
              ]}
            >
              {typeof renderMaximizedContent !== "undefined" || undefined
                ? renderMaximizedContent!()
                : null}
            </Animated.View>

            <Animated.View
              style={[
                styles.minimizedControls,
                {
                  opacity: newContentOpacity,
                  pointerEvents: isMinimized ? "auto" : "none",
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
                    minimizeAnimation,
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

            {shouldShowImage && (
              <Animated.View
                style={{
                  position: "absolute",
                  top: 10,
                  left: 20,
                  width: animatedImageSize,
                  height: animatedImageSize,
                  borderRadius: animatedBorderRadius,
                  overflow: "hidden",
                  opacity: Animated.multiply(coverOpacity, imageOpacity),
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
            )}
          </Animated.View>
        </Animated.View>
      </AnimatedScrollView>
    </TrueSheet>
  );
};

const styles = StyleSheet.create({
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
