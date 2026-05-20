import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  StatusBar,
  Dimensions,
  Image,
  ImageSourcePropType,
} from "react-native";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import Animated, {
  FadeIn,
  FadeOut,
  FadeInDown,
  FadeInUp,
  ZoomIn,
  ZoomOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { useSiri } from "@/components/organisms/apple-intelligence/context";

const { width } = Dimensions.get("window");
const CARD_W = (width - 50) / 2;

const W04 = "rgba(255,255,255,0.04)";
const W06 = "rgba(255,255,255,0.06)";
const W10 = "rgba(255,255,255,0.10)";
const W20 = "rgba(255,255,255,0.20)";
const W40 = "rgba(255,255,255,0.40)";

const SparkleIcon = ({ size = 15 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
      stroke="white"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </Svg>
);

const BagIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 7H18L17 21H7L6 7Z"
      stroke="white"
      strokeWidth="1.25"
      strokeLinejoin="round"
    />
    <Path
      d="M9 7V5C9 3.34 10.34 2 12 2C13.66 2 15 3.34 15 5V7"
      stroke="white"
      strokeWidth="1.25"
      strokeLinecap="round"
    />
  </Svg>
);

const PlusIcon = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 5V19M5 12H19"
      stroke="#000"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

const ArrowRight = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 12H19M19 12L13 6M19 12L13 18"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const SPLASH_IMAGE = require("../assets/fruits/fruit-water-splash.png");
const HERO_IMAGE = require("../assets/fruits/juice-orange.png");

interface Fruit {
  name: string;
  price: string;
  unit: string;
  weight: string;
  image: ImageSourcePropType;
}

const FRUITS: Fruit[] = [
  {
    name: "Strawberry",
    price: "3.20",
    unit: "punnet",
    weight: "250g",
    image: require("../assets/fruits/strawberry.png"),
  },
  {
    name: "Pineapple",
    price: "4.50",
    unit: "each",
    weight: "900g",
    image: require("../assets/fruits/pineapple.png"),
  },
  {
    name: "Mandarin",
    price: "2.80",
    unit: "bag",
    weight: "1kg",
    image: require("../assets/fruits/Mandarin-Orange.png"),
  },
  {
    name: "Pear",
    price: "1.60",
    unit: "each",
    weight: "180g",
    image: require("../assets/fruits/pear.png"),
  },
];

const TAGS = ["All", "Seasonal", "Organic", "Tropical", "Local"];

const PROMPTS = [
  "What's in season?",
  "Breakfast bowl ideas",
  "Best for juice",
  "Low sugar picks",
];

const PulseDot = ({
  delay = 0,
  color = "#C44AFF",
}: {
  delay?: number;
  color?: string;
}) => {
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.6, { duration: 500, easing: Easing.out(Easing.quad) }),
          withTiming(1, { duration: 500, easing: Easing.in(Easing.quad) }),
        ),
        -1,
        true,
      ),
    );
  }, []);
  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: interpolate(scale.value, [1, 1.6], [0.35, 1]),
  }));
  return (
    <Animated.View
      style={[
        { width: 5, height: 5, borderRadius: 3, backgroundColor: color },
        anim,
      ]}
    />
  );
};

const AIOverlay = ({ onDismiss }: { onDismiss: () => void }) => (
  <Animated.View
    style={s.overlay}
    entering={FadeIn.duration(200)}
    exiting={FadeOut.duration(150)}
  >
    <Pressable style={s.overlayBg} onPress={onDismiss} />
    <Animated.View
      style={s.aiCard}
      entering={ZoomIn.duration(300).easing(Easing.out(Easing.exp))}
      exiting={ZoomOut.duration(200)}
    >
      <Animated.View
        style={s.dotsRow}
        entering={FadeIn.delay(100).duration(250)}
      >
        <PulseDot delay={0} color="#C44AFF" />
        <PulseDot delay={120} color="#FF6B9D" />
        <PulseDot delay={240} color="#FFBA08" />
      </Animated.View>

      <Animated.Text
        style={s.aiTitle}
        entering={FadeInDown.delay(80).duration(300)}
      >
        What can I help{"\n"}you find?
      </Animated.Text>

      <View style={s.promptsWrap}>
        {PROMPTS.map((p, i) => (
          <Animated.View
            key={i}
            entering={FadeInUp.delay(180 + i * 60)
              .duration(350)
              .easing(Easing.out(Easing.quad))}
          >
            <Pressable style={s.promptPill} onPress={onDismiss}>
              <Text style={s.promptText}>{p}</Text>
            </Pressable>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  </Animated.View>
);

export default function HomeScreen() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
  });

  const { toggle: toggleSiri, isActive, setOverlay } = useSiri();

  const handleDismissPanel = useCallback(() => {
    setOverlay(null);
    toggleSiri();
  }, [setOverlay, toggleSiri]);

  useEffect(() => {
    if (isActive) {
      setOverlay(<AIOverlay onDismiss={handleDismissPanel} />);
    } else {
      setOverlay(null);
    }
  }, [isActive]);

  const handleActivate = useCallback(() => {
    toggleSiri({
      glow: {
        colors: ["#FF6B9D", "#C44AFF", "#5856D6", "#00C9FF", "#FF6B9D"],
        speed: 0.2,
      },
      border: { radius: 48, spread: 20, margin: 6 },
      wave: { strength: 1 },
    });
  }, [toggleSiri]);

  if (!fontLoaded) return <View style={s.root} />;

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.header}>
          <Text style={s.logo}>frūt</Text>
          <Pressable style={s.bagBtn}>
            <BagIcon />
            <View style={s.badge}>
              <Text style={s.badgeText}>2</Text>
            </View>
          </Pressable>
        </View>

        <View style={s.hero}>
          <Image source={SPLASH_IMAGE} style={s.heroImg} />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)", "#000"]}
            locations={[0, 0.55, 1]}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={s.heroContent}>
            <Text style={s.heroLabel}>FRESH DAILY</Text>
            <Text style={s.heroTitle}>Naturally{"\n"}grown, delivered</Text>
            <View style={s.heroAccentRow}>
              <LinearGradient
                colors={["#C44AFF", "#FF6B9D", "#FFBA08"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={s.heroAccentLine}
              />
              <Text style={s.heroAccentText}>to you.</Text>
            </View>
          </View>
        </View>

        <Pressable style={s.aiBtn} onPress={handleActivate}>
          <SparkleIcon />
          <Text style={s.aiBtnText}>What should I eat today?</Text>
          <View style={s.aiBtnArrow}>
            <ArrowRight />
          </View>
        </Pressable>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.tagRow}
          style={s.tagScroll}
        >
          {TAGS.map((t, i) => (
            <Pressable key={t} style={[s.tag, i === 0 && s.tagActive]}>
              <Text style={[s.tagText, i === 0 && s.tagTextActive]}>{t}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={s.featured}>
          <View style={s.featuredLeft}>
            <Text style={s.featuredLabel}>BEST SELLER</Text>
            <Text style={s.featuredName}>Fresh Orange{"\n"}Juice</Text>
            <Text style={s.featuredDesc}>Cold pressed · No sugar · 500ml</Text>
            <View style={s.featuredPriceRow}>
              <Text style={s.featuredPrice}>
                $6<Text style={s.featuredPriceDec}>.90</Text>
              </Text>
              <Pressable style={s.addBtnW}>
                <PlusIcon />
              </Pressable>
            </View>
          </View>
          <Image source={HERO_IMAGE} style={s.featuredImg} />
        </View>

        <View style={s.sectionRow}>
          <Text style={s.sectionTitle}>Popular</Text>
          <Text style={s.seeAll}>See all</Text>
        </View>
        <View style={s.grid}>
          {FRUITS.map((f, i) => (
            <View key={i} style={s.card}>
              <View style={s.cardImgWrap}>
                <Image source={f.image} style={s.cardImg} />
              </View>
              <Text style={s.cardName}>{f.name}</Text>
              <Text style={s.cardWeight}>{f.weight}</Text>
              <View style={s.cardBottom}>
                <Text style={s.cardPrice}>
                  ${f.price}
                  <Text style={s.cardUnit}> / {f.unit}</Text>
                </Text>
                <Pressable style={s.addBtnS}>
                  <PlusIcon />
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
  scroll: { paddingHorizontal: 20, paddingTop: 58, paddingBottom: 30 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    fontFamily: "HelveticaNowDisplay",
    fontSize: 26,
    color: "#fff",
    letterSpacing: -1,
  },
  bagBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { fontSize: 9, fontWeight: "800", color: "#000" },

  hero: { height: 220, borderRadius: 24, overflow: "hidden", marginBottom: 16 },
  heroImg: { width: "100%", height: "100%", resizeMode: "cover" },
  heroContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    padding: 22,
  },
  heroLabel: {
    fontFamily: "SfProRounded",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2.5,
    color: W40,
    marginBottom: 8,
  },
  heroTitle: {
    fontFamily: "HelveticaNowDisplay",
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: -0.8,
    lineHeight: 34,
  },
  heroAccentRow: { alignSelf: "flex-start", marginTop: 2 },
  heroAccentLine: {
    position: "absolute",
    bottom: 4,
    left: -2,
    right: -2,
    height: 10,
    borderRadius: 5,
    opacity: 0.3,
  },
  heroAccentText: {
    fontFamily: "HelveticaNowDisplay",
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.8,
    lineHeight: 36,
    color: "#fff",
  },

  aiBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: W04,
    borderWidth: 1,
    borderColor: W06,
    borderRadius: 16,
    paddingVertical: 14,
    paddingLeft: 18,
    paddingRight: 6,
    marginBottom: 24,
  },
  aiBtnText: {
    flex: 1,
    fontFamily: "SfProRounded",
    fontSize: 14,
    fontWeight: "500",
    color: W40,
  },
  aiBtnArrow: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: W06,
    alignItems: "center",
    justifyContent: "center",
  },
  aiBtnDots: { flexDirection: "row", gap: 4 },

  tagScroll: { marginBottom: 24, marginHorizontal: -20 },
  tagRow: { paddingHorizontal: 20, gap: 8 },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: W06,
  },
  tagActive: { backgroundColor: "#fff", borderColor: "#fff" },
  tagText: {
    fontFamily: "SfProRounded",
    fontSize: 13,
    fontWeight: "600",
    color: W20,
  },
  tagTextActive: { color: "#000" },

  featured: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.02)",
    borderWidth: 1,
    borderColor: W06,
    borderRadius: 24,
    padding: 22,
    marginBottom: 28,
    overflow: "hidden",
  },
  featuredLeft: { flex: 1, justifyContent: "space-between" },
  featuredLabel: {
    fontFamily: "SfProRounded",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2,
    color: W20,
    marginBottom: 10,
  },
  featuredName: {
    fontFamily: "HelveticaNowDisplay",
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: -0.8,
    lineHeight: 30,
    marginBottom: 6,
  },
  featuredDesc: {
    fontFamily: "SfProRounded",
    fontSize: 11,
    color: W20,
    marginBottom: 18,
  },
  featuredPriceRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  featuredPrice: {
    fontFamily: "HelveticaNowDisplay",
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: -1,
  },
  featuredPriceDec: { fontSize: 18, color: W40 },
  addBtnW: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  featuredImg: {
    width: 130,
    height: 150,
    resizeMode: "contain",
    marginRight: -10,
  },

  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: "HelveticaNowDisplay",
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: -0.5,
  },
  seeAll: {
    fontFamily: "SfProRounded",
    fontSize: 13,
    fontWeight: "500",
    color: W20,
  },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  card: {
    width: CARD_W,
    backgroundColor: "rgba(255,255,255,0.02)",
    borderWidth: 1,
    borderColor: W06,
    borderRadius: 22,
    padding: 14,
  },
  cardImgWrap: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cardImg: { width: "80%", height: "100%", resizeMode: "contain" },
  cardName: {
    fontFamily: "HelveticaNowDisplay",
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  cardWeight: {
    fontFamily: "SfProRounded",
    fontSize: 12,
    color: W20,
    marginBottom: 14,
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardPrice: {
    fontFamily: "HelveticaNowDisplay",
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: -0.5,
  },
  cardUnit: {
    fontFamily: "SfProRounded",
    fontSize: 10,
    fontWeight: "400",
    color: W20,
  },
  addBtnS: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10000,
    alignItems: "center",
    justifyContent: "center",
  },
  overlayBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  aiCard: {
    width: width - 56,
    backgroundColor: "rgba(18,18,18,0.95)",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: W06,
    paddingVertical: 32,
    paddingHorizontal: 28,
    alignItems: "center",
  },
  dotsRow: { flexDirection: "row", gap: 6, marginBottom: 20 },
  aiTitle: {
    fontFamily: "HelveticaNowDisplay",
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: -0.8,
    lineHeight: 33,
    textAlign: "center",
    marginBottom: 28,
  },
  promptsWrap: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  promptPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: W10,
    backgroundColor: W04,
  },
  promptText: {
    fontFamily: "SfProRounded",
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(255,255,255,0.55)",
  },
});
