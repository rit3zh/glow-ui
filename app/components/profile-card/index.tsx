import { Image, ScrollView, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";

import { DARK_PALETTE, ProfileCard } from "@/components/pieces/profile-card";
import { Showcase } from "~/showcase";

const AVATAR = {
  uri: "https://i.pinimg.com/1200x/6f/7d/09/6f7d09feb7ab51fa2aef37975a683e16.jpg",
};
const BANNER = {
  uri: "https://i.pinimg.com/1200x/97/6c/9a/976c9a0d1a0d17d8bd4421e8884e8704.jpg",
};

function Card({ dark }: { dark?: boolean }) {
  return (
    <ProfileCard palette={dark ? DARK_PALETTE : undefined}>
      <ProfileCard.Cover>
        <Image source={BANNER} style={StyleSheet.absoluteFill} />
      </ProfileCard.Cover>
      <ProfileCard.Avatar source={AVATAR} alt="rit3zh" />

      <ProfileCard.Body>
        <ProfileCard.Header>
          <ProfileCard.Name>rit3zh</ProfileCard.Name>
          <ProfileCard.Handle>@rit3zh.design</ProfileCard.Handle>
        </ProfileCard.Header>

        <ProfileCard.Bio>
          Product designer crafting simple, thoughtful experiences for the
          modern web. Design systems | UX | Coffee
        </ProfileCard.Bio>

        <ProfileCard.Location icon={true}>
          San Francisco, CA
        </ProfileCard.Location>
        <ProfileCard.Action onPress={() => {}}>
          Check Profile!
        </ProfileCard.Action>
      </ProfileCard.Body>
    </ProfileCard>
  );
}

export default function App() {
  return (
    <Showcase>
      <View style={styles.container}>
        <StatusBar style="light" />
        <Card dark />
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
