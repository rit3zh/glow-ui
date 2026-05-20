import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Dimensions,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48 - 12) / 2;

const CATEGORIES = ["All", "Hoodies", "Joggers", "Shorts", "T-Shirts", "Caps"];

const PRODUCTS = [
  {
    id: "1",
    name: "Classic Black Hoodie",
    price: 89,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
  },
  {
    id: "2",
    name: "Urban Joggers",
    price: 65,
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400",
  },
  {
    id: "3",
    name: "Streetwear Cap",
    price: 35,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400",
  },
  {
    id: "4",
    name: "Oversized Tee",
    price: 45,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400",
  },
  {
    id: "5",
    name: "Tech Shorts",
    price: 55,
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400",
  },
  {
    id: "6",
    name: "Minimal Backpack",
    price: 120,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
  },
];

export default function App() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
    Coolvetica: require("@/assets/fonts/Coolvetica-Rg.otf"),
    DrukWide: require("../assets/fonts/DrukWideBold.ttf"),
    StretchPro: require("../assets/fonts/StretchPro.otf"),
  });

  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={styles.gridIcon}>
              <View style={styles.gridDot} />
              <View style={styles.gridDot} />
              <View style={styles.gridDot} />
              <View style={styles.gridDot} />
            </View>

            <View style={styles.profileContainer}>
              <Image
                source={{
                  uri: "https://i.pinimg.com/1200x/77/c8/84/77c884a51113e3f45653e4a68dfcfa99.jpg",
                }}
                style={styles.profileImage}
              />
            </View>
          </View>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text
            style={[
              styles.labelText,
              { fontFamily: fontLoaded ? "StretchPro" : undefined },
            ]}
          >
            THINK DIFFERENT
          </Text>
          <Text
            style={[
              styles.titleText,
              { fontFamily: fontLoaded ? "StretchPro" : undefined },
            ]}
          >
            POPULAR{"\n"}CHOICES
          </Text>
          <Text
            style={[
              styles.descriptionText,
              { fontFamily: fontLoaded ? "HelveticaNowDisplay" : undefined },
            ]}
          >
            Never miss out on a hot release again with our latest's drops
            newsletter.
          </Text>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {CATEGORIES.map((category) => (
            <Pressable
              key={category}
              onPress={() => setActiveCategory(category)}
              style={[
                styles.categoryPill,
                activeCategory === category && styles.categoryPillActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    fontFamily: fontLoaded ? "HelveticaNowDisplay" : undefined,
                  },
                  activeCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Products Grid */}
        <View style={styles.productsGrid}>
          {PRODUCTS.map((product, index) => (
            <Pressable key={product.id} style={styles.productCard}>
              <View style={styles.productImageContainer}>
                <Image
                  source={{ uri: product.image }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
                <Pressable style={styles.favoriteButton}>
                  <Ionicons name="heart-outline" size={18} color="#fff" />
                </Pressable>
              </View>

              <View style={styles.productInfo}>
                <Text
                  style={[
                    styles.productName,
                    {
                      fontFamily: fontLoaded
                        ? "HelveticaNowDisplay"
                        : undefined,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {product.name}
                </Text>
                <Text
                  style={[
                    styles.productPrice,
                    { fontFamily: fontLoaded ? "DrukWide" : undefined },
                  ]}
                >
                  ${product.price}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Bottom Spacer */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <Pressable style={styles.tabItem}>
          <Ionicons name="home" size={22} color="#fff" />
        </Pressable>
        <Pressable style={styles.tabItem}>
          <Ionicons
            name="search-outline"
            size={22}
            color="rgba(255,255,255,0.4)"
          />
        </Pressable>
        <Pressable style={styles.tabItem}>
          <Ionicons
            name="bag-outline"
            size={22}
            color="rgba(255,255,255,0.4)"
          />
        </Pressable>
        <Pressable style={styles.tabItem}>
          <Ionicons
            name="person-outline"
            size={22}
            color="rgba(255,255,255,0.4)"
          />
        </Pressable>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 100,
  },

  headerCard: {
    marginHorizontal: 16,
    marginTop: 60,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 104,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  gridIcon: {
    width: 42,
    height: 42,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    justifyContent: "center",
    alignContent: "center",
    marginLeft: 10,
    padding: 2,
  },

  gridDot: {
    width: 9,
    height: 9,
    borderRadius: 103,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.7)",
  },

  profileContainer: {
    width: 44,
    height: 44,
    borderRadius: 102,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
  },

  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },

  titleSection: {
    paddingHorizontal: 24,
    marginTop: 32,
    marginBottom: 28,
  },

  labelText: {
    color: "#c9c5b9",
    fontSize: 12,
    letterSpacing: 3,
    marginBottom: 12,
  },

  titleText: {
    color: "#fff",
    fontSize: 38,
    lineHeight: 44,
    letterSpacing: 0.5,
    marginBottom: 16,
  },

  descriptionText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0.3,
  },

  categoriesContainer: {
    paddingHorizontal: 24,
    gap: 10,
    marginBottom: 24,
  },

  categoryPill: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: "transparent",
  },

  categoryPillActive: {
    backgroundColor: "#fff",
  },

  categoryText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
    letterSpacing: 0.3,
  },

  categoryTextActive: {
    color: "#000",
  },

  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 24,
    gap: 12,
  },

  productCard: {
    width: CARD_WIDTH,
    marginBottom: 8,
  },

  productImageContainer: {
    width: "100%",
    height: CARD_WIDTH * 1.2,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  productImage: {
    width: "100%",
    height: "100%",
  },

  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  productInfo: {
    paddingTop: 12,
    paddingHorizontal: 4,
  },

  productName: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    marginBottom: 4,
    letterSpacing: 0.3,
  },

  productPrice: {
    color: "#fff",
    fontSize: 16,
  },

  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 16,
    paddingBottom: 34,
    backgroundColor: "rgba(0,0,0,0.95)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },

  tabItem: {
    padding: 8,
  },
});
