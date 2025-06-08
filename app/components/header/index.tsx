import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
} from "react-native";
import {
  AnimatedScrollView,
  AnimatedScrollViewTitle,
  AnimatedScrollViewTitleWrapper,
  HeaderComponentWrapper,
  HeaderNavBar,
} from "@/components/templates/headers/parallax/index";
import {
  PlayingChangeEventPayload,
  VideoPlayer,
  VideoView,
  useVideoPlayer,
  VideoPlayerEvents,
} from "expo-video";
import { useEvent } from "expo";
import { LinearGradient } from "expo-linear-gradient";

import { SymbolView } from "expo-symbols";
import { Stack, useRouter, type Router } from "expo-router";
import { Header } from "@react-navigation/elements";

const duaLipaSongs = [
  {
    id: 1,
    title: "Levitating",
    artist: "Dua Lipa",
    duration: "3:23",
    image: {
      uri: "https://i.scdn.co/image/ab67616d0000b2734bc66095f8a70bc4e6593f4f",
    },
    liked: true,
    album: "Future Nostalgia",
    year: 2020,
    plays: "1.2B",
  },
  {
    id: 2,
    title: "Don't Start Now",
    artist: "Dua Lipa",
    duration: "3:03",
    image: {
      uri: "https://i.scdn.co/image/ab67616d0000b273c35ea649223a519a9ad51ccf",
    },
    liked: true,
    album: "Future Nostalgia",
    year: 2019,
    plays: "2.1B",
  },
  {
    id: 3,
    title: "Physical",
    artist: "Dua Lipa",
    duration: "3:13",
    image: {
      uri: "https://i.scdn.co/image/ab67616d0000b273537e007e6eebfc945d9361f7",
    },
    liked: false,
    album: "Future Nostalgia",
    year: 2020,
    plays: "984M",
  },
  {
    id: 4,
    title: "New Rules",
    artist: "Dua Lipa",
    duration: "3:29",
    image: {
      uri: "https://i.scdn.co/image/ab67616d0000b273838698485511bd9108fadadc",
    },
    liked: true,
    album: "Dua Lipa",
    year: 2017,
    plays: "2.8B",
  },
  {
    id: 5,
    title: "One Kiss",
    artist: "Calvin Harris, Dua Lipa",
    duration: "3:34",
    image: {
      uri: "https://i.scdn.co/image/ab67616d0000b273d09f96d82310d4d77c14c108",
    },
    liked: true,
    album: "Funk Wav Bounces Vol. 1",
    year: 2018,
    plays: "1.9B",
  },
  {
    id: 6,
    title: "Houdini",
    artist: "Dua Lipa",
    duration: "3:06",
    image: {
      uri: "https://i.scdn.co/image/ab67616d0000b2738b58d20f1b77295730db15b4",
    },
    liked: true,
    album: "Radical Optimism",
    year: 2023,
    plays: "892M",
  },
];

const albums = [
  {
    id: 1,
    title: "Radical Optimism",
    year: 2024,
    image: "https://i.scdn.co/image/ab67616d0000b2735f530395ba026f49363c6d11",
    type: "Album",
  },
  {
    id: 2,
    title: "Future Nostalgia",
    year: 2020,
    image: "https://i.scdn.co/image/ab67616d0000b2734bc66095f8a70bc4e6593f4f",

    type: "Album",
  },
  {
    id: 3,
    title: "Dua Lipa",
    year: 2017,
    image: "https://i.scdn.co/image/ab67616d0000b273a22a7b828934f83ed9901354",
    type: "Album",
  },
];

const similarArtists = [
  {
    id: 1,
    name: "Ariana Grande",
    image: "https://i.scdn.co/image/ab6761610000e5eb6725802588d7dc1aba076ca5",
    followers: "89M",
  },
  {
    id: 2,
    name: "Taylor Swift",
    image: "https://i.scdn.co/image/ab6761610000e5ebe672b5f553298dcdccb0e676",
    followers: "95M",
  },
  {
    id: 3,
    name: "The Weeknd",
    image: "https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb",
    followers: "87M",
  },
  {
    id: 4,
    name: "Olivia Rodrigo",
    image: "https://i.scdn.co/image/ab6761610000e5ebe03a98785f3658f0b6461ec4",
    followers: "71M",
  },
];

export const HeaderDemo: React.FC = (): React.ReactNode => {
  const [activeTab, setActiveTab] = useState<"songs" | "albums" | "similar">(
    "songs",
  );
  const [isFollowing, setIsFollowing] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const videoSource = useVideoPlayer(
    require("@/assets/video/video-artist.mp4"),
    (player: VideoPlayer) => {
      player.loop = true;
      player.volume = 0;
      player.play();
    },
  );

  const router: Router = useRouter() as Router;

  const _ = useEvent<
    VideoPlayerEvents,
    "playingChange",
    (payload: PlayingChangeEventPayload) => void,
    {
      isPlaying: boolean;
      oldIsPlaying: boolean;
    }
  >(videoSource, "playingChange", {
    isPlaying: videoSource.playing,
    oldIsPlaying: videoSource.playing,
  });

  const { width } = useWindowDimensions();

  const StatsCard = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.statsCard}>
      <Text style={styles.statsValue}>{value}</Text>
      <Text style={styles.statsLabel}>{label}</Text>
    </View>
  );

  const TabButton = ({
    title,
    isActive,
    onPress,
  }: {
    title: string;
    isActive: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.activeTabButton]}
      onPress={onPress}
    >
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const AlbumCard = ({ album }: { album: (typeof albums)[0] }) => (
    <TouchableOpacity style={styles.albumCard}>
      <Image source={{ uri: album.image }} style={styles.albumImage} />
      <Text style={styles.albumTitle} numberOfLines={1}>
        {album.title}
      </Text>
      <Text style={styles.albumYear}>
        {album.year} • {album.type}
      </Text>
    </TouchableOpacity>
  );

  const ArtistCard = ({ artist }: { artist: (typeof similarArtists)[0] }) => (
    <TouchableOpacity style={styles.artistCard}>
      <Image source={{ uri: artist.image }} style={styles.artistImage} />
      <Text style={styles.artistName} numberOfLines={1}>
        {artist.name}
      </Text>
      <Text style={styles.artistFollowers}>{artist.followers} followers</Text>
      <TouchableOpacity style={styles.followButton}>
        <Text style={styles.followButtonText}>Follow</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Stack.Screen options={{ headerShown: false }} />

      <AnimatedScrollView
        showsVerticalScrollIndicator={false}
        renderHeaderNavBarComponent={() => (
          <Header
            headerBackground={() => <></>}
            title=""
            headerLeft={() => (
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => router.back()}
              >
                <SymbolView
                  name="chevron.backward"
                  size={20}
                  tintColor="white"
                  resizeMode="scaleAspectFit"
                />
              </TouchableOpacity>
            )}
            headerRight={() => (
              <View style={styles.headerRightContainer}>
                <TouchableOpacity style={styles.headerButton}>
                  <SymbolView
                    name="square.and.arrow.up"
                    size={18}
                    tintColor="white"
                    resizeMode="scaleAspectFit"
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerButton}>
                  <SymbolView
                    name="ellipsis"
                    size={18}
                    tintColor="white"
                    resizeMode="scaleAspectFit"
                  />
                </TouchableOpacity>
              </View>
            )}
            headerBackgroundContainerStyle={styles.headerBackground}
          />
        )}
        renderTopNavBarComponent={() => (
          <HeaderNavBar>
            <TouchableOpacity onPress={() => router.back()}>
              <SymbolView
                name="chevron.backward"
                size={18}
                tintColor="white"
                resizeMode="scaleAspectFit"
              />
            </TouchableOpacity>
            <Text style={styles.topNavTitle}>Dua Lipa</Text>
            <TouchableOpacity>
              <SymbolView
                name="ellipsis"
                size={18}
                tintColor="white"
                resizeMode="scaleAspectFit"
              />
            </TouchableOpacity>
          </HeaderNavBar>
        )}
        renderOveralComponent={() => (
          <AnimatedScrollViewTitleWrapper>
            <AnimatedScrollViewTitle size={42} style={styles.artistTitle}>
              Dua Lipa
            </AnimatedScrollViewTitle>
            <View style={styles.overlayControls}>
              <TouchableOpacity
                style={styles.shuffleButton}
                onPress={() => setIsShuffling(!isShuffling)}
              >
                <SymbolView
                  resizeMode="scaleAspectFit"
                  name={isShuffling ? "shuffle" : "shuffle"}
                  tintColor={isShuffling ? "#1DB954" : "white"}
                  size={20}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.playButton}>
                <SymbolView
                  name="play.fill"
                  tintColor="white"
                  size={20}
                  resizeMode="scaleAspectFit"
                />
              </TouchableOpacity>
            </View>
          </AnimatedScrollViewTitleWrapper>
        )}
        topBarHeight={100}
        renderHeaderComponent={() => (
          <HeaderComponentWrapper useGradient={false}>
            <VideoView
              style={styles.videoContainer}
              contentFit="cover"
              player={videoSource}
              nativeControls={false}
              allowsPictureInPicture={false}
              startsPictureInPictureAutomatically={false}
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)", "rgba(0,0,0,0.95)"]}
              style={styles.videoOverlay}
            />
          </HeaderComponentWrapper>
        )}
      >
        <View style={styles.content}>
          <View style={styles.artistInfo}>
            <View style={styles.artistMeta}>
              <View style={styles.verifiedBadge}>
                <SymbolView
                  name="checkmark.seal.fill"
                  resizeMode="scaleAspectFit"
                  size={16}
                  tintColor="#1DB954"
                />
                <Text style={styles.verifiedText}>Verified Artist</Text>
              </View>
              <Text style={styles.monthlyListeners}>
                67,234,567 monthly listeners
              </Text>
            </View>

            <View style={styles.statsRow}>
              <StatsCard label="Followers" value="54.2M" />
              <StatsCard label="Following" value="47" />
              <StatsCard label="Albums" value="3" />
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[
                  styles.followButton,
                  isFollowing && styles.followingButton,
                ]}
                onPress={() => setIsFollowing(!isFollowing)}
              >
                <Text
                  style={[
                    styles.followButtonText,
                    isFollowing && styles.followingButtonText,
                  ]}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <SymbolView
                  name="bell"
                  size={16}
                  tintColor="#9CA3AF"
                  resizeMode="scaleAspectFit"
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <SymbolView
                  name="square.and.arrow.up"
                  size={16}
                  resizeMode="scaleAspectFit"
                  tintColor="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.tabContainer}>
            <TabButton
              title="Popular"
              isActive={activeTab === "songs"}
              onPress={() => setActiveTab("songs")}
            />
            <TabButton
              title="Albums"
              isActive={activeTab === "albums"}
              onPress={() => setActiveTab("albums")}
            />
            <TabButton
              title="Similar"
              isActive={activeTab === "similar"}
              onPress={() => setActiveTab("similar")}
            />
          </View>

          {activeTab === "songs" && (
            <View style={styles.songsContainer}>
              {duaLipaSongs.map((song, index) => (
                <TouchableOpacity key={song.id} style={styles.songRow}>
                  <View style={styles.songLeft}>
                    <Text style={styles.songNumber}>{index + 1}</Text>
                    <Image
                      source={{ uri: song.image.uri }}
                      style={styles.songImage}
                    />
                    <View style={styles.songInfo}>
                      <Text style={styles.songTitle} numberOfLines={1}>
                        {song.title}
                      </Text>
                      <View style={styles.songMeta}>
                        <Text style={styles.songArtist}>{song.artist}</Text>
                        <Text style={styles.songPlays}> • {song.plays}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.songRight}>
                    <TouchableOpacity style={styles.likeButton}>
                      <SymbolView
                        resizeMode="scaleAspectFit"
                        name={song.liked ? "heart.fill" : "heart"}
                        size={16}
                        tintColor={song.liked ? "#1DB954" : "#6B7280"}
                      />
                    </TouchableOpacity>
                    <Text style={styles.songDuration}>{song.duration}</Text>
                    <TouchableOpacity style={styles.moreButton}>
                      <SymbolView
                        name="ellipsis"
                        size={16}
                        tintColor="#6B7280"
                        resizeMode="scaleAspectFit"
                      />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {activeTab === "albums" && (
            <View style={styles.albumsContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollEnabled
              >
                {albums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </ScrollView>
            </View>
          )}

          {activeTab === "similar" && (
            <View style={styles.similarContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollEnabled
              >
                {similarArtists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.aboutSection}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.aboutText}>
              English singer, songwriter, and model Dua Lipa has established
              herself as one of the most successful pop artists of her
              generation. Known for her distinctive voice and dance-pop sound,
              she has won multiple Grammy Awards and broken numerous streaming
              records.
            </Text>
            <View style={styles.aboutStats}>
              <View style={styles.aboutStat}>
                <Text style={styles.aboutStatNumber}>67M</Text>
                <Text style={styles.aboutStatLabel}>Monthly Listeners</Text>
              </View>
              <View style={styles.aboutStat}>
                <Text style={styles.aboutStatNumber}>London</Text>
                <Text style={styles.aboutStatLabel}>Born In</Text>
              </View>
              <View style={styles.aboutStat}>
                <Text style={styles.aboutStatNumber}>2015</Text>
                <Text style={styles.aboutStatLabel}>Career Start</Text>
              </View>
            </View>
          </View>
        </View>
      </AnimatedScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  headerRightContainer: {
    flexDirection: "row",
    marginRight: 16,
  },
  headerBackground: {
    backgroundColor: "transparent",
  },
  topNavTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  videoContainer: {
    width: "100%",
    height: 400,
  },
  videoOverlay: {
    position: "absolute",
    width: "100%",
    height: 400,
    top: 0,
  },
  artistTitle: {
    color: "white",
    fontWeight: "700",
    letterSpacing: -1,
  },
  overlayControls: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    right: 20,
    bottom: 10,
    gap: 16,
  },
  shuffleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 32,
    backgroundColor: "#1DB954",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1DB954",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  artistInfo: {
    paddingVertical: 24,
  },
  artistMeta: {
    marginBottom: 20,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  verifiedText: {
    color: "#1DB954",
    fontSize: 14,
    fontWeight: "500",
  },
  monthlyListeners: {
    color: "#9CA3AF",
    fontSize: 16,
    fontWeight: "500",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statsCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  statsValue: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  statsLabel: {
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  followButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "white",
    borderRadius: 24,
    alignItems: "center",
  },
  followingButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#9CA3AF",
  },
  followButtonText: {
    color: "black",
    fontSize: 14,
    fontWeight: "600",
  },
  followingButtonText: {
    color: "#9CA3AF",
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 24,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#1DB954",
  },
  tabText: {
    color: "#9CA3AF",
    fontSize: 16,
    fontWeight: "500",
  },
  activeTabText: {
    color: "white",
    fontWeight: "600",
  },
  songsContainer: {
    marginBottom: 32,
  },
  songRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    justifyContent: "space-between",
  },
  songLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  songNumber: {
    color: "#9CA3AF",
    fontSize: 16,
    fontWeight: "500",
    width: 24,
    textAlign: "center",
    marginRight: 16,
  },
  songImage: {
    width: 48,
    height: 48,
    borderRadius: 6,
    marginRight: 16,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  songMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  songArtist: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  songPlays: {
    color: "#6B7280",
    fontSize: 12,
  },
  songRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  likeButton: {
    padding: 4,
  },
  songDuration: {
    color: "#9CA3AF",
    fontSize: 14,
    minWidth: 40,
    textAlign: "right",
  },
  moreButton: {
    padding: 4,
  },
  albumsContainer: {
    marginBottom: 32,
  },
  albumCard: {
    width: 160,
    marginRight: 16,
  },
  albumImage: {
    width: 160,
    height: 160,
    borderRadius: 8,
    marginBottom: 12,
  },
  albumTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  albumYear: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  similarContainer: {
    marginBottom: 32,
  },
  artistCard: {
    width: 140,
    marginRight: 16,
    alignItems: "center",
  },
  artistImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  artistName: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  artistFollowers: {
    color: "#9CA3AF",
    fontSize: 12,
    marginBottom: 12,
    textAlign: "center",
  },
  aboutSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  aboutText: {
    color: "#D1D5DB",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  aboutStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  aboutStat: {
    alignItems: "center",
  },
  aboutStatNumber: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  aboutStatLabel: {
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "500",
  },
});

export default HeaderDemo;
