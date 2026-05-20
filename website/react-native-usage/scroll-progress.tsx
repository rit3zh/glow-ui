import { View, Text, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { SymbolView } from "expo-symbols";
import { useSharedValue } from "react-native-reanimated";
import AnimatedScrollProgress from "@/components/micro-interactions/animated-scroll-progress";
import { CircularProgress } from "@/components/organisms/circular-progress";

const STORY = {
  title: "An Afterlife Denied",
  author: "James Scott",
  date: "August 03, 2023",
  content: `It was almost impossible to make out the lone figure, shuffling slowly across the expanse of sand, far below. Only his movement gave him away. Wrapped in pale shreds of clothing, caked in tan grit and burnt red by the oppressive sun, he was all but a part of the desert already.

Anubis, crouched in the shade of a rocky outcrop, panted his jackal tongue in an effort to cool himself. The heat of the clear day was extreme, the weight of its pressure, unrelenting. He pressed as much of his bare skin against the rocks as possible, his fingers spread wide against the sand-smoothed surface, all in an attempt to absorb their stored shade.

Unlike his prey, he had come prepared, and lapped greedily at the water from one of the many skins hung from his belt. It was not a day he would have chosen to enter the shifting sands. He sighed and shook his head.

The man's persistent stumbling had taken him out of view over the next rise. Reluctantly, Anubis stood. He took up his long, curved spear, and set out into the sun to continue the pursuit.

His endless trailing of the single soul was growing tiresome. As soon as he left the shelter of the rocks and felt the sting of the suns rays upon his bare skin yet again, he made a snap decision. It was time to speed things up.

Anubis strode on long legs across the dunes, consuming the distance between him and his prey quickly. The god towered over any human, and found his height most useful.

By noon, Anubis had caught up to the man. The weakling had fallen again. He approached in a way that cast his shadow long over the back of the poor soul, who trembled there on his hands and knees.

"But I'm not done yet…" He whispered.

"I would not be here, if that were true," Anubis said, extending an open hand.

To his dismay, the dying man turned and swatted his long, clawed fingers away and pushed himself to his feet.

"No." He croaked, and began walking again in earnest.

Anubis held still for a moment. His nose twitching, his lip curling in outrage. He could understand the reluctance of some humans - the young, the unexpectedly injured or the rapidly sick. But this? It was clear cut. Why fight it?

"Look around!" He snarled, "What chance do you have?"

"A better one than if I go with you!" The man said, not wasting the energy to turn his head.

"Give it up, human! Your time is done. Come with me to Osiris, be weighed and end this misery!"

"I told you." The fool coughed over split and scabbed lips, "I'm not done yet."

He ducked past the jackal-headed God, and kept walking into the endless dunes. He held his head high, somehow stronger for his defiance.`,
};

export default function App() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
    Coolvetica: require("@/assets/fonts/CoolveticaLt-Regular.ttf"),
  });

  const progress = useSharedValue<number>(0);

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" />

      <AnimatedScrollProgress
        fabWidth={280}
        fabHeight={56}
        fabBottomOffset={50}
        fabBackgroundColor="#151515"
        fabEndBackgroundColor="#fff"
        fabBorderRadius={28}
        showFabOnScroll
        fabAppearScrollOffset={50}
        onScrollProgressChange={(_value) => {
          progress.value = _value;
        }}
        renderInitialContent={() => (
          <View style={styles.fabContent}>
            <View style={styles.fabTextContent}>
              <Text
                style={[
                  styles.fabTitle,
                  fontLoaded && { fontFamily: "Coolvetica" },
                ]}
              >
                {STORY.title}
              </Text>
              <Text
                style={[
                  styles.fabSubtitle,
                  fontLoaded && { fontFamily: "SfProRounded" },
                ]}
              >
                Chapter 1
              </Text>
            </View>
            <View
              style={{
                position: "absolute",
                left: 200,
              }}
            >
              <CircularProgress
                progress={progress}
                size={36}
                renderIcon={() => (
                  <SymbolView
                    name="arrow.forward.circle.fill"
                    tintColor={"#fff"}
                    size={30}
                    resizeMode="scaleAspectFit"
                  />
                )}
                strokeWidth={3}
                backgroundColor="#333"
              />
            </View>
          </View>
        )}
        renderEndContent={() => (
          <>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
              }}
            >
              <View>
                <Text
                  style={[
                    { color: "#000", fontSize: 18 },
                    fontLoaded && { fontFamily: "Coolvetica" },
                  ]}
                >
                  Well done!
                </Text>

                <Text
                  style={[
                    { color: "#3d3d3d", fontSize: 12 },
                    fontLoaded && { fontFamily: "SfProRounded" },
                  ]}
                >
                  Let's move on.
                </Text>
              </View>
              <View
                style={{
                  position: "absolute",
                  left: 200,
                }}
              >
                <SymbolView
                  name="book.fill"
                  size={36}
                  style={{
                    marginRight: 10,
                  }}
                  resizeMode="scaleAspectFit"
                  tintColor="#000"
                />
              </View>
            </View>
          </>
        )}
      >
        <View style={styles.content}>
          <View style={styles.badge}>
            <Text
              style={[
                styles.badgeText,
                fontLoaded && { fontFamily: "SfProRounded" },
              ]}
            >
              Short Story
            </Text>
          </View>

          <Text
            style={[styles.title, fontLoaded && { fontFamily: "Coolvetica" }]}
          >
            {STORY.title}
          </Text>

          <View style={styles.authorRow}>
            <View style={styles.avatar}>
              <SymbolView name="person.fill" size={14} tintColor="#555" />
            </View>
            <View>
              <Text
                style={[
                  styles.author,
                  fontLoaded && { fontFamily: "HelveticaNowDisplay" },
                ]}
              >
                {STORY.author}
              </Text>
              <Text
                style={[
                  styles.date,
                  fontLoaded && { fontFamily: "SfProRounded" },
                ]}
              >
                {STORY.date}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text
            style={[styles.body, fontLoaded && { fontFamily: "SfProRounded" }]}
          >
            {STORY.content}
          </Text>
        </View>
      </AnimatedScrollProgress>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 140,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 12,
    color: "#555",
    fontWeight: "600",
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 24,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
  },
  author: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "500",
  },
  date: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#1a1a1a",
    marginVertical: 28,
  },
  body: {
    fontSize: 17,
    color: "#999",
    lineHeight: 28,
  },
  fabContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 0,
  },
  fabTextContent: {
    gap: 2,
  },
  fabTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  fabSubtitle: {
    fontSize: 12,
    color: "#555",
  },
});
