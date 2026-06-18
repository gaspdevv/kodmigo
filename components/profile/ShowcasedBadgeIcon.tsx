"use client";

import { useEffect, useRef, useState } from "react";
import type { StageTheme } from "@/components/dashboard/stageThemes";
import type { Achievement } from "@/lib/achievements";

type ShowcasedBadgeIconProps = {
  achievement: Achievement;
  theme: StageTheme;
};

export default function ShowcasedBadgeIcon({
  achievement,
  theme,
}: ShowcasedBadgeIconProps) {
  const [showMobileTooltip, setShowMobileTooltip] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showMobileTooltip) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowMobileTooltip(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [showMobileTooltip]);

  const handleTap = () => {
    if (window.matchMedia("(hover: hover)").matches) return;
    setShowMobileTooltip((prev) => !prev);
  };

  const tooltipContent = (
    <>
      <p className={`text-xs font-semibold ${theme.primaryText}`}>
        {achievement.title}
      </p>
      <p className="mt-0.5 text-[11px] leading-snug text-slate-500">
        {achievement.description}
      </p>
    </>
  );

  return (
    <div ref={containerRef} className="group relative mt-2 w-fit">
      <button
        type="button"
        onClick={handleTap}
        aria-label={`${achievement.title}: ${achievement.description}`}
        className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border text-lg shadow-sm transition hover:scale-105 active:scale-95 ${theme.currentBadge}`}
      >
        <span aria-hidden="true">{achievement.icon}</span>
      </button>

      <div
        className={`absolute left-0 top-full z-10 mt-2 w-44 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left shadow-lg md:hidden ${
          showMobileTooltip ? "block" : "hidden"
        }`}
        role="tooltip"
      >
        {tooltipContent}
      </div>

      <div
        className="pointer-events-none absolute bottom-full left-0 z-10 mb-2 hidden w-44 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left opacity-0 shadow-lg transition-opacity group-hover:opacity-100 md:block"
        role="tooltip"
      >
        {tooltipContent}
      </div>
    </div>
  );
}
