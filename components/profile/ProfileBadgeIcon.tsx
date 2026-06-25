"use client";

import { useEffect, useRef, useState } from "react";
import type { StageTheme } from "@/components/dashboard/stageThemes";
import type { Achievement } from "@/lib/achievements";

type ProfileBadgeIconProps = {
  achievement: Achievement;
  theme: StageTheme;
};

export default function ProfileBadgeIcon({
  achievement,
  theme,
}: ProfileBadgeIconProps) {
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
    <div ref={containerRef} className="group relative">
      <button
        type="button"
        onClick={handleTap}
        title={`${achievement.title}: ${achievement.description}`}
        aria-label={`${achievement.title}: ${achievement.description}`}
        className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border text-base shadow-sm transition hover:scale-105 active:scale-95 sm:h-9 sm:w-9 sm:rounded-xl sm:text-lg ${theme.currentBadge}`}
      >
        <span aria-hidden="true">{achievement.icon}</span>
      </button>

      <div
        className={`absolute left-0 top-full z-10 mt-1.5 w-44 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left shadow-lg sm:hidden ${
          showMobileTooltip ? "block" : "hidden"
        }`}
        role="tooltip"
      >
        {tooltipContent}
      </div>

      <div
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 hidden w-44 -translate-x-1/2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left opacity-0 shadow-lg transition-opacity group-hover:opacity-100 sm:block"
        role="tooltip"
      >
        {tooltipContent}
      </div>
    </div>
  );
}
