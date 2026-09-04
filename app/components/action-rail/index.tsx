import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { ActionRail } from "@/components";
import { Showcase } from "~/showcase";

const icon =
  (name: React.ComponentProps<typeof Feather>["name"]) =>
  ({ color, size }: { color: string; size: number }) => (
    <Feather name={name} size={size} color={color} />
  );

const GLYPH_SPRING = { damping: 16, stiffness: 220, mass: 0.6 };
const GLYPH_MIN_SCALE = 0.25;
const TriggerIcon: React.FC<{
  expanded: boolean;
  color: string;
  size: number;
}> = ({ expanded, color, size }) => {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue<number>(expanded ? 1 : 0);

  useEffect(() => {
    const target = expanded ? 1 : 0;
    progress.value = reduceMotion ? target : withSpring(target, GLYPH_SPRING);
  }, [expanded, reduceMotion, progress]);

  const moreStyle = useAnimatedStyle(() => {
    const shown = 1 - progress.value;
    return {
      opacity: shown,
      transform: [
        { scale: GLYPH_MIN_SCALE + (1 - GLYPH_MIN_SCALE) * shown },
        { rotate: `${progress.value * 90}deg` },
      ],
    };
  });

  const closeStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { scale: GLYPH_MIN_SCALE + (1 - GLYPH_MIN_SCALE) * progress.value },
      { rotate: `${(progress.value - 1) * 90}deg` },
    ],
  }));

  return (
    <View style={[styles.glyph, { width: size, height: size }]}>
      <Animated.View style={[styles.glyphLayer, moreStyle]}>
        <Feather name="more-vertical" size={size} color={color} />
      </Animated.View>
      <Animated.View style={[styles.glyphLayer, closeStyle]}>
        <Feather name="x" size={size} color={color} />
      </Animated.View>
    </View>
  );
};

export default function ActionRailScreen() {
  return (
    <Showcase>
      <View style={styles.center}>
        <View>
          <ActionRail theme="dark" collapseOnAction>
            <ActionRail.Group>
              <ActionRail.Action value="like">
                <ActionRail.Icon>{icon("heart")}</ActionRail.Icon>
                <ActionRail.Label>Like</ActionRail.Label>
              </ActionRail.Action>
              <ActionRail.Action value="share">
                <ActionRail.Icon>{icon("share-2")}</ActionRail.Icon>
                <ActionRail.Label>Share</ActionRail.Label>
              </ActionRail.Action>
            </ActionRail.Group>

            <ActionRail.Overflow>
              <ActionRail.Action value="save">
                <ActionRail.Icon>{icon("bookmark")}</ActionRail.Icon>
              </ActionRail.Action>
              <ActionRail.Action value="copy">
                <ActionRail.Icon>{icon("link")}</ActionRail.Icon>
              </ActionRail.Action>
              <ActionRail.Action value="report" disabled>
                <ActionRail.Icon>{icon("flag")}</ActionRail.Icon>
              </ActionRail.Action>
            </ActionRail.Overflow>

            <ActionRail.Trigger>
              {({ expanded, color, size }) => (
                <TriggerIcon expanded={expanded} color={color} size={size} />
              )}
            </ActionRail.Trigger>
          </ActionRail>
        </View>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  glyph: {
    alignItems: "center",
    justifyContent: "center",
  },
  glyphLayer: {
    ...(StyleSheet.absoluteFill as any),
    alignItems: "center",
    justifyContent: "center",
  },
});
