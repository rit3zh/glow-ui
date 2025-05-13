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
} from "react-native";
import {
  DragChangeEvent,
  DragEndEvent,
  PresentEvent,
  SizeChangeEvent,
  TrueSheet,
} from "@lodev09/react-native-true-sheet";

import { BlurView } from "expo-blur";
import { useVideoPlayer, VideoView } from "expo-video";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { SeekBar } from "modules/seekbarnative";
import { SymbolView } from "expo-symbols";

const { width, height } = Dimensions.get("window");

const AnimatedBlur = Animated.createAnimatedComponent(BlurView);

const IMAGE_URL: string = `https://m.media-amazon.com/images/I/81-SxZnlDXL._UF1000,1000_QL80_.jpg`;
const COVER_URL: string = `https://i.scdn.co/image/ab67616d0000b2730c471c36970b9406233842a5`;

const AnimatedVideo = Animated.createAnimatedComponent(VideoView);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
export const FloatingSheet = () => {
  const [value, setValue] = useState<number>(0);
  const sheetRef = useRef<TrueSheet>(null);
  const scrollRef = useRef<ScrollView>(null);
  const animation = useRef(new Animated.Value(0)).current;
  const [isPresented, setIsPresented] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [songTitle, setSongTitle] = useState("SZA - Kill Bill");
  const [songArtist, setSongArtist] = useState("SOS");
  const sheetSizes = [85, height * 0.9];

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

  // Cover to video transition animations
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

  // Boolean to track if sheet is fully opened
  const isFullyOpened = animation.interpolate({
    inputRange: [height * 0.89, height * 0.9],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  // Controls visibility animation linked to cover/video transition
  const controlsOpacity = animation.interpolate({
    inputRange: [85, height * 0.3, height * 0.9, height * 0.9],
    outputRange: [0.3, 0.5, 0.8, 1],
    extrapolate: "clamp",
  });

  // Blur intensity animation - increases during transition and decreases at endpoints
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

  // Present the sheet
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

  // Dismiss the sheet
  const dismissSheet = async () => {
    try {
      if (sheetRef.current) {
        await sheetRef.current.dismiss();
        setIsPresented(false);
      }
    } catch (error) {
      console.log("Error dismissing sheet:", error);
    }
  };

  // Handle sheet presentation
  const handlePresent = (e: PresentEvent) => {
    // Get the initial position value from the event
    const initialValue = getValueFromIndex(e.nativeEvent.index);
    setIsPresented(true);

    // Update the animation value with spring animation
    Animated.spring(animation, {
      toValue: initialValue,
      friction: 12, // Increased friction for slower motion
      tension: 25, // Decreased tension for softer feel
      useNativeDriver: false, // Required for color animations
    }).start();
  };

  // Handle drag changes during sheet movement
  const handleDragChange = (e: DragChangeEvent) => {
    // Update animation value directly from the drag event
    animation.setValue(e.nativeEvent.value);
  };

  // Handle size change events (when sheet snaps to a new position)
  const handleSizeChange = (e: SizeChangeEvent) => {
    const newValue = e.nativeEvent.value;

    // Animate to the new position with spring physics
    Animated.spring(animation, {
      toValue: newValue,
      friction: 12,
      tension: 25,
      useNativeDriver: false,
    }).start();
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const endValue = e.nativeEvent.value;

    let closestValue = sheetSizes[0];
    let minDistance = Math.abs(endValue - sheetSizes[0]);

    for (let i = 1; i < sheetSizes.length; i++) {
      const size = sheetSizes[i];
      const distance = Math.abs(endValue - size);

      if (distance < minDistance) {
        minDistance = distance;
        closestValue = size;
      }
    }

    Animated.spring(animation, {
      toValue: closestValue,
      friction: 12,
      tension: 25,
      useNativeDriver: false,
    }).start();
  };

  const handleDismiss = () => {
    setIsPresented(false);

    Animated.timing(animation, {
      toValue: 0,
      duration: 450,
      useNativeDriver: false,
    }).start();
  };

  const getValueFromIndex = (index: number): number => {
    if (index < 0 || index >= sheetSizes.length) {
      return 0;
    }

    const size = sheetSizes[index] as number | string;
    if (typeof size === "number") {
      return size;
    } else if (typeof size === "string" && size?.endsWith("%")) {
      const percentage = parseFloat(size) / 100;
      return height * percentage;
    }
    return height;
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
        onPresent={handlePresent}
        onDragChange={handleDragChange}
        onSizeChange={handleSizeChange}
        onDragEnd={handleDragEnd}
        scrollRef={scrollRef}
        onDismiss={handleDismiss}
        initialIndexAnimated={true}
      >
        <ScrollView
          ref={scrollRef}
          style={{}}
          contentContainerStyle={{}}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={styles.sheetContent}>
            <Animated.View style={{ position: "relative" }}>
              {/* Video component with fade-in animation */}
              {/* <AnimatedVideo
              style={[
                styles.mediaContent,
                {
                  width: animatedVideoSize,
                  height: animatedVideoHeight,
                  borderRadius: animatedBorderRadius,
                  margin: animatedVideoInitialMargin,
                  opacity: videoOpacity, // Fade in the video as player expands
                },
              ]}
              contentFit="cover"
              player={videoSource}
              nativeControls={false}
              allowsPictureInPicture={false}
              startsPictureInPictureAutomatically={false}
            /> */}
              {/* <AnimatedImage
              source={{ uri: COVER_URL }}
              style={[
                styles.coverImage,
                {
                  width: animatedImageSize,
                  height: animatedImageSize,
                  borderRadius: animatedBorderRadius,
                  margin: animatedMarginTop,
                },
              ]}
            /> */}

              {/* Cover image overlay with fade-out animation */}
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
                {/* Song Info */}
                <View style={styles.songInfo}>
                  <Text style={styles.songTitle}>{songTitle}</Text>
                  <Text style={styles.songArtist}>{songArtist}</Text>
                </View>

                {/* Progress Bar */}
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

                {/* Main Controls */}
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

                {/* Additional Controls */}
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
              </Animated.View>

              {/* Animated blur effect */}
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
        </ScrollView>
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
});
