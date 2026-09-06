import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeOut,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SiriProvider } from "@/components/organisms/apple-intelligence";
import { useSiri } from "@/components/organisms/apple-intelligence/context";
import type { ISiriContext } from "@/components/organisms/apple-intelligence/types";
import { Showcase } from "~/showcase";
const CARD_HEIGHT = 322;
const CARD_RADIUS = 26;

const GLOW_COLORS = ["#FF6B9D", "#C44AFF", "#5856D6", "#00C9FF", "#FF6B9D"];

const SIRI_CONFIG = {
  glow: { colors: GLOW_COLORS, speed: 0.24 },
  border: { radius: CARD_RADIUS, spread: 12, margin: 2 },
  wave: { strength: 0.8, origin: [0.5, 1] as [number, number] },
  shimmer: { amount: 0.4, speed: 2.8 },
};

const WHITE = "#FFFFFF";
const W06 = "rgba(255,255,255,0.06)";
const W10 = "rgba(255,255,255,0.10)";
const W32 = "rgba(255,255,255,0.32)";
const W55 = "rgba(255,255,255,0.55)";
const W88 = "rgba(255,255,255,0.88)";
const ACCENT = "#C9A7FF";
const ACCENT_BG = "rgba(201,167,255,0.12)";

const SparkleIcon = ({
  size = 14,
  color = WHITE,
}: {
  size?: number;
  color?: string;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C12.6 6.4 13.9 8.5 18.5 9.9C13.9 11.3 12.6 13.4 12 17.8C11.4 13.4 10.1 11.3 5.5 9.9C10.1 8.5 11.4 6.4 12 2Z"
      fill={color}
    />
    <Path
      d="M18.6 15.4C18.9 17.3 19.4 18.1 21 18.7C19.4 19.3 18.9 20.1 18.6 22C18.3 20.1 17.8 19.3 16.2 18.7C17.8 18.1 18.3 17.3 18.6 15.4Z"
      fill={color}
      opacity={0.7}
    />
  </Svg>
);

const UndoIcon = ({ color = W55 }: { color?: string }) => (
  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 9H15C17.76 9 20 11.24 20 14C20 16.76 17.76 19 15 19H8"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 5L4 9L8 13"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const MAIL = {
  initials: "DL",
  sender: "Dana Lowe",
  to: "to me, Priya",
  time: "9:41 AM",
  subject: "Re: Q3 launch timeline",
  body: [
    "Hey — pushing the beta a week so QA can finish the payments pass. Marketing is fine with it as long as the store copy lands by the 12th.",
    "Design handed off the new onboarding yesterday; only the empty states are still open. I'll get you a build Thursday.",
    "Can you confirm the pricing page copy before Friday standup?",
  ],
};

const SUMMARY = [
  "Beta slips one week for the payments QA pass.",
  "Store copy is due the 12th; build lands Thursday.",
  "Needs your pricing page copy before Friday standup.",
];

const SiriBridge = ({
  onReady,
}: {
  onReady: (ctx: ISiriContext) => void;
}): null => {
  const siri = useSiri();
  useEffect(() => {
    onReady(siri);
  }, [siri, onReady]);
  return null;
};

const PulseDot = ({ delay = 0, color }: { delay?: number; color: string }) => {
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.6, { duration: 460, easing: Easing.out(Easing.quad) }),
          withTiming(1, { duration: 460, easing: Easing.in(Easing.quad) }),
        ),
        -1,
        true,
      ),
    );
  }, []);
  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: interpolate(scale.value, [1, 1.6], [0.4, 1]),
  }));
  return (
    <Animated.View style={[s.pulseDot, { backgroundColor: color }, anim]} />
  );
};

const MailHeader = () => (
  <View style={s.senderRow}>
    <LinearGradient
      colors={["rgba(255,255,255,0.18)", "rgba(255,255,255,0.06)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={s.avatar}
    >
      <Text style={s.avatarText}>{MAIL.initials}</Text>
    </LinearGradient>
    <View style={s.senderCol}>
      <Text style={s.senderName}>{MAIL.sender}</Text>
      <Text style={s.senderMeta}>{MAIL.to}</Text>
    </View>
    <Text style={s.time}>{MAIL.time}</Text>
  </View>
);

const MailView = () => (
  <Animated.View style={s.fill} entering={FadeIn.duration(240)}>
    <Text style={s.subject}>{MAIL.subject}</Text>
    {MAIL.body.map((p, i) => (
      <Text key={i} style={s.body}>
        {p}
      </Text>
    ))}
  </Animated.View>
);

const SummaryView = ({ onRevert }: { onRevert: () => void }) => (
  <Animated.View
    style={s.fill}
    entering={FadeIn.duration(300)}
    exiting={FadeOut.duration(160)}
  >
    <Text style={s.subject}>{MAIL.subject}</Text>

    {SUMMARY.map((line, i) => (
      <Animated.View
        key={i}
        style={s.bulletRow}
        entering={FadeInDown.delay(60 + i * 80)
          .duration(340)
          .easing(Easing.out(Easing.quad))}
      >
        <View style={s.bulletDot} />
        <Text style={s.bulletText}>{line}</Text>
      </Animated.View>
    ))}
  </Animated.View>
);

export default function AppleIntelligenceScreen() {
  const [fontLoaded] = useFonts({
    SfProRounded: require("@/assets/fonts/sf-pro-rounded.ttf"),
    HelveticaNowDisplay: require("@/assets/fonts/HelveticaNowDisplayMedium.ttf"),
  });

  const siriRef = useRef<ISiriContext | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [summarized, setSummarized] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleReady = useCallback((ctx: ISiriContext) => {
    siriRef.current = ctx;
  }, []);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
    },
    [],
  );

  const run = useCallback(
    (next: boolean) => {
      const siri = siriRef.current;
      if (!siri || busy) return;

      setBusy(true);

      siri.toggle();

      timers.current.push(
        setTimeout(() => setSummarized(next), 1700),
        setTimeout(() => {
          siriRef.current?.toggle();
          setBusy(false);
        }, 2200),
      );
    },
    [busy],
  );

  if (!fontLoaded) return <View style={s.root} />;

  return (
    <Showcase>
      <View style={s.root}>
        <StatusBar barStyle="light-content" />

        <View style={s.cardWrap}>
          <SiriProvider
            introDuration={1100}
            outroDuration={520}
            {...SIRI_CONFIG}
          >
            <SiriBridge onReady={handleReady} />
            <View style={s.card}>
              <MailHeader />
              <View style={s.rule} />
              {summarized ? (
                <SummaryView onRevert={() => run(false)} />
              ) : (
                <MailView />
              )}
            </View>
          </SiriProvider>
        </View>

        <Pressable
          style={[
            s.actionBtn,
            summarized ? s.actionBtnGhost : s.actionBtnSolid,
            busy && s.actionBtnBusy,
          ]}
          onPress={() => run(!summarized)}
          disabled={busy}
        >
          {busy ? (
            <View style={s.dotsRow}>
              <PulseDot delay={0} color="#C44AFF" />
              <PulseDot delay={110} color="#FF6B9D" />
              <PulseDot delay={220} color="#00C9FF" />
            </View>
          ) : (
            <SparkleIcon size={15} color={summarized ? W88 : "#000"} />
          )}
          <Text
            style={[
              s.actionText,
              summarized || busy ? s.actionTextLight : s.actionTextDark,
            ]}
          >
            {busy ? "Summarizing…" : summarized ? "Show original" : "Summarize"}
          </Text>
        </Pressable>
      </View>
    </Showcase>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingTop: 68,
  },
  fill: { flex: 1 },

  header: { marginBottom: 22 },
  eyebrow: {
    fontFamily: "SfProRounded",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.6,
    color: W32,
    marginBottom: 7,
  },
  title: {
    fontFamily: "HelveticaNowDisplay",
    fontSize: 26,
    fontWeight: "700",
    color: WHITE,
    letterSpacing: -0.7,
  },

  cardWrap: { height: CARD_HEIGHT, marginBottom: 18 },
  card: {
    flex: 1,
    backgroundColor: "#0C0C0F",
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 18,
    overflow: "hidden",
  },

  senderRow: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarText: {
    fontFamily: "SfProRounded",
    fontSize: 12,
    fontWeight: "700",
    color: W88,
    letterSpacing: 0.2,
  },
  senderCol: { flex: 1 },
  senderName: {
    fontFamily: "SfProRounded",
    fontSize: 14,
    fontWeight: "600",
    color: WHITE,
    letterSpacing: -0.1,
  },
  senderMeta: {
    fontFamily: "SfProRounded",
    fontSize: 11,
    color: W32,
    marginTop: 2,
  },
  time: {
    fontFamily: "SfProRounded",
    fontSize: 11,
    color: W32,
  },

  rule: {
    height: 1,
    backgroundColor: W06,
    marginTop: 14,
    marginBottom: 14,
  },

  subject: {
    fontFamily: "HelveticaNowDisplay",
    fontSize: 17,
    fontWeight: "700",
    color: WHITE,
    letterSpacing: -0.3,
    marginBottom: 11,
  },
  body: {
    fontFamily: "SfProRounded",
    fontSize: 12.5,
    lineHeight: 19,
    color: W55,
    marginBottom: 9,
  },

  summaryHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  summaryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 100,
    backgroundColor: ACCENT_BG,
  },
  summaryBadgeText: {
    fontFamily: "SfProRounded",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.1,
    color: ACCENT,
  },
  revertBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 100,
    backgroundColor: W06,
  },
  revertText: {
    fontFamily: "SfProRounded",
    fontSize: 11,
    fontWeight: "600",
    color: W55,
  },

  bulletRow: { flexDirection: "row", marginBottom: 12, paddingRight: 2 },
  bulletDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: ACCENT,
    marginTop: 8,
    marginRight: 10,
  },
  bulletText: {
    flex: 1,
    fontFamily: "SfProRounded",
    fontSize: 13.5,
    lineHeight: 20,
    color: W88,
    letterSpacing: -0.1,
  },

  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 50,
    borderRadius: 25,
  },
  actionBtnSolid: { backgroundColor: WHITE },
  actionBtnGhost: {
    backgroundColor: W06,
    borderWidth: 1,
    borderColor: W10,
  },
  actionBtnBusy: { opacity: 0.7 },
  actionText: {
    fontFamily: "SfProRounded",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: -0.1,
  },
  actionTextDark: { color: "#000" },
  actionTextLight: { color: WHITE },
  dotsRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  pulseDot: { width: 5, height: 5, borderRadius: 2.5 },
});
