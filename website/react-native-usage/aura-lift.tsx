import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  Dimensions,
  StatusBar,
} from "react-native";
import { useFonts } from "expo-font";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { useAuraLiftContext } from "@/components/organisms/aura-lift";
import type { IAuraLiftContext } from "@/components/organisms/aura-lift/types";

const { width } = Dimensions.get("window");

const LogoIcon = ({ size = 36 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <Circle cx="20" cy="20" r="19" stroke="white" strokeWidth="1.5" />
    <Path d="M20 10L24 18L20 16L16 18L20 10Z" fill="white" fillOpacity={0.9} />
    <Path d="M13 22L20 17L27 22L20 27Z" fill="white" fillOpacity={0.7} />
    <Path d="M20 27L27 22V28L20 33L13 28V22Z" fill="white" fillOpacity={0.35} />
  </Svg>
);

const MenuIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="6" width="18" height="1.5" rx="0.75" fill="white" />
    <Rect x="3" y="11.25" width="12" height="1.5" rx="0.75" fill="white" />
    <Rect x="3" y="16.5" width="18" height="1.5" rx="0.75" fill="white" />
  </Svg>
);

const BoltIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path
      d="M13 2L4 14H12L11 22L20 10H12L13 2Z"
      stroke="white"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </Svg>
);

const SpeedIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 4C7.58 4 4 7.58 4 12s3.58 8 8 8 8-3.58 8-8"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <Path
      d="M12 12L16 6"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Circle cx="12" cy="12" r="1.5" fill="white" />
  </Svg>
);

const RangeIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 12H7L10 19L14 5L17 12H21"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const LockIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Rect
      x="5"
      y="11"
      width="14"
      height="10"
      rx="2"
      stroke="white"
      strokeWidth="1.5"
    />
    <Path
      d="M8 11V7C8 4.79 9.79 3 12 3C14.21 3 16 4.79 16 7V11"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <Circle cx="12" cy="16" r="1.5" fill="white" />
  </Svg>
);

const ClimateIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3V21M12 3C10 7 6 9 3 9M12 3C14 7 18 9 21 9M12 21C10 17 6 15 3 15M12 21C14 17 18 15 21 15"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Svg>
);

const LocationIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"
      stroke="white"
      strokeWidth="1.5"
    />
    <Circle cx="12" cy="9" r="2.5" stroke="white" strokeWidth="1.5" />
  </Svg>
);

export default function HomeScreen() {
  const imageTesla = require("../assets/tesla/tesla-png-car.png");

  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
  });

  const { toggle } = useAuraLiftContext<IAuraLiftContext>();

  if (!fontLoaded) return <View style={styles.container} />;

  return (
    <View style={styles.container} onTouchEnd={toggle}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <LogoIcon />
          <Pressable style={styles.menuButton}>
            <MenuIcon />
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroWatermark}>MODEL X</Text>
          <Image source={imageTesla} style={styles.heroCarImage} />
        </View>

        <Text style={styles.headline}>
          Find, book and{"\n"}rent a car{" "}
          <Text style={styles.headlineAccent}>Easily</Text>
        </Text>
        <Text style={styles.subheadline}>
          Get a car wherever and whenever you need it
        </Text>

        <View style={styles.statusRow}>
          <View style={styles.statusLeft}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Unlocked · Ready</Text>
          </View>
          <Text style={styles.statusRange}>245 mi</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <BoltIcon />
            <Text style={styles.cardLabel}>BATTERY</Text>
            <Text style={styles.cardMeta}>Full in 2h 15m</Text>
          </View>
          <Text style={styles.bigValue}>
            86<Text style={styles.bigUnit}>%</Text>
          </Text>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: "86%" }]} />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.card, styles.halfCard]}>
            <View style={styles.cardHeader}>
              <SpeedIcon />
              <Text style={styles.cardLabel}>SPEED</Text>
            </View>
            <Text style={styles.medValue}>
              155 <Text style={styles.medUnit}>mph</Text>
            </Text>
            <Text style={styles.cardSub}>Top Speed</Text>
          </View>
          <View style={[styles.card, styles.halfCard]}>
            <View style={styles.cardHeader}>
              <RangeIcon />
              <Text style={styles.cardLabel}>RANGE</Text>
            </View>
            <Text style={styles.medValue}>
              245 <Text style={styles.medUnit}>mi</Text>
            </Text>
            <Text style={styles.cardSub}>Estimated</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>WEEKLY CHARGE</Text>
            <Text style={styles.cardMeta}>Feb 15 – 21</Text>
          </View>
          <View style={styles.chartContainer}>
            {[65, 85, 92, 78, 88, 95, 86].map((v, i) => (
              <View key={i} style={styles.chartCol}>
                <View style={styles.chartBarBg}>
                  <View
                    style={[
                      styles.chartBar,
                      { height: `${v}%` },
                      i === 6 && styles.chartBarActive,
                    ]}
                  />
                </View>
                <Text
                  style={[styles.chartDay, i === 6 && styles.chartDayActive]}
                >
                  {["M", "T", "W", "T", "F", "S", "S"][i]}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.sectionLabel}>QUICK ACTIONS</Text>
        <View style={styles.actionsRow}>
          {[
            { icon: <LockIcon />, label: "Lock" },
            { icon: <ClimateIcon />, label: "Climate" },
            { icon: <LocationIcon />, label: "Locate" },
          ].map((a, i) => (
            <Pressable key={i} style={styles.actionCard}>
              <View style={styles.actionIcon}>{a.icon}</View>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const CARD_BG = "rgba(255,255,255,0.03)";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const DIM = "rgba(255,255,255,0.3)";
const DIMMER = "rgba(255,255,255,0.15)";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },

  heroCard: {
    backgroundColor: "#0A0A0A",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    paddingVertical: 28,
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 32,
  },
  heroWatermark: {
    position: "absolute",
    top: 18,
    fontSize: 68,
    fontWeight: "900",
    color: "rgba(255,255,255,0.025)",
    letterSpacing: 8,
  },
  heroCarImage: {
    width: "110%",
    height: 190,
    resizeMode: "contain",
  },

  headline: {
    fontFamily: "HelveticaNowDisplay",
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: -0.8,
    lineHeight: 40,
    marginBottom: 10,
  },
  headlineAccent: {
    color: "rgba(255,255,255,0.35)",
    fontStyle: "italic",
  },
  subheadline: {
    fontFamily: "SfProRounded",
    fontSize: 14,
    color: DIM,
    lineHeight: 21,
    marginBottom: 32,
  },

  // Status
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  statusLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  statusText: {
    fontFamily: "SfProRounded",
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.6)",
  },
  statusRange: {
    fontFamily: "SfProRounded",
    fontSize: 13,
    color: DIM,
    fontWeight: "500",
  },

  // Cards
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: 20,
    marginBottom: 10,
  },
  halfCard: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  cardLabel: {
    fontFamily: "SfProRounded",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: DIM,
  },
  cardMeta: {
    fontFamily: "SfProRounded",
    fontSize: 10,
    color: DIMMER,
    fontWeight: "500",
    marginLeft: "auto",
  },
  cardSub: {
    fontFamily: "SfProRounded",
    fontSize: 11,
    color: DIMMER,
    marginTop: 6,
  },

  // Big number (battery)
  bigValue: {
    fontFamily: "HelveticaNowDisplay",
    fontSize: 48,
    color: "#fff",
    letterSpacing: -2,
    marginBottom: 14,
  },
  bigUnit: {
    fontSize: 22,
    fontWeight: "400",
    color: DIM,
  },

  // Medium number (speed/range)
  medValue: {
    fontFamily: "HelveticaNowDisplay",
    fontSize: 34,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: -1.5,
    lineHeight: 38,
  },
  medUnit: {
    fontSize: 14,
    fontWeight: "500",
    color: DIM,
  },

  // Battery bar
  barTrack: {
    height: 5,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 3,
  },

  // Chart
  chartContainer: {
    flexDirection: "row",
    gap: 6,
    height: 100,
  },
  chartCol: {
    flex: 1,
    alignItems: "center",
  },
  chartBarBg: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  chartBar: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 4,
  },
  chartBarActive: {
    backgroundColor: "#fff",
  },
  chartDay: {
    fontFamily: "SfProRounded",
    fontSize: 10,
    fontWeight: "600",
    color: DIMMER,
  },
  chartDayActive: {
    color: "#fff",
  },

  // Actions
  sectionLabel: {
    fontFamily: "SfProRounded",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    color: DIMMER,
    marginTop: 24,
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  actionCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: CARD_BG,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    paddingVertical: 18,
    gap: 10,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontFamily: "SfProRounded",
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
  },
});
