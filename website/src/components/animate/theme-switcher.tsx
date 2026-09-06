"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/workspace-ui/ui/button";
import { useThemeTransition } from "@/lib/use-theme-transition";
import { cn } from "@/components/workspace-ui/lib/utils";

export const ThemeSwitcher = ({ className }: { className?: string }) => {
  const { resolvedTheme, toggle, captureOrigin } = useThemeTransition();
  const [isClient, setIsClient] = useState(false);
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    isClient && (
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        onClickCapture={captureOrigin as React.MouseEventHandler}
        onClick={toggle}
        className={cn("relative overflow-hidden", className)}
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            key={isDark ? "sun" : "moon"}
            initial={{ opacity: 0, rotate: -45, scale: 0.75, y: 6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1, y: 0 }}
            exit={{ opacity: 0, rotate: 45, scale: 0.75, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="inline-flex"
          >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </motion.span>
        </AnimatePresence>
      </Button>
    )
  );
};
