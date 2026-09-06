import React, { type FC } from "react";
import { FlipCard } from "@/components/base/flip-card";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View, Text, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { Showcase } from "~/showcase";

export default function App<T extends FC<{}>>():
  | (React.ReactNode & React.JSX.Element & React.ReactElement)
  | null {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
  });

  if (!fontLoaded) return null;

  return (
    <Showcase>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <FlipCard
          width={320}
          height={320}
          animationDuration={700}
          animation="horizontal"
          borderRadius={16}
          enableHaptics
          scaleOnPress={Boolean(true)}
          blurTint="dark"
          blurIntensity={10}
          springConfig={{
            mass: 0.8,
            stiffness: 120,
            damping: 12,
          }}
        >
          <FlipCard.Front>
            <LinearGradient
              style={styles.gradient}
              colors={["#FF385C", "#E31C5F", "#BD1E59"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.frontContent}>
              <View style={styles.topRow}>
                <View style={styles.guestFavorite}>
                  <Text style={styles.guestFavoriteText}>Guest favorite</Text>
                </View>
                <View style={styles.rating}>
                  <Text style={styles.star}>★</Text>
                  <Text style={styles.ratingText}>4.92</Text>
                </View>
              </View>
              <View style={styles.mainContent}>
                <Text style={styles.propertyType}>Entire home</Text>
                <Text style={styles.propertyName}>Beachfront Villa</Text>
                <Text style={styles.location}>Malibu, California</Text>
              </View>
              <View style={styles.bottomRow}>
                <View style={styles.priceBlock}>
                  <Text style={styles.price}>$385</Text>
                  <Text style={styles.perNight}>night</Text>
                </View>
                <Text style={styles.tapHint}>Tap for details</Text>
              </View>
            </View>
          </FlipCard.Front>
          <FlipCard.Back>
            <LinearGradient
              style={styles.gradient}
              colors={["#222222", "#1a1a1a"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
            <View style={styles.backContent}>
              <Text style={styles.backTitle}>What this place offers</Text>
              <View style={styles.amenitiesGrid}>
                <View style={styles.amenityItem}>
                  <Text style={styles.amenityText}>Ocean view</Text>
                </View>
                <View style={styles.amenityItem}>
                  <Text style={styles.amenityText}>Pool</Text>
                </View>
                <View style={styles.amenityItem}>
                  <Text style={styles.amenityText}>Fast wifi</Text>
                </View>
                <View style={styles.amenityItem}>
                  <Text style={styles.amenityText}>Free parking</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>4</Text>
                  <Text style={styles.statLabel}>guests</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>2</Text>
                  <Text style={styles.statLabel}>bedrooms</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>2</Text>
                  <Text style={styles.statLabel}>baths</Text>
                </View>
              </View>
              <View style={styles.reserveButton}>
                <Text style={styles.reserveText}>Reserve</Text>
              </View>
            </View>
          </FlipCard.Back>
          <FlipCard.Trigger asChild={false} />
        </FlipCard>
      </SafeAreaView>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    alignItems: "center",
    justifyContent: "center",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  frontContent: {
    flex: 1,
    justifyContent: "space-between",
    padding: 28,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  guestFavorite: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  guestFavoriteText: {
    fontFamily: "SfProRounded",
    fontSize: 12,
    fontWeight: "600",
    color: "#222222",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  star: {
    fontSize: 14,
    color: "#ffffff",
  },
  ratingText: {
    fontFamily: "SfProRounded",
    fontSize: 15,
    fontWeight: "600",
    color: "#ffffff",
  },
  mainContent: {
    gap: 6,
  },
  propertyType: {
    fontFamily: "SfProRounded",
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  propertyName: {
    fontFamily: "SfProRounded",
    fontSize: 36,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: -0.5,
  },
  location: {
    fontFamily: "SfProRounded",
    fontSize: 17,
    color: "rgba(255, 255, 255, 0.85)",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  priceBlock: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 5,
  },
  price: {
    fontFamily: "SfProRounded",
    fontSize: 32,
    fontWeight: "700",
    color: "#ffffff",
  },
  perNight: {
    fontFamily: "SfProRounded",
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  tapHint: {
    fontFamily: "SfProRounded",
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.5)",
  },
  backContent: {
    flex: 1,
    padding: 28,
    justifyContent: "space-between",
  },
  backTitle: {
    fontFamily: "SfProRounded",
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
  },
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 10,
  },
  amenityItem: {
    width: "47%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  amenityIcon: {
    fontSize: 20,
  },
  amenityText: {
    fontFamily: "SfProRounded",
    fontSize: 12,
    color: "#ffffff",
  },
  divider: {
    height: 0.5,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginTop: 10,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  stat: {
    alignItems: "center",
    gap: 4,
  },
  statNumber: {
    fontFamily: "SfProRounded",
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  statLabel: {
    fontFamily: "SfProRounded",
    fontSize: 11.5,
    color: "rgba(255, 255, 255, 0.6)",
  },
  reserveButton: {
    backgroundColor: "#FF385C",
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 12,
    alignItems: "center",
  },
  reserveText: {
    fontFamily: "SfProRounded",
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
  },
});
