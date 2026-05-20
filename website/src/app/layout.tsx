import type { Metadata, Viewport } from "next";
import "./globals.css";
import { RootProvider } from "fumadocs-ui/provider/next";
import { Geist } from "next/font/google";
import { META_THEME_COLORS, siteConfig } from "@/app/config/site";
import { cn } from "#/lib/utils";
import { TooltipProvider } from "@/components/tooltip";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: `${siteConfig.name} - ${siteConfig.description}`,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  keywords: [
    "GlowUI",
    "React Native",
    "UI Components",
    "Open Source",
    "Expo",
    "Reanimated",
    "Gesture Handler",
    "Skia",
    "Mobile Development",
    "Cross-Platform",
    "Design System",
    "Frontend",
  ],
  robots: "index, follow",
  authors: [{ name: "rit3zh", url: "https://x.com/rit3zh" }],
  creator: "rit3zh",
  manifest: "/site.webmanifest",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    shortcut: "/favicon.png",
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: "/static/deps/reacticx-cover-without-trademark.png",
        width: 1200,
        height: 630,
        alt: "Reacticx - React Native UI Components Library",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@rit3zh",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/static/deps/reacticx-cover-without-trademark.png"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: META_THEME_COLORS.light,
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: META_THEME_COLORS.dark,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark"
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <body className={cn(geist.variable, geist.className, "antialiased")}>
        <RootProvider
          theme={{
            attribute: "class",
            defaultTheme: "dark",
            disableTransitionOnChange: true,
          }}
        >
          <TooltipProvider>{children}</TooltipProvider>
        </RootProvider>
      </body>
    </html>
  );
}
