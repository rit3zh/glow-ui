import "../global.css";
import * as React from "react";
import { Stack } from "expo-router";
import { Appearance } from "react-native";
import { AppProviders } from "../compositions/providers";
import { StatusBar } from "expo-status-bar";
Appearance.setColorScheme("dark");

export default function RootLayout() {
  return (
    <AppProviders>
      <StatusBar hidden />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        {/* @generated:component-routes:start */}
        <Stack.Screen name="components/3d-carousel/index" />
        <Stack.Screen name="components/accordion/index" />
        <Stack.Screen name="components/action-rail/index" />
        <Stack.Screen name="components/add-address-new/index" />
        <Stack.Screen name="components/air-bnb-v2/index" />
        <Stack.Screen name="components/airbnb-v1/index" />
        <Stack.Screen name="components/alert/index" />
        <Stack.Screen name="components/animated-chip/index" />
        <Stack.Screen name="components/animated-header-scrollview/index" />
        <Stack.Screen name="components/animated-input-bar/index" />
        <Stack.Screen name="components/animated-masked-text/index" />
        <Stack.Screen name="components/animated-text/index" />
        <Stack.Screen name="components/animated-theme-toggle/index" />
        <Stack.Screen name="components/apple-intelligence/index" />
        <Stack.Screen name="components/apple-v1/index" />
        <Stack.Screen name="components/arc-list/index" />
        <Stack.Screen name="components/aura-lift/index" />
        <Stack.Screen name="components/aurora/index" />
        <Stack.Screen name="components/avatar/index" />
        <Stack.Screen name="components/bar-chart/index" />
        <Stack.Screen name="components/barcode-badge/index" />
        <Stack.Screen name="components/billing-v1/index" />
        <Stack.Screen name="components/blur-carousel/index" />
        <Stack.Screen name="components/book-page/index" />
        <Stack.Screen name="components/border-beam/index" />
        <Stack.Screen name="components/bouncy-accordion/index" />
        <Stack.Screen name="components/button/index" />
        <Stack.Screen name="components/chat-v1/index" />
        <Stack.Screen name="components/check-box/index" />
        <Stack.Screen name="components/chroma-ring/index" />
        <Stack.Screen name="components/chrome-backdrop/index" />
        <Stack.Screen name="components/cinematic-carousel/index" />
        <Stack.Screen name="components/circle-loader/index" />
        <Stack.Screen name="components/circular-carousel/index" />
        <Stack.Screen name="components/circular-list/index" />
        <Stack.Screen name="components/circular-loader/index" />
        <Stack.Screen name="components/circular-progress/index" />
        <Stack.Screen name="components/circular-text/index" />
        <Stack.Screen name="components/context-menu/index" />
        <Stack.Screen name="components/coupon/index" />
        <Stack.Screen name="components/curved-bottom-tabs/index" />
        <Stack.Screen name="components/curved-marquee/index" />
        <Stack.Screen name="components/dia-text/index" />
        <Stack.Screen name="components/dialog/index" />
        <Stack.Screen name="components/disclosure-group/index" />
        <Stack.Screen name="components/dust-text/index" />
        <Stack.Screen name="components/dynamic-text/index" />
        <Stack.Screen name="components/elastic-slider/index" />
        <Stack.Screen name="components/email-verification-v1/index" />
        <Stack.Screen name="components/empty-collection-v1/index" />
        <Stack.Screen name="components/empty-gallary-v1/index" />
        <Stack.Screen name="components/empty-gift-v1/index" />
        <Stack.Screen name="components/empty-inbox-v1/index" />
        <Stack.Screen name="components/energy-orb/index" />
        <Stack.Screen name="components/event-ticket-card/index" />
        <Stack.Screen name="components/expandable-view/index" />
        <Stack.Screen name="components/fade-component/index" />
        <Stack.Screen name="components/fade-text/index" />
        <Stack.Screen name="components/fan-menu/index" />
        <Stack.Screen name="components/filling-stack/index" />
        <Stack.Screen name="components/flexi-button/index" />
        <Stack.Screen name="components/flip-card/index" />
        <Stack.Screen name="components/gooey-popover/index" />
        <Stack.Screen name="components/gooey-search-tabs/index" />
        <Stack.Screen name="components/gooey-switch/index" />
        <Stack.Screen name="components/gooey-text/index" />
        <Stack.Screen name="components/gradient-avatar/index" />
        <Stack.Screen name="components/gradient-wave-text/index" />
        <Stack.Screen name="components/grainy-gradient/index" />
        <Stack.Screen name="components/hamburger/index" />
        <Stack.Screen name="components/icon-tile/index" />
        <Stack.Screen name="components/infinite-menu/index" />
        <Stack.Screen name="components/letter-swarm/index" />
        <Stack.Screen name="components/line-chart/index" />
        <Stack.Screen name="components/liquid-chrome-text/index" />
        <Stack.Screen name="components/liquid-metal/index" />
        <Stack.Screen name="components/list/index" />
        <Stack.Screen name="components/marquee/index" />
        <Stack.Screen name="components/masked-tab-bar/index" />
        <Stack.Screen name="components/matched-geometry/index" />
        <Stack.Screen name="components/material-carousel/index" />
        <Stack.Screen name="components/media-list/index" />
        <Stack.Screen name="components/mesh-gradient/index" />
        <Stack.Screen name="components/metal/index" />
        <Stack.Screen name="components/mobile-dock/index" />
        <Stack.Screen name="components/morph-fab/index" />
        <Stack.Screen name="components/morph-loader/index" />
        <Stack.Screen name="components/morphing-tabbar/index" />
        <Stack.Screen name="components/nebula-orb/index" />
        <Stack.Screen name="components/number-flow/index" />
        <Stack.Screen name="components/orbiting-dots/index" />
        <Stack.Screen name="components/otp-input/index" />
        <Stack.Screen name="components/pagination/index" />
        <Stack.Screen name="components/parallax-carousel/index" />
        <Stack.Screen name="components/parallax-header/index" />
        <Stack.Screen name="components/photo-stack/index" />
        <Stack.Screen name="components/pie-chart/index" />
        <Stack.Screen name="components/polaroid/index" />
        <Stack.Screen name="components/pressable/index" />
        <Stack.Screen name="components/profile-card/index" />
        <Stack.Screen name="components/profile-settings-v1/index" />
        <Stack.Screen name="components/profile-settings-v2/index" />
        <Stack.Screen name="components/profile-settings-v3/index" />
        <Stack.Screen name="components/profile-settings-v4/index" />
        <Stack.Screen name="components/progress/index" />
        <Stack.Screen name="components/property-detail-v1/index" />
        <Stack.Screen name="components/pulsing-dots/index" />
        <Stack.Screen name="components/qr-code/index" />
        <Stack.Screen name="components/radar-chart/index" />
        <Stack.Screen name="components/radial-chart/index" />
        <Stack.Screen name="components/radial-intro/index" />
        <Stack.Screen name="components/radiant-button/index" />
        <Stack.Screen name="components/range-slider/index" />
        <Stack.Screen name="components/receipt-card/index" />
        <Stack.Screen name="components/ripple-button/index" />
        <Stack.Screen name="components/rolling-counter/index" />
        <Stack.Screen name="components/rotate-carousel/index" />
        <Stack.Screen name="components/rotating-square/index" />
        <Stack.Screen name="components/ruler/index" />
        <Stack.Screen name="components/save-button/index" />
        <Stack.Screen name="components/scale-carousel/index" />
        <Stack.Screen name="components/scrollable-search/index" />
        <Stack.Screen name="components/search-bar/index" />
        <Stack.Screen name="components/seek-bar/index" />
        <Stack.Screen name="components/segmented-control/index" />
        <Stack.Screen name="components/settings-v1/index" />
        <Stack.Screen name="components/shimmer/index" />
        <Stack.Screen name="components/shimmer-wave-text/index" />
        <Stack.Screen name="components/shockwave/index" />
        <Stack.Screen name="components/sign-up-v1/index" />
        <Stack.Screen name="components/sign-up-v2/index" />
        <Stack.Screen name="components/signup-v1/index" />
        <Stack.Screen name="components/siri-ios-27/index" />
        <Stack.Screen name="components/skia-ripple/index" />
        <Stack.Screen name="components/social-button/index" />
        <Stack.Screen name="components/spectral-wave/index" />
        <Stack.Screen name="components/spin-button/index" />
        <Stack.Screen name="components/spinner-arc/index" />
        <Stack.Screen name="components/split-view/index" />
        <Stack.Screen name="components/squiggly-slider/index" />
        <Stack.Screen name="components/squircle-view/index" />
        <Stack.Screen name="components/stacked-chips/index" />
        <Stack.Screen name="components/staggered-text/index" />
        <Stack.Screen name="components/switch/index" />
        <Stack.Screen name="components/tabs/index" />
        <Stack.Screen name="components/theme-switch/index" />
        <Stack.Screen name="components/tilt-carousel/index" />
        <Stack.Screen name="components/toast/index" />
        <Stack.Screen name="components/toggle/index" />
        <Stack.Screen name="components/tray/index" />
        <Stack.Screen name="components/unfold-menu/index" />
        <Stack.Screen name="components/unstable_orb/index" />
        <Stack.Screen name="components/verified-badge/index" />
        <Stack.Screen name="components/verified-shine/index" />
        <Stack.Screen name="components/vertical-flow-carousel/index" />
        <Stack.Screen name="components/vertical-page-carousel/index" />
        <Stack.Screen name="components/wave-scrawler/index" />
        <Stack.Screen name="components/welcome-v1/index" />
        <Stack.Screen name="components/welcome-v2/index" />
        <Stack.Screen name="components/welcome-v3/index" />
        <Stack.Screen name="components/welcome-v4/index" />
        {/* @generated:component-routes:end */}
      </Stack>
    </AppProviders>
  );
}
