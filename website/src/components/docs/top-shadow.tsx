"use client";

import { useState, useEffect } from "react";

export function TopShadow() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 6);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-32 pointer-events-none z-40 transition-opacity duration-300 ${isScrolled ? "opacity-100" : "opacity-0"}`}
      style={{
        background:
          "linear-gradient(to bottom, var(--background), transparent)",
        maskImage: "linear-gradient(to bottom, black 40%, transparent)",
        WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent)",
      }}
    />
  );
}
