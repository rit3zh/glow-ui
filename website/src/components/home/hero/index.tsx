"use client";

import {
  GithubStarButton,
  StarButtonFallback,
} from "./components/github-star-repo-button";
import { HeroFlip } from "./components/hero-flip";
import { StaggerBlurEffect } from "./components/stagger-blur";
import { AnimatedBadge } from "@/components/animated-badge";
import { AnimatedShinyButton } from "@/components/shiny-button";
import { motion } from "framer-motion";
import localFont from "next/font/local";
import { Suspense } from "react";
import Testimonials from "./testimonials";
import { DonationCard } from "./components/donation-card";
import { MarqueeDemo } from "./components/showcase";
import Footer from "./components/footer";
import FAQs from "./components/faq/index";

const bethanyFont = localFont({
  src: "../../../assets/fonts/Bethany-Elingston.otf",
  variable: "--font-bethany",
});

const drukwide = localFont({
  src: "../../../assets/fonts/DrukWideBold.ttf",
  variable: "--font-drukwide",
});

const satoshi = localFont({
  src: [
    {
      path: "../../../assets/fonts/Satoshi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../assets/fonts/Satoshi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../assets/fonts/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
  fallback: ["system-ui", "sans-serif"],
});

const SPONSORS = [
  {
    username: "ReactBits",
    url: "https://reactbits.dev?utm_source=uitripled&utm_medium=referral&utm_campaign=sponsors",
    logo: "https://iimydr2b8o.ufs.sh/f/Zqn6AViLMoTtd7oHoWu8kXBdOAypChQmW2xzMgu5YERnZaGF",
  },
  {
    username: "shadcn/studio",
    url: "https://shadcnstudio.com?utm_source=uitripled&utm_medium=referral&utm_campaign=sponsors",
    logo: "https://ts-assets.b-cdn.net/ss-assets/logo/logo.svg",
  },
  {
    username: "shadcnblocks",
    url: "https://shadcnblocks.com?utm_source=uitripled&utm_medium=referral&utm_campaign=sponsors",
  },
  {
    username: "OpenPanel",
    url: "https://openpanel.dev?utm_source=uitripled&utm_medium=referral&utm_campaign=sponsors",
    logo: "https://iimydr2b8o.ufs.sh/f/Zqn6AViLMoTtZSdcHpLMoTtqyenU7vkYSxEW4uPQlw3ps6NX",
  },
  {
    username: "lucide-animated",
    url: "https://lucide-animated.com?utm_source=uitripled&utm_medium=referral&utm_campaign=sponsors",
    logo: "/logos/sponsors/lucide-animated.svg",
  },
  {
    username: "shadcraft",
    url: "https://shadcraft.com?utm_source=uitripled&utm_medium=referral&utm_campaign=sponsors",
  },
];

export function Hero() {
  return (
    <>
      <div
        className={`${bethanyFont.variable} ${drukwide.variable} ${satoshi.variable} max-w-7xl mx-auto`}
      >
        <div className="text-center mb-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center gap-8 py-5"
          >
            <AnimatedBadge
              text="Introducing Reacticx Templates"
              color="#ffffff"
              href="/templates"
            />
            <h1
              className={`${satoshi.className} text-5xl tracking-tight text-foreground sm:text-7xl font-satoshi font-normal max-w-[15ch]`}
            >
              Build React Native apps that feel{" "}
              <StaggerBlurEffect
                className={`${satoshi.className} text-5xl tracking-tight text-foreground sm:text-7xl font-semibold`}
              >
                Premium.
              </StaggerBlurEffect>
            </h1>

            <div className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-center mt-2 sm:mt-3 md:mt-4 px-2 sm:px-4 leading-relaxed text-gray-300">
              Copy-paste production-ready components with silky-smooth
              animations.
              <div className="hidden md:block" />
              <div className="hidden md:flex items-center justify-center font-medium text-white text-center px-4 leading-tight ">
                <span>
                  Give your React Native app that premium, finished feel.
                </span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                <span>Built on top of</span>
                <div className="flex items-center gap-1.5 text-foreground">
                  <svg
                    fill="#fff"
                    viewBox="0 0 24 24"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-auto"
                  >
                    <path d="M0 20.084c.043.53.23 1.063.718 1.778.58.849 1.576 1.315 2.303.567.49-.505 5.794-9.776 8.35-13.29a.761.761 0 0 1 1.248 0c2.556 3.514 7.86 12.785 8.35 13.29.727.748 1.723.282 2.303-.567.57-.835.728-1.42.728-2.046 0-.426-8.26-15.798-9.092-17.078-.8-1.23-1.044-1.498-2.397-1.542h-1.032c-1.353.044-1.597.311-2.398 1.542C8.267 3.991.33 18.758 0 19.77z" />
                  </svg>
                  <span>Expo</span>
                </div>
              </div>

              <span className="hidden md:inline dark:text-neutral-700 text-neutral-300">
                /
              </span>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                <span>Core built in</span>
                <HeroFlip />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
              <AnimatedShinyButton url="/components/apple-intelligence">
                View Components
              </AnimatedShinyButton>

              <Suspense fallback={<StarButtonFallback />}>
                <GithubStarButton />
              </Suspense>
            </div>
          </motion.div>
        </div>
        <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
          <MarqueeDemo />
        </div>

        <div className="space-y-32 mt-32">
          <Suspense
            fallback={
              <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 z-10 relative">
                <div className="flex gap-6 overflow-hidden">
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className="w-[300px] sm:w-[350px] shrink-0 rounded-xl border border-border bg-background p-5 shadow-sm"
                    >
                      <div className="flex flex-row items-start gap-4 pb-2">
                        <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                        <div className="flex flex-col gap-0.5 flex-1">
                          <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                          <div className="h-3 w-16 rounded bg-muted animate-pulse" />
                        </div>
                      </div>
                      <div className="pt-2 space-y-2">
                        <div className="h-3 w-full rounded bg-muted animate-pulse" />
                        <div className="h-3 w-full rounded bg-muted animate-pulse" />
                        <div className="h-3 w-3/4 rounded bg-muted animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            }
          >
            <Testimonials />
          </Suspense>
          <DonationCard />
          <FAQs />
        </div>
      </div>
      <Footer />
    </>
  );
}
