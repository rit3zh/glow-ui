import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Dimensions,
  Animated,
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

const { width, height } = Dimensions.get("window");

const AnimatedBlur = Animated.createAnimatedComponent(BlurView);

const IMAGE_URL: string = `https://m.media-amazon.com/images/I/81-SxZnlDXL._UF1000,1000_QL80_.jpg`;

const AnimatedVideo = Animated.createAnimatedComponent(VideoView);

export const FloatingSheet = () => {
  const sheetRef = useRef<TrueSheet>(null);

  const animation = useRef(new Animated.Value(0)).current;

  const [isPresented, setIsPresented] = useState(false);

  const sheetSizes = [85, height * 0.9];

  const animatedImageSize = animation.interpolate({
    inputRange: [0, height * 0.5, height * 0.9],
    outputRange: [50, 250, 400],
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
    inputRange: [85, height * 0.9],
    outputRange: [0, 30],
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

  // Blur intensity animation - increases during transition and decreases at endpoints
  const animatedBlurIntensity = animation.interpolate({
    inputRange: [
      85,
      85 + (height * 0.9 - 85) * 0.15, // 15% into the transition
      85 + (height * 0.9 - 85) * 0.5, // Middle of transition (max blur)
      85 + (height * 0.9 - 85) * 0.85, // 85% into the transition
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
        dismissible={false}
        onPresent={handlePresent}
        onDragChange={handleDragChange}
        onSizeChange={handleSizeChange}
        onDragEnd={handleDragEnd}
        onDismiss={handleDismiss}
        initialIndexAnimated={true}
      >
        {/* <LinearGradient
          colors={["transparent", "rgba(0,0,0,5)"]}
          style={{
            position: "absolute",
            width: width,
            height: height + 10,
            top: 0,
          }}
        /> */}

        <Animated.View
          style={[
            styles.sheetContent,
            {
              // marginTop: animatedMarginTop
            },
          ]}
        >
          <Animated.View
            style={{
              position: "relative",
            }}
          >
            <AnimatedVideo
              style={[
                styles.animatedBox,
                {
                  width: animatedVideoSize,
                  height: animatedVideoHeight,
                  borderRadius: animatedBorderRadius,
                  // backgroundColor: animatedBackgroundColor,
                  // marginLeft: 20,
                  // marginTop: 10,
                  margin: animatedVideoInitialMargin,
                },
              ]}
              contentFit="cover"
              player={videoSource}
              nativeControls={false}
              allowsPictureInPicture={false}
              startsPictureInPictureAutomatically={false}
              onPictureInPictureStart={() => alert("Helo")}
            />
            {/* <Animated.Image
              style={[
                styles.animatedBox,
                {
                  width: animatedImageSize,
                  height: animatedImageSize,
                  borderRadius: animatedBorderRadius,
                  backgroundColor: animatedBackgroundColor,
                  marginLeft: 20,
                  marginTop: 10,
                },
              ]}
              source={{
                uri: "https://m.media-amazon.com/images/I/81Ia466fcoL._UF1000,1000_QL80_.jpg",
              }}
            /> */}
            <Animated.View
              style={{
                position: "absolute",
                top: 10,
                left: 20,
                width: animatedImageSize,
                height: animatedImageSize,
                borderRadius: animatedBorderRadius,
                overflow: "hidden",
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
  sheetContent: {},
  animatedBox: {},
});
