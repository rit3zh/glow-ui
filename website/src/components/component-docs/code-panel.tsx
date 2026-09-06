"use client";

import { motion, useReducedMotion, type Transition } from "motion/react";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { CopyButton } from "@/components/buttons/copy";
import { docsSurface } from "@/components/component-docs/surface";
import { cn } from "@/components/workspace-ui/lib/utils";

export interface CodePanelTab {
  id: string;
  label: string;
  icon?: ReactNode;
}

/** One spring drives the highlight, the slide and the height, so they agree. */
export const PANEL_SPRING: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  bounce: 0,
  restDelta: 0.01,
};

const panelClassName = cn(docsSurface, "text-sm");

/**
 * A code surface with a tab row.
 *
 * Used where the same command has several forms — the package managers — so
 * the header earns its place. Plain snippets use `CodeBlockPanel` instead,
 * which has no chrome above the code.
 */
export function CodePanel({
  copyCode,
  tabs,
  activeTab,
  onTabChange,
  tabListAriaLabel = "Options",
  renderPanel,
  className,
}: {
  copyCode: string;
  tabs: CodePanelTab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  tabListAriaLabel?: string;
  /** Called once per tab — every panel stays mounted inside the slide track. */
  renderPanel: (tabId: string) => ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const indicatorId = useId();
  const transition = reduceMotion ? { duration: 0 } : PANEL_SPRING;

  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.id === activeTab),
  );
  const { containerRef, paneRefs, height } = usePaneHeight(activeIndex);

  /**
   * One highlight shared by the row rather than a `hover:bg-*` per tab: a
   * per-tab background cross-fades, which reads as lag, while a single shared
   * element travels to whichever tab the pointer is on.
   */
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className={cn(panelClassName, className)} data-code-block>
      <div className="flex items-center justify-between gap-3 border-b-[0.5px] border-border/50 px-2.5 py-2">
        <div
          aria-label={tabListAriaLabel}
          className="no-scrollbar relative flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto"
          onPointerLeave={() => setHovered(null)}
          role="tablist"
        >
          {tabs.map((tab) => {
            const isSelected = activeTab === tab.id;
            const isHovered = hovered === tab.id;

            return (
              <button
                aria-selected={isSelected}
                className={cn(
                  "group relative shrink-0 rounded-lg px-2.5 py-1 text-[13px] font-medium outline-none transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-accent-pro/60",
                  isSelected || isHovered
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
                key={tab.id}
                onBlur={() => setHovered(null)}
                onClick={() => onTabChange(tab.id)}
                onFocus={() => setHovered(tab.id)}
                onPointerEnter={() => setHovered(tab.id)}
                role="tab"
                type="button"
              >
                {isHovered && !isSelected ? (
                  <motion.span
                    className="absolute inset-0 rounded-lg bg-foreground/6"
                    layoutId={`${indicatorId}-tab-hover`}
                    transition={transition}
                  />
                ) : null}

                {isSelected ? (
                  <motion.span
                    className="absolute inset-0 rounded-lg border-[0.5px] border-border/60 bg-accent"
                    layoutId={`${indicatorId}-tab-indicator`}
                    transition={transition}
                  />
                ) : null}

                <span className="relative flex items-center gap-1.5">
                  {tab.icon ? (
                    <span
                      className={cn(
                        // Each package manager is recognised by its colour, so
                        // the icons keep it — the label carries the selection.
                        "flex size-3.5 shrink-0 items-center justify-center transition-opacity duration-200",
                        isSelected
                          ? "opacity-100"
                          : "opacity-75 group-hover:opacity-100",
                      )}
                    >
                      {tab.icon}
                    </span>
                  ) : null}
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        <CopyButton
          className="shrink-0 bg-transparent text-muted-foreground shadow-none hover:bg-accent hover:text-foreground"
          content={copyCode}
          size="sm"
          variant="ghost"
        />
      </div>

      <motion.div
        animate={{ height: height || "auto" }}
        className="relative overflow-hidden"
        ref={containerRef}
        transition={transition}
      >
        <motion.div
          animate={{ x: `${activeIndex * -100}%` }}
          className="flex"
          transition={transition}
        >
          {tabs.map((tab, index) => {
            const isActive = index === activeIndex;

            return (
              <motion.div
                animate={{ filter: isActive ? "blur(0px)" : "blur(4px)" }}
                className="w-full shrink-0"
                initial={false}
                inert={!isActive}
                key={tab.id}
                ref={(node) => {
                  paneRefs.current[index] = node;
                }}
                role="tabpanel"
                transition={transition}
              >
                {renderPanel(tab.id)}
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
}

/**
 * Tracks the height of the active pane so the container can spring to it —
 * the panes sit side by side in the track, so the container has no natural
 * height of its own.
 *
 * Exported because every sliding panel on the docs pages needs it: without a
 * measured height the container collapses to the tallest pane and the switch
 * jumps, which is the lag it exists to remove.
 */
export function usePaneHeight(activeIndex: number) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const paneRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [height, setHeight] = useState(0);

  const measure = useCallback(
    () => paneRefs.current[activeIndex]?.getBoundingClientRect().height ?? 0,
    [activeIndex],
  );

  useLayoutEffect(() => {
    setHeight(measure());
  }, [measure]);

  useEffect(() => {
    const pane = paneRefs.current[activeIndex];
    if (!pane) return;

    // The code line reflows with the viewport, so the height is not static.
    // Measured inside the frame callback, not before it: taking the reading
    // first and applying it a frame later commits a height the pane has
    // already moved on from, which lands as a correction the spring has to
    // chase mid-flight. The rAF stays — it is what keeps the observer from
    // re-entering its own notification loop.
    const observer = new ResizeObserver(() => {
      requestAnimationFrame(() => setHeight(measure()));
    });
    observer.observe(pane);

    return () => observer.disconnect();
  }, [activeIndex, measure]);

  return { containerRef, paneRefs, height };
}

/**
 * A plain code surface: no header, the copy button floats over the top-right
 * corner of the code itself.
 */
export function CodeBlockPanel({
  copyCode,
  children,
  className,
}: {
  copyCode: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(panelClassName, "group/code", className)}
      data-code-block
    >
      <CopyButton
        className="absolute right-3 top-3 z-10 border-[0.5px] border-border/60 bg-code-surface/80 text-muted-foreground opacity-0 shadow-none backdrop-blur transition-opacity hover:bg-accent hover:text-foreground focus-visible:opacity-100 group-hover/code:opacity-100"
        content={copyCode}
        size="sm"
        variant="ghost"
      />
      {children}
    </div>
  );
}
