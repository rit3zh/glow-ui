import "./global.css";
import { RootProvider } from "fumadocs-ui/provider";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { Banner } from "fumadocs-ui/components/banner";
const inter = Inter({
  subsets: ["latin"],
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Banner changeLayout={true} variant="rainbow" height="40px">
          React Native Glow UI v1 is out now!
        </Banner>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
