import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
} from "react-native";
import {
  AnimatedScrollView,
  HeaderComponentWrapper,
  HeaderNavBar,
} from "@/components/templates/parallax-header/";
import { useFonts } from "expo-font";
import { SymbolView } from "expo-symbols";
import { Stack, useRouter, type Router } from "expo-router";
import { Header } from "@react-navigation/elements";
import { useResponsive } from "@/helpers/hooks/use-responsive";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  LaurelWreathLeft01Icon,
  LaurelWreathRight01Icon,
} from "@hugeicons/core-free-icons";
import { Ionicons } from "@expo/vector-icons";

const DATA = {
  name: "Peaceful Home Stay with Modern Amenities",
  subtitle: "Entire home in Marion, Indiana",
  description:
    "Experience the beauty of organic architecture in this stunning Frank Lloyd Wright–designed Usonian home, nestled on 7 private wooded acres. Every detail — from the original Cherokee red concrete floors to the signature cantilevered roof — has been lovingly preserved. Floor-to-ceiling windows blur the line between indoors and out, filling each room with natural light and sweeping views of old-growth forest.",
  price: 548,
  originalPrice: 628,
  currency: "$",
  checkIn: "Oct 20",
  checkOut: "Oct 25",
  nights: 5,
  totalPrice: 2739,
  originalTotalPrice: 3139,
  rating: 4.83,
  reviewCount: 77,
  guestFavorite: true,
  guests: 6,
  bedrooms: 4,
  beds: 4,
  baths: 4.5,
  host: {
    name: "Josh",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    superhost: true,
    yearsHosting: 5,
  },
  images: [
    {
      url: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      detail: "interiors",
    },
    {
      url: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      detail: "exteriors",
    },
    {
      url: "https://images.unsplash.com/photo-1649083048337-4aeb6dda80bb?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      detail: "interiors",
    },
    {
      url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      detail: "bedroom",
    },
  ],
  amenities: [
    { icon: "mountain.2", label: "Mountain view" },
    { icon: "car", label: "Free parking" },
    { icon: "wifi", label: "Fast wifi – 240 Mbps" },
    { icon: "washer", label: "Free washer – in unit" },
    { icon: "fireplace", label: "Indoor fireplace" },
    { icon: "leaf", label: "Private backyard" },
  ],
  highlights: [
    {
      icon: "trophy",
      title: "Guest favorite",
      subtitle: "One of the most loved homes on Airbnb, according to guests",
    },
    {
      icon: "key",
      title: "Self check-in",
      subtitle: "Check yourself in with the lockbox",
    },
    {
      icon: "calendar",
      title: "Free cancellation for 48 hours",
      subtitle: "Get a full refund if you change your mind",
    },
  ],
  reviews: [
    {
      id: "1",
      author: "Sarah",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
      date: "September 2025",
      rating: 5,
      text: "Absolutely breathtaking. Staying in a Frank Lloyd Wright home was a dream come true. The attention to detail in the architecture is incredible.",
    },
    {
      id: "2",
      author: "James",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
      date: "August 2025",
      rating: 5,
      text: "The surroundings are pristine and the home itself is a masterpiece. Matthew was a wonderful host — very responsive and helpful.",
    },
    {
      id: "3",
      author: "Emily",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
      date: "July 2025",
      rating: 4,
      text: "A truly unique experience. We loved waking up to the views of the forest. The kitchen is well equipped and the beds are very comfortable.",
    },
  ],
};

export default function PropertyDetail() {
  const [saved, setSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { width, rf, rv } = useResponsive();
  const insets = useSafeAreaInsets();
  const router: Router = useRouter() as Router;

  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
  });

  const imageCarouselRef = useRef<FlatList>(null);

  const onImageScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offset = e.nativeEvent.contentOffset.x;
      const index = Math.round(offset / width);
      setCurrentImageIndex(index);
    },
    [width],
  );

  const headerImageHeight = rv({
    nano: 280,
    compact: 340,
    medium: 420,
    expanded: 480,
  });

  const Divider = () => <View style={styles.divider} />;

  const renderStars = (rating: number) => {
    const stars = [];
    const full = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <SymbolView
          key={i}
          name={i < full ? "star.fill" : "star"}
          size={rf(8)}
          tintColor={i < full ? "#222" : "#CCC"}
          resizeMode="scaleAspectFit"
        />,
      );
    }
    return <View style={styles.starsRow}>{stars}</View>;
  };

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Stack.Screen options={{ headerShown: false }} />

      <AnimatedScrollView
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        renderHeaderNavBarComponent={() => (
          <Header
            headerBackground={() => <></>}
            title=""
            headerLeft={() => (
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.headerCircleBtn}
                onPress={() => router.back()}
              >
                <SymbolView
                  name="arrow.backward"
                  size={rf(15)}
                  tintColor="#222"
                  resizeMode="scaleAspectFit"
                />
              </TouchableOpacity>
            )}
            headerRight={() => (
              <View style={styles.headerRightRow}>
                <TouchableOpacity
                  style={styles.headerCircleBtn}
                  activeOpacity={0.9}
                >
                  <SymbolView
                    name="square.and.arrow.up"
                    size={rf(16)}
                    tintColor="#222"
                    resizeMode="scaleAspectFit"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.headerCircleBtn}
                  activeOpacity={0.9}
                  onPress={() => setSaved(!saved)}
                >
                  <SymbolView
                    name={saved ? "heart.fill" : "heart"}
                    size={rf(16)}
                    tintColor={saved ? "#FF385C" : "#222"}
                    resizeMode="scaleAspectFit"
                  />
                </TouchableOpacity>
              </View>
            )}
            headerBackgroundContainerStyle={{ backgroundColor: "transparent" }}
          />
        )}
        renderTopNavBarComponent={() => (
          <HeaderNavBar intensity={100} tint="extraLight">
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.9}>
              <SymbolView
                name="arrow.backward"
                size={18}
                tintColor="#222"
                resizeMode="scaleAspectFit"
              />
            </TouchableOpacity>

            <View style={styles.headerRightRow}>
              <TouchableOpacity activeOpacity={0.9}>
                <SymbolView
                  name="square.and.arrow.up"
                  size={16}
                  tintColor="#222"
                  resizeMode="scaleAspectFit"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSaved(!saved)}
                activeOpacity={0.9}
              >
                <SymbolView
                  name={saved ? "heart.fill" : "heart"}
                  size={16}
                  tintColor={saved ? "#FF385C" : "#222"}
                  resizeMode="scaleAspectFit"
                />
              </TouchableOpacity>
            </View>
          </HeaderNavBar>
        )}
        topBarHeight={100}
        headerMaxHeight={headerImageHeight}
        renderHeaderComponent={() => (
          <HeaderComponentWrapper useGradient={false}>
            <View style={{ height: headerImageHeight }}>
              <FlatList
                ref={imageCarouselRef}
                data={DATA.images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onImageScroll}
                scrollEventThrottle={16}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: item.url }}
                    style={{ width, height: headerImageHeight }}
                    resizeMode="cover"
                  />
                )}
              />
              <View style={styles.imageCounterPill}>
                <Text style={styles.imageCounterText}>
                  {currentImageIndex + 1} / {DATA.images.length}
                </Text>
              </View>
            </View>
          </HeaderComponentWrapper>
        )}
      >
        <View style={[styles.content, {}]}>
          <View style={styles.section}>
            <Text
              style={[
                styles.propertyName,
                {
                  fontFamily: fontLoaded ? "HelveticaNowDisplay" : undefined,
                  fontSize: rf(26),
                  maxWidth: width - 120,
                  textAlign: "center",
                  paddingTop: 10,
                },
              ]}
            >
              {DATA.name}
            </Text>

            <View
              style={{
                alignItems: "center",
                paddingTop: 15,
              }}
            >
              <Text style={[styles.propertySubtitle, { fontSize: rf(14) }]}>
                {DATA.subtitle}
              </Text>
              <Text style={[styles.propertyMeta, { fontSize: rf(13) }]}>
                {DATA.guests} guests · {DATA.bedrooms} bedrooms · {DATA.beds}{" "}
                beds · {DATA.baths} baths
              </Text>
            </View>
          </View>

          <View style={styles.ratingBar}>
            <View style={styles.ratingCell}>
              <Text style={[styles.ratingBigNumber, { fontSize: rf(18) }]}>
                {DATA.rating}
              </Text>
              {renderStars(DATA.rating)}
            </View>

            <View style={styles.ratingDivider} />

            <View style={styles.ratingCellCenter}>
              <HugeiconsIcon
                strokeWidth={0.9}
                icon={LaurelWreathLeft01Icon}
                size={35}
                transform={[{ rotate: "-30deg" }]}
              />
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={[styles.guestFavText, { fontSize: rf(12) }]}>
                  Guest
                </Text>
                <Text style={[styles.guestFavText, { fontSize: rf(12) }]}>
                  Favorite
                </Text>
              </View>
              <HugeiconsIcon
                icon={LaurelWreathRight01Icon}
                size={35}
                strokeWidth={0.9}
                transform={[{ rotate: "30deg" }]}
              />
            </View>

            <View style={styles.ratingDivider} />

            <View style={styles.ratingCell}>
              <Text style={[styles.ratingBigNumber, { fontSize: rf(18) }]}>
                {DATA.reviewCount}
              </Text>
              <Text style={[styles.ratingLabel, { fontSize: rf(9) }]}>
                Reviews
              </Text>
            </View>
          </View>

          {/* <View style={styles.lowerPriceBanner}>
            <View style={styles.lowerPriceIcon}>
              <SymbolView
                name="tag.fill"
                size={rf(20)}
                tintColor="#FF385C"
                resizeMode="scaleAspectFit"
              />
            </View>
            <View style={styles.lowerPriceText}>
              <Text
                style={[
                  styles.lowerPriceTitle,
                  {
                    fontFamily: fontLoaded ? "HelveticaNowDisplay" : undefined,
                    fontSize: rf(15),
                  },
                ]}
              >
                Lower price
              </Text>
              <Text style={[styles.lowerPriceSubtitle, { fontSize: rf(13) }]}>
                Your dates are ${DATA.originalPrice - DATA.price} less than the
                avg. nightly rate of the last 60 days.
              </Text>
            </View>
          </View> */}

          <Divider />

          <View style={styles.hostRow}>
            <Image
              source={{ uri: DATA.host.avatar }}
              style={[
                styles.hostAvatar,
                { width: rf(40), height: rf(40), borderRadius: rf(24) },
              ]}
            />
            <View style={styles.hostInfo}>
              <Text
                style={[
                  styles.hostName,
                  {
                    fontFamily: fontLoaded ? "HelveticaNowDisplay" : undefined,
                    fontSize: rf(13),
                  },
                ]}
              >
                Hosted by {DATA.host.name}
              </Text>
              <Text style={[styles.hostMeta, { fontSize: rf(11) }]}>
                {DATA.host.superhost ? "Superhost" : "Host"} ·{" "}
                {DATA.host.yearsHosting} years hosting
              </Text>
            </View>
          </View>

          <Divider />

          <View style={styles.section}>
            {DATA.highlights.map((h, i) => (
              <View key={i} style={styles.highlightRow}>
                <View style={styles.highlightIconWrap}>
                  <SymbolView
                    name={h.icon as any}
                    size={rf(24)}
                    tintColor="#222"
                    resizeMode="scaleAspectFit"
                  />
                </View>
                <View style={styles.highlightContent}>
                  <Text
                    style={[
                      styles.highlightTitle,
                      {
                        fontFamily: fontLoaded
                          ? "HelveticaNowDisplay"
                          : undefined,
                        fontSize: rf(14),
                      },
                    ]}
                  >
                    {h.title}
                  </Text>
                  <Text
                    style={[styles.highlightSubtitle, { fontSize: rf(13) }]}
                  >
                    {h.subtitle}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <Divider />

          <View style={styles.section}>
            <Text style={[styles.descriptionText, { fontSize: rf(15) }]}>
              {DATA.description}
            </Text>
            <TouchableOpacity
              activeOpacity={0.9}
              style={[
                styles.showMoreBtn,
                {
                  width: width * 0.9,
                },
              ]}
            >
              <Text
                style={[
                  styles.showMoreText,
                  {
                    fontFamily: fontLoaded ? "HelveticaNowDisplay" : undefined,
                    fontSize: rf(14),
                  },
                ]}
              >
                Show more
              </Text>
            </TouchableOpacity>
          </View>

          <Divider />

          <View style={styles.subsection}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  fontFamily: fontLoaded ? "HelveticaNowDisplay" : undefined,
                  fontSize: rf(20),
                },
              ]}
            >
              What this place offers
            </Text>
            {DATA.amenities.map((a, i) => (
              <View key={i} style={styles.amenityRow}>
                <SymbolView
                  name={a.icon as any}
                  size={rf(22)}
                  tintColor="#444"
                  resizeMode="scaleAspectFit"
                />
                <Text style={[styles.amenityLabel, { fontSize: rf(15) }]}>
                  {a.label}
                </Text>
              </View>
            ))}
            <TouchableOpacity
              style={styles.showAllAmenitiesBtn}
              activeOpacity={0.9}
            >
              <Text
                style={[
                  styles.showAllAmenitiesText,
                  {
                    fontFamily: fontLoaded ? "HelveticaNowDisplay" : undefined,
                    fontSize: rf(14),
                  },
                ]}
              >
                Show all 20 amenities
              </Text>
            </TouchableOpacity>
          </View>

          <Divider />

          <View style={styles.subsection}>
            <Text
              style={[
                styles.subsectionTitle,
                {
                  fontFamily: fontLoaded ? "HelveticaNowDisplay" : undefined,
                  fontSize: rf(20),
                },
              ]}
            >
              Where you'll be
            </Text>
            <Text
              style={[
                styles.subsectionTitle,
                {
                  fontFamily: fontLoaded ? "HelveticaNowDisplay" : undefined,
                  fontSize: rf(14),
                  color: "#717171",
                },
              ]}
            >
              Marion, Indiana, United States
            </Text>
            <View style={styles.mapPlaceholder}>
              <SymbolView
                name="map.fill"
                size={rf(40)}
                tintColor="#bbb"
                resizeMode="scaleAspectFit"
              />
              <Text style={[styles.mapPlaceholderText, { fontSize: rf(14) }]}>
                Marion, Indiana, United States
              </Text>
            </View>
          </View>

          <View style={{ height: 100 + insets.bottom }} />
        </View>
      </AnimatedScrollView>

      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <View style={styles.bottomBarInner}>
          <View style={styles.priceColumn}>
            <View style={styles.priceRow}>
              <Text style={[styles.originalTotalPrice, { fontSize: rf(14) }]}>
                ${DATA.originalTotalPrice.toLocaleString()}
              </Text>
              <Text
                style={[
                  styles.totalPrice,
                  {
                    fontFamily: fontLoaded ? "HelveticaNowDisplay" : undefined,
                    fontSize: rf(17),
                  },
                ]}
              >
                ${DATA.totalPrice.toLocaleString()}
              </Text>
            </View>
            <Text style={[styles.priceSubLabel, { fontSize: rf(12) }]}>
              Total before taxes
            </Text>
            <View
              style={{
                backgroundColor: "#ededed",
                flexDirection: "row",

                alignItems: "center",
                borderRadius: 99,
                paddingHorizontal: 6,
                gap: 4,
                marginTop: 8,
                paddingVertical: 3,
              }}
            >
              <Ionicons name="checkmark" size={rf(12)} color="black" />
              <Text
                style={[
                  styles.priceSubLabel,
                  {
                    fontSize: rf(11),
                    color: "black",
                  },
                ]}
              >
                Free Cancellation
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.reserveButton,
              {
                paddingVertical: rf(14),
                paddingHorizontal: rf(36),
                borderRadius: rf(10),
              },
            ]}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={["#E31C5F", "#D70466"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[StyleSheet.absoluteFill, { borderRadius: rf(10) }]}
            />
            <Text
              style={[
                styles.reserveText,
                {
                  fontFamily: fontLoaded ? "HelveticaNowDisplay" : undefined,
                  fontSize: rf(16),
                },
              ]}
            >
              Reserve
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerCircleBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
    }),
  },
  headerRightRow: {
    flexDirection: "row",
    gap: 10,
    marginRight: 12,
  },
  topNavTitle: {
    color: "#222",
    fontSize: 16,
    flex: 1,
    textAlign: "center",
    marginHorizontal: 12,
  },
  imageCounterPill: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "rgba(34,34,34,0.5)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  imageCounterText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.4,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 22,
    paddingVertical: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  subsection: {
    paddingHorizontal: 22,
    paddingVertical: 22,
    // justifyContent: "center",
    // alignItems: "center",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#DDDDDD",
    marginHorizontal: 30,
  },
  propertyName: {
    color: "#222",
    fontWeight: "700",
    lineHeight: 32,
    marginBottom: 6,
  },
  propertySubtitle: {
    color: "#717171",
    fontWeight: "500",
    marginBottom: 4,
  },
  propertyMeta: {
    color: "#717171",
    fontWeight: "400",
  },

  /* ── Rating Bar ── */
  ratingBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 32,
    marginBottom: 20,
    paddingVertical: 14,
  },

  /* Left & right cells stretch equally */
  ratingCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  /* Center cell: NO flex — it sizes to its content (the laurels + text).
     The two flex:1 side cells split the remaining space evenly,
     keeping the dividers snug against the center content. */
  ratingCellCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 2,
  },

  /* Dividers sit naturally between cells — no right/left offsets needed */
  ratingDivider: {
    width: StyleSheet.hairlineWidth,
    height: 24,
    backgroundColor: "#DDDDDD",
  },

  ratingBigNumber: {
    color: "#222",
    fontWeight: "700",
  },
  ratingLabel: {
    color: "#222",
    fontWeight: "600",
  },
  starsRow: {
    flexDirection: "row",
    gap: 2,
  },
  guestFavText: {
    color: "#222",
    fontWeight: "bold",
  },

  lowerPriceBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 22,
    paddingVertical: 20,
    gap: 14,
  },
  lowerPriceIcon: {
    marginTop: 2,
  },
  lowerPriceText: {
    flex: 1,
  },
  lowerPriceTitle: {
    color: "#222",
    fontWeight: "600",
    marginBottom: 4,
  },
  lowerPriceSubtitle: {
    color: "#717171",
    lineHeight: 19,
  },
  hostRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 22,
    gap: 16,
  },
  hostAvatar: {
    backgroundColor: "#eee",
  },
  hostInfo: {
    flex: 1,
  },
  hostName: {
    color: "#222",
    fontWeight: "600",
    marginBottom: 1.5,
  },
  hostMeta: {
    color: "#717171",
  },
  highlightRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 18,
    marginBottom: 22,
  },
  highlightIconWrap: {
    width: 36,
    alignItems: "center",
    marginTop: 0,
  },
  highlightContent: {
    flex: 1,
  },
  highlightTitle: {
    color: "#222",
    fontWeight: "600",
    marginBottom: 0.5,
  },
  highlightSubtitle: {
    color: "#717171",
    lineHeight: 19,
  },
  descriptionText: {
    color: "#484848",
    lineHeight: 23,
    marginBottom: 12,
  },
  showMoreBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ebebeb",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 12,
    gap: 4,
  },
  showMoreText: {
    color: "#222",
    fontWeight: "600",
  },
  sectionTitle: {
    color: "#222",
    fontWeight: "700",
    marginBottom: 18,
  },
  subsectionTitle: {
    color: "#222",
    fontWeight: "700",
    marginBottom: 12,
  },
  amenityRow: {
    flexDirection: "row",

    alignItems: "center",
    gap: 18,
    marginBottom: 18,
  },
  amenityLabel: {
    color: "#484848",
  },
  showAllAmenitiesBtn: {
    marginTop: 6,
    paddingVertical: 10,
    backgroundColor: "#ebebeb",

    borderRadius: 10,
    alignItems: "center",
  },
  showAllAmenitiesText: {
    color: "#222",
    fontWeight: "600",
  },
  reviewsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  reviewsScroll: {
    marginHorizontal: -22,
  },
  reviewsScrollContent: {
    paddingHorizontal: 22,
    gap: 12,
  },
  reviewCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#EBEBEB",
    borderRadius: 14,
    padding: 18,
    justifyContent: "space-between",
  },
  reviewText: {
    color: "#484848",
    lineHeight: 21,
    marginBottom: 16,
  },
  reviewAuthorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#eee",
  },
  reviewAuthor: {
    color: "#222",
    fontWeight: "600",
  },
  reviewDate: {
    color: "#717171",
    marginTop: 1,
  },
  showAllReviewsBtn: {
    marginTop: 18,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#222",
    borderRadius: 10,
    alignItems: "center",
  },
  mapPlaceholder: {
    height: 180,
    borderRadius: 14,
    backgroundColor: "#F7F7F7",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  mapPlaceholderText: {
    color: "#717171",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#DDDDDD",
    paddingTop: 14,
    paddingHorizontal: 22,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: { elevation: 8 },
    }),
  },
  bottomBarInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceColumn: {},
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  originalTotalPrice: {
    color: "#B0B0B0",
    textDecorationLine: "line-through",
    fontWeight: "400",
  },
  totalPrice: {
    color: "#222",
    fontWeight: "700",
  },
  priceSubLabel: {
    color: "#717171",
    marginTop: 1,
  },
  priceDates: {
    color: "#222",
    fontWeight: "500",
    textDecorationLine: "underline",
    marginTop: 1,
  },
  reserveButton: {
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  reserveText: {
    color: "#fff",
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
