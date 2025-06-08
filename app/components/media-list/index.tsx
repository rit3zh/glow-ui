import Native, {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  ScaledSize,
} from "react-native";
import * as React from "react";
import { MediaList, Row } from "@/components";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
const { width: WIDTH }: ScaledSize = Dimensions.get("window");

const MediaListDemo: React.FC = (_$_): React.ReactNode => {
  const mediaData = [
    {
      id: "1",
      title: "Echoes of Dusk",
      subtitle: "Ambient Chill",
      imageUrl: "https://picsum.photos/200/200?random=11",
      artist: "Night Fade",
      lastPlayed: "2 days ago",
    },
    {
      id: "2",
      title: "Skyline Groove",
      subtitle: "Nu-Disco",
      imageUrl: "https://picsum.photos/200/200?random=12",
      artist: "Velvet Pulse",
      lastPlayed: "1 week ago",
    },
    {
      id: "3",
      title: "Hollow Moon",
      subtitle: "Alternative Rock",
      imageUrl: "https://picsum.photos/200/200?random=13",
      artist: "The Outliers",
      lastPlayed: "5 days ago",
    },
    {
      id: "4",
      title: "Celestial Drift",
      subtitle: "Dream Pop",
      imageUrl: "https://picsum.photos/200/200?random=14",
      artist: "Nova Bloom",
      lastPlayed: "3 weeks ago",
    },
    {
      id: "5",
      title: "Crimson Trails",
      subtitle: "Synth Rock",
      imageUrl: "https://picsum.photos/200/200?random=15",
      artist: "Crimson Atlas",
      lastPlayed: "1 month ago",
    },
    {
      id: "6",
      title: "Golden Hour",
      subtitle: "Indie Folk",
      imageUrl: "https://picsum.photos/200/200?random=16",
      artist: "Sunset Valley",
      lastPlayed: "4 days ago",
    },
    {
      id: "7",
      title: "Pixel Dreams",
      subtitle: "Chiptune",
      imageUrl: "https://picsum.photos/200/200?random=17",
      artist: "Bitscape",
      lastPlayed: "2 weeks ago",
    },
    {
      id: "8",
      title: "Midnight Taxi",
      subtitle: "Lo-Fi Jazz",
      imageUrl: "https://picsum.photos/200/200?random=18",
      artist: "Noir Tones",
      lastPlayed: "6 days ago",
    },
    {
      id: "9",
      title: "Rainy Metropolis",
      subtitle: "Downtempo",
      imageUrl: "https://picsum.photos/200/200?random=19",
      artist: "Echo District",
      lastPlayed: "3 days ago",
    },
    {
      id: "10",
      title: "Candlelit Code",
      subtitle: "Neo Classical",
      imageUrl: "https://picsum.photos/200/200?random=20",
      artist: "Digital Sonata",
      lastPlayed: "5 hours ago",
    },
    {
      id: "11",
      title: "Wanderlust",
      subtitle: "World Fusion",
      imageUrl: "https://picsum.photos/200/200?random=21",
      artist: "Nomad Spirits",
      lastPlayed: "2 weeks ago",
    },
    {
      id: "12",
      title: "Paper Planes",
      subtitle: "Bedroom Pop",
      imageUrl: "https://picsum.photos/200/200?random=22",
      artist: "Soft Static",
      lastPlayed: "8 days ago",
    },
    {
      id: "13",
      title: "Neon Samurai",
      subtitle: "Electro Funk",
      imageUrl: "https://picsum.photos/200/200?random=23",
      artist: "Blade Motion",
      lastPlayed: "1 week ago",
    },
    {
      id: "14",
      title: "Retro Heartbeat",
      subtitle: "Vaporwave",
      imageUrl: "https://picsum.photos/200/200?random=24",
      artist: "Y2K Phantom",
      lastPlayed: "2 days ago",
    },
    {
      id: "15",
      title: "Frozen Silence",
      subtitle: "Piano Ambient",
      imageUrl: "https://picsum.photos/200/200?random=25",
      artist: "Glacier Echo",
      lastPlayed: "6 hours ago",
    },
    {
      id: "16",
      title: "Gravity Rush",
      subtitle: "Drum & Bass",
      imageUrl: "https://picsum.photos/200/200?random=26",
      artist: "Pulse Reactor",
      lastPlayed: "3 weeks ago",
    },
    {
      id: "17",
      title: "Velvet Rain",
      subtitle: "Soul Jazz",
      imageUrl: "https://picsum.photos/200/200?random=27",
      artist: "Moody Waters",
      lastPlayed: "4 days ago",
    },
    {
      id: "18",
      title: "Serotonin Bloom",
      subtitle: "Indie Electronic",
      imageUrl: "https://picsum.photos/200/200?random=28",
      artist: "Lucid Violet",
      lastPlayed: "1 day ago",
    },
    {
      id: "19",
      title: "Signal Fade",
      subtitle: "Experimental",
      imageUrl: "https://picsum.photos/200/200?random=29",
      artist: "The Signalist",
      lastPlayed: "2 weeks ago",
    },
    {
      id: "20",
      title: "Sunset Alley",
      subtitle: "City Pop",
      imageUrl: "https://picsum.photos/200/200?random=30",
      artist: "Tokyo Mirage",
      lastPlayed: "9 days ago",
    },
  ];

  const suggestionSongs = [
    {
      id: "1",
      title: "Moral of the Story",
      artist: "Ashe",
      imagheUrl:
        "https://i.scdn.co/image/ab67616d0000b273aea0d98794e91056c608e069",
    },
    {
      id: "2",
      title: "Marry On A Cross",
      artist: "Ghost",
      imagheUrl:
        "https://i.scdn.co/image/ab67616d0000b273bef9b0a348ea8dd18a581025",
    },
    {
      id: "3",
      title: "The Night We Met",
      artist: "Lord Huron",
      imagheUrl:
        "https://i.scdn.co/image/ab67616d0000b273e5d72e7141406c974ff5f8f7",
    },
    {
      id: "4",
      title: "Lose Yourself to Dance",
      artist: "Daft Punk",
      imagheUrl:
        "https://i.scdn.co/image/ab67616d0000b2739b9b36b0e22870b9f542d937",
    },
    {
      id: "5",
      title: "Electric Feel",
      artist: "MGMT",
      imagheUrl:
        "https://i.scdn.co/image/ab67616d0000b2738b32b139981e79f2ebe005eb",
    },
    {
      id: "6",
      title: "Take Me Out",
      artist: "Franz Ferdinand",
      imagheUrl:
        "https://i.scdn.co/image/ab67616d0000b27334a9b88a4277baba983a3e0f",
    },
    {
      id: "7",
      title: "Electric Love",
      artist: "BØRNS",
      imagheUrl:
        "https://i.scdn.co/image/ab67616d0000b273cc2cf912462d8ae4ef856434",
    },
    {
      id: "8",
      title: "Young Folks",
      artist: "Peter Bjorn and John",
      imagheUrl:
        "https://i.scdn.co/image/ab67616d0000b273db2c07b93263280a636c1567",
    },
    {
      id: "9",
      title: "Electricity",
      artist: "Orchestral Manoeuvres in the Dark",
      imagheUrl:
        "https://i.scdn.co/image/ab67616d0000b27346c913077ad733cf423eab13",
    },
    {
      id: "10",
      title: "Electric Avenue",
      artist: "Eddy Grant",
      imagheUrl:
        "https://i.scdn.co/image/ab67616d0000b2731bb60b953cfcf692a4593dd0",
    },
    {
      id: "11",
      title: "Electricity",
      artist: " Dua Lipa",
      imagheUrl:
        "https://i.scdn.co/image/ab67616d0000b273a334001297c78a5da11d5b58",
    },
    {
      id: "12",
      title: "Electric Feel (Justice Remix)",
      artist: "MGMT",
      imagheUrl:
        "https://i.scdn.co/image/ab67616d0000b273a798fc88faec4742d22c59d6",
    },
    {
      id: "13",
      title: "Electric Daisy Violin",
      artist: "Lindsey Stirling",
      imagheUrl:
        "https://i.scdn.co/image/ab67616d0000b2735dd445aedd1a14524aa9ef79",
    },
    {
      id: "14",
      title: "Electricity (From 'Billy Elliot')",
      artist: "Elton John",
      imagheUrl:
        "https://i.scdn.co/image/ab67616d0000b27398c23219a69071231259c821",
    },
    {
      id: "15",
      title: "Electric Ladyland",
      artist: "The Jimi Hendrix Experience",
      imagheUrl:
        "https://i.scdn.co/image/ab67616d0000b273522088789d49e216d9818292",
    },
    //2
    {
      id: "16",
      title: "Fortnight",
      subtitle: "Pop",
      imagheUrl:
        "https://i.scdn.co/image/ab67616d0000b273e6b77b3eef9269d06e13fe17",
      artist: "Taylor Swift ft. Post Malone",
    },
    {
      id: "17",
      title: "Love Me JeJe",
      subtitle: "Afrobeats",
      imagheUrl:
        "https://i.scdn.co/image/ab67616d0000b273142605c02c45f3de0feb94d4",
      artist: "Tems",
      lastPlayed: "1 week ago",
    },
    {
      id: "18",
      title: "Die With A Smile",
      subtitle: "Pop",
      imagheUrl:
        "https://i.scdn.co/image/ab67616d0000b27382ea2e9e1858aa012c57cd45",
      artist: "Lady Gaga",
      lastPlayed: "3 days ago",
    },
    {
      id: "19",
      title: "São Paulo",
      subtitle: "Latin Pop",
      imagheUrl:
        "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84192e13ef5b5e238b600d976c",
      artist: "Anitta ft. The Weeknd",
      lastPlayed: "5 days ago",
    },
    {
      id: "20",
      title: "Some Sexy Songs 4 U",
      subtitle: "R&B",
      imagheUrl:
        "https://i.scdn.co/image/ab6765630000ba8a3362a86489a185350b9fb12a",
      artist: "Drake & PartyNextDoor",
      lastPlayed: "1 day ago",
    },

    {
      id: "21",
      title: "Blinding Lights",
      subtitle: "Synthwave",
      imagheUrl:
        "https://i.scdn.co/image/ab67616d0000b273a3eff72f62782fb589a492f9",
      artist: "The Weeknd",
      lastPlayed: "1 day ago",
    },

    {
      id: "22",
      title: "Levitating",
      subtitle: "Disco-Pop",
      imagheUrl:
        "https://i.scdn.co/image/ab67616d0000b2734bc66095f8a70bc4e6593f4f",
      artist: "Dua Lipa ft. DaBaby",
      lastPlayed: "3 days ago",
    },

    {
      id: "23",
      title: "Watermelon Sugar",
      subtitle: "Pop",
      imagheUrl:
        "https://i.scdn.co/image/ab67616d0000b27377fdcfda6535601aff081b6a",
      artist: "Harry Styles",
      lastPlayed: "2 days ago",
    },

    {
      id: "24",
      title: "Peaches",
      subtitle: "R&B",
      imagheUrl:
        "https://i.scdn.co/image/ab67616d0000b273e6f407c7f3a0ec98845e4431",
      artist: "Justin Bieber ft. Daniel Caesar & Giveon",
      lastPlayed: "1 week ago",
    },
  ];

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#0a0a0a",
      }}
      contentContainerStyle={{
        flexGrow: 1,
        paddingVertical: 20,
      }}
      showsVerticalScrollIndicator={false}
      scrollEnabled={true}
      contentInsetAdjustmentBehavior="always"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            paddingHorizontal: 20,
            paddingBottom: 24,
          }}
        >
          <Row style={{ alignItems: "center", marginTop: 5 }}>
            <View className="top-3 mr-2">
              <MaterialCommunityIcons
                name="cards-playing"
                size={35}
                color="white"
              />
            </View>

            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: "#fafafa",
                marginBottom: 6,
              }}
            >
              Recently Played
            </Text>
          </Row>
          <Text
            style={{
              fontSize: 15,
              color: "#71717a",
              marginLeft: 45,
              bottom: 5,
            }}
          >
            Your favorite tracks from this week
          </Text>
        </View>

        <MediaList
          data={mediaData}
          chunkSize={4}
          keyExtractor={(item) => item.id}
          screenWidth={WIDTH}
          blurIntensity={10}
          animationConfig={{
            rotate: true,
          }}
          contentContainerStyle={{
            paddingLeft: 20,
          }}
          renderItem={(item, index) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              style={{
                marginBottom: index === mediaData.length - 1 ? 0 : 1,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 12,
                  paddingHorizontal: 0,
                }}
              >
                <Image
                  source={{ uri: item.imageUrl }}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 6,
                    backgroundColor: "#18181b",
                  }}
                />

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "500",
                      color: "#fafafa",
                      marginBottom: 2,
                    }}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#71717a",
                      fontWeight: "400",
                    }}
                    numberOfLines={1}
                  >
                    {item.artist}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#52525b",
                      marginRight: 8,
                      fontWeight: "400",
                    }}
                  >
                    {item.lastPlayed}
                  </Text>
                  <TouchableOpacity
                    style={{
                      padding: 4,
                      marginRight: 10,
                    }}
                  >
                    <Ionicons
                      name="ellipsis-horizontal"
                      size={16}
                      color="#52525b"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {index !== mediaData.length - 1 && (
                <View
                  style={{
                    height: 0.96,
                    backgroundColor: "#18181b",
                    marginLeft: 60,
                    bottom: 8,
                  }}
                />
              )}
            </TouchableOpacity>
          )}
        />
        <View className="ml-5 mt-3">
          <Row style={{ alignItems: "center" }}>
            <Feather name="info" size={24} color="#b0b0b0" />
            <Text className="text-zinc-500">
              ∙ All of your recently played tracks in one place
            </Text>
          </Row>
        </View>

        <View
          style={{
            alignItems: "center",
            marginTop: 20,
            marginLeft: 20,
            flexDirection: "row",
          }}
        >
          <View className="justify-center items-center">
            <Ionicons name="sparkles" size={24} color="white" />
          </View>
          <View className="ml-5 justify-center">
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: "#fafafa",
                marginBottom: 6,
              }}
            >
              Suggestions
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: "#71717a",

                bottom: 5,
              }}
            >
              Based on your recent listening habits
            </Text>
          </View>
        </View>

        <MediaList
          data={suggestionSongs}
          chunkSize={4}
          keyExtractor={(item) => item.id}
          screenWidth={WIDTH}
          blurIntensity={10}
          animationConfig={{
            scale: true,
            translateY: true,
            rotate: true,
          }}
          contentContainerStyle={{
            paddingLeft: 20,
          }}
          renderItem={(item, index) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              style={{
                marginBottom: index === mediaData.length - 1 ? 0 : 1,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 12,
                  paddingHorizontal: 0,
                }}
              >
                <Image
                  source={{ uri: item.imagheUrl }}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 6,
                    backgroundColor: "#18181b",
                  }}
                />

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "500",
                      color: "#fafafa",
                      marginBottom: 2,
                    }}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#71717a",
                      fontWeight: "400",
                    }}
                    numberOfLines={1}
                  >
                    {item.artist}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#52525b",
                      marginRight: 8,
                      fontWeight: "400",
                    }}
                  >
                    {item.lastPlayed}
                  </Text>
                  <TouchableOpacity
                    style={{
                      padding: 4,
                      marginRight: 10,
                    }}
                  >
                    <Ionicons
                      name="ellipsis-horizontal"
                      size={16}
                      color="#52525b"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {index !== mediaData.length - 1 && (
                <View
                  style={{
                    height: 0.96,
                    backgroundColor: "#18181b",
                    marginLeft: 60,
                    bottom: 8,
                  }}
                />
              )}
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </ScrollView>
  );
};

export default MediaListDemo;
