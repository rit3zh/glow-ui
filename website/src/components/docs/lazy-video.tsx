"use client";

import { useEffect, useRef, useState } from "react";

type LazyVideoProps = React.VideoHTMLAttributes<HTMLVideoElement>;

export function LazyVideo({
  src,
  autoPlay,
  className,
  ...rest
}: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            if (autoPlay) el.play().catch(() => {});
          } else if (autoPlay) {
            el.pause();
          }
        }
      },
      { rootMargin: "200px 0px", threshold: 0.1 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [autoPlay]);

  return (
    <video
      ref={ref}
      src={shouldLoad ? (src as string) : undefined}
      preload="metadata"
      playsInline
      className={className}
      {...rest}
    />
  );
}
