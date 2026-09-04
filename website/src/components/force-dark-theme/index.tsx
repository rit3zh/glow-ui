"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

export function ForceDarkTheme() {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);

  return null;
}
