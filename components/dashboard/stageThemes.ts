export type StageKey =
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "diamond"
  | "master";

export type StageTheme = {
  pageBackground: string;
  cardBackground: string;
  cardBorder: string;
  cardShadow: string;
  stageCardBackground: string;
  softBadge: string;
  primaryText: string;
  mutedText: string;
  primaryButton: string;
  primaryButtonHover: string;
  secondaryButton: string;
  secondaryButtonHover: string;
  progressBar: string;
  progressTrack: string;
  iconBadge: string;
  activeNav: string;
  activeNavText: string;
  sectionAccent: string;
  currentBadge: string;
  nextBadge: string;
  streakBg: string;
  navBorder: string;
  navBackground: string;
  migoAccent: string;
  lessonCompletedCard: string;
  lessonCompletedBorder: string;
  lessonCompletedIcon: string;
  lessonCompletedButton: string;
  lessonCurrentCard: string;
  lessonCurrentBorder: string;
  lessonLockedCard: string;
  lessonLockedBorder: string;
  lessonLockedText: string;
  lessonLockedMutedText: string;
  lessonLockedBadge: string;
  lessonLockedIcon: string;
  lessonLockedButton: string;
};

export const stageIcons: Record<StageKey, string> = {
  bronze: "🥉",
  silver: "🥈",
  gold: "🥇",
  platinum: "💠",
  diamond: "💎",
  master: "🏆",
};

export const stageNames: Record<StageKey, string> = {
  bronze: "Bronz",
  silver: "Gümüş",
  gold: "Altın",
  platinum: "Platin",
  diamond: "Elmas",
  master: "Usta",
};

export const stageThemes: Record<StageKey, StageTheme> = {
  bronze: {
    pageBackground:
      "bg-gradient-to-br from-orange-50 via-stone-50 to-amber-50",
    cardBackground: "bg-white/95",
    cardBorder: "border-orange-200/60",
    cardShadow: "shadow-md shadow-orange-200/30",
    stageCardBackground:
      "bg-gradient-to-br from-orange-50 via-amber-50/80 to-white",
    softBadge: "bg-orange-100 text-orange-800",
    primaryText: "text-stone-800",
    mutedText: "text-stone-600",
    primaryButton:
      "bg-orange-600 text-white shadow-md shadow-orange-500/20",
    primaryButtonHover: "hover:bg-orange-700",
    secondaryButton: "bg-stone-800 text-white shadow-md shadow-stone-800/20",
    secondaryButtonHover: "hover:bg-stone-900",
    progressBar: "bg-gradient-to-r from-orange-500 to-amber-500",
    progressTrack: "bg-orange-100",
    iconBadge:
      "bg-gradient-to-br from-orange-100 to-amber-100 ring-orange-200/60",
    activeNav: "bg-orange-100",
    activeNavText: "text-orange-800",
    sectionAccent: "text-orange-700",
    currentBadge: "bg-orange-600 text-white",
    nextBadge: "bg-slate-200 text-slate-600",
    streakBg: "bg-orange-100 text-orange-800",
    navBorder: "border-orange-200/50",
    navBackground: "bg-white/95",
    migoAccent: "text-kodmigo-orange",
    lessonCompletedCard: "bg-white/95",
    lessonCompletedBorder: "border-stone-200",
    lessonCompletedIcon: "bg-emerald-50 text-emerald-600",
    lessonCompletedButton:
      "border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100",
    lessonCurrentCard:
      "bg-gradient-to-br from-orange-50 via-amber-50/80 to-white",
    lessonCurrentBorder: "border-orange-400",
    lessonLockedCard: "bg-white/90",
    lessonLockedBorder: "border-orange-200",
    lessonLockedText: "text-stone-700",
    lessonLockedMutedText: "text-stone-500",
    lessonLockedBadge: "bg-orange-100 text-orange-700",
    lessonLockedIcon: "bg-orange-100 text-orange-600",
    lessonLockedButton:
      "border border-orange-200 bg-orange-50 text-orange-700",
  },
  silver: {
    pageBackground:
      "bg-gradient-to-br from-slate-200 via-gray-100 to-slate-100",
    cardBackground: "bg-white/95",
    cardBorder: "border-slate-300/70",
    cardShadow: "shadow-md shadow-slate-300/25",
    stageCardBackground:
      "bg-gradient-to-br from-slate-100 via-gray-50 to-white",
    softBadge: "bg-slate-200 text-slate-700",
    primaryText: "text-slate-800",
    mutedText: "text-slate-500",
    primaryButton:
      "bg-slate-500 text-white shadow-md shadow-slate-400/25",
    primaryButtonHover: "hover:bg-slate-600",
    secondaryButton: "bg-slate-700 text-white shadow-md shadow-slate-700/20",
    secondaryButtonHover: "hover:bg-slate-800",
    progressBar: "bg-gradient-to-r from-slate-400 to-slate-600",
    progressTrack: "bg-slate-200",
    iconBadge:
      "bg-gradient-to-br from-slate-100 to-gray-200 ring-slate-300/50",
    activeNav: "bg-slate-200",
    activeNavText: "text-slate-700",
    sectionAccent: "text-slate-600",
    currentBadge: "bg-slate-500 text-white",
    nextBadge: "bg-gray-100 text-gray-600",
    streakBg: "bg-slate-200 text-slate-700",
    navBorder: "border-slate-300/60",
    navBackground: "bg-white/95",
    migoAccent: "text-kodmigo-orange",
    lessonCompletedCard: "bg-white/95",
    lessonCompletedBorder: "border-slate-200",
    lessonCompletedIcon: "bg-emerald-50 text-emerald-600",
    lessonCompletedButton:
      "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100",
    lessonCurrentCard: "bg-gradient-to-br from-slate-100 via-gray-50 to-white",
    lessonCurrentBorder: "border-slate-400",
    lessonLockedCard: "bg-white/95",
    lessonLockedBorder: "border-slate-300",
    lessonLockedText: "text-slate-700",
    lessonLockedMutedText: "text-slate-500",
    lessonLockedBadge: "bg-slate-100 text-slate-600",
    lessonLockedIcon: "bg-slate-100 text-slate-500",
    lessonLockedButton:
      "border border-slate-200 bg-slate-50 text-slate-600",
  },
  gold: {
    pageBackground:
      "bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100",
    cardBackground: "bg-gradient-to-br from-white to-yellow-50/80",
    cardBorder: "border-yellow-200/80",
    cardShadow: "shadow-md shadow-yellow-200/30",
    stageCardBackground:
      "bg-gradient-to-br from-yellow-50 via-yellow-100/40 to-white",
    softBadge: "bg-yellow-100 text-amber-800",
    primaryText: "text-amber-800",
    mutedText: "text-amber-700/70",
    primaryButton:
      "bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-md shadow-yellow-300/30",
    primaryButtonHover: "hover:from-yellow-500 hover:to-amber-600",
    secondaryButton:
      "bg-amber-600 text-white shadow-md shadow-amber-400/25",
    secondaryButtonHover: "hover:bg-amber-700",
    progressBar: "bg-gradient-to-r from-yellow-400 to-amber-500",
    progressTrack: "bg-yellow-100",
    iconBadge:
      "bg-gradient-to-br from-yellow-100 to-amber-200 ring-yellow-300/40",
    activeNav: "bg-yellow-100",
    activeNavText: "text-amber-800",
    sectionAccent: "text-amber-600",
    currentBadge: "bg-gradient-to-r from-yellow-400 to-amber-500 text-white",
    nextBadge: "bg-indigo-100 text-indigo-700",
    streakBg: "bg-yellow-100 text-amber-800",
    navBorder: "border-yellow-200/60",
    navBackground: "bg-white/95",
    migoAccent: "text-kodmigo-orange",
    lessonCompletedCard: "bg-white/95",
    lessonCompletedBorder: "border-yellow-200",
    lessonCompletedIcon: "bg-emerald-50 text-emerald-600",
    lessonCompletedButton:
      "border border-yellow-200 bg-yellow-50 text-amber-800 hover:bg-yellow-100",
    lessonCurrentCard:
      "bg-gradient-to-br from-yellow-50 via-yellow-100/40 to-white",
    lessonCurrentBorder: "border-amber-400",
    lessonLockedCard: "bg-yellow-50/95",
    lessonLockedBorder: "border-yellow-200",
    lessonLockedText: "text-amber-800",
    lessonLockedMutedText: "text-amber-600",
    lessonLockedBadge: "bg-yellow-100 text-amber-700",
    lessonLockedIcon: "bg-yellow-100 text-amber-600",
    lessonLockedButton:
      "border border-yellow-200 bg-yellow-50 text-amber-700",
  },
  platinum: {
    pageBackground:
      "bg-gradient-to-br from-slate-200 via-indigo-50/40 to-gray-200",
    cardBackground: "bg-white/95",
    cardBorder: "border-indigo-200/40",
    cardShadow: "shadow-md shadow-indigo-200/15",
    stageCardBackground:
      "bg-gradient-to-br from-slate-100 via-indigo-50/30 to-gray-50",
    softBadge: "bg-indigo-50 text-indigo-700",
    primaryText: "text-slate-800",
    mutedText: "text-slate-500",
    primaryButton:
      "bg-indigo-500 text-white shadow-md shadow-indigo-400/20",
    primaryButtonHover: "hover:bg-indigo-600",
    secondaryButton: "bg-slate-700 text-white shadow-md shadow-slate-700/20",
    secondaryButtonHover: "hover:bg-slate-800",
    progressBar: "bg-gradient-to-r from-slate-400 to-indigo-400",
    progressTrack: "bg-slate-200",
    iconBadge:
      "bg-gradient-to-br from-slate-100 to-indigo-50 ring-indigo-200/40",
    activeNav: "bg-indigo-100",
    activeNavText: "text-indigo-800",
    sectionAccent: "text-indigo-600",
    currentBadge: "bg-indigo-500 text-white",
    nextBadge: "bg-cyan-100 text-cyan-700",
    streakBg: "bg-indigo-50 text-indigo-700",
    navBorder: "border-indigo-200/40",
    navBackground: "bg-white/95",
    migoAccent: "text-kodmigo-orange",
    lessonCompletedCard: "bg-white/95",
    lessonCompletedBorder: "border-indigo-100",
    lessonCompletedIcon: "bg-emerald-50 text-emerald-600",
    lessonCompletedButton:
      "border border-indigo-100 bg-indigo-50/50 text-indigo-700 hover:bg-indigo-50",
    lessonCurrentCard:
      "bg-gradient-to-br from-slate-100 via-indigo-50/30 to-gray-50",
    lessonCurrentBorder: "border-indigo-400",
    lessonLockedCard: "bg-slate-50/95",
    lessonLockedBorder: "border-indigo-200",
    lessonLockedText: "text-slate-700",
    lessonLockedMutedText: "text-slate-500",
    lessonLockedBadge: "bg-indigo-50 text-indigo-600",
    lessonLockedIcon: "bg-indigo-50 text-indigo-500",
    lessonLockedButton:
      "border border-indigo-100 bg-slate-100 text-indigo-600",
  },
  diamond: {
    pageBackground:
      "bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-100",
    cardBackground: "bg-white/90",
    cardBorder: "border-cyan-200",
    cardShadow: "shadow-md shadow-cyan-200/30",
    stageCardBackground: "bg-white",
    softBadge: "bg-sky-100 text-slate-700",
    primaryText: "text-slate-950",
    mutedText: "text-slate-600",
    primaryButton:
      "bg-cyan-500 text-white shadow-md shadow-cyan-400/30",
    primaryButtonHover: "hover:bg-cyan-600",
    secondaryButton: "bg-blue-700 text-white shadow-md shadow-blue-600/25",
    secondaryButtonHover: "hover:bg-blue-800",
    progressBar: "bg-gradient-to-r from-cyan-400 to-blue-500",
    progressTrack: "bg-cyan-100",
    iconBadge:
      "bg-gradient-to-br from-cyan-50 to-sky-100 ring-cyan-200/60",
    activeNav: "bg-cyan-100",
    activeNavText: "text-cyan-800",
    sectionAccent: "text-cyan-600",
    currentBadge: "bg-cyan-500 text-white",
    nextBadge: "bg-sky-100 text-slate-700",
    streakBg: "bg-cyan-100 text-slate-700",
    navBorder: "border-cyan-200/60",
    navBackground: "bg-white/95",
    migoAccent: "text-kodmigo-orange",
    lessonCompletedCard: "bg-white/95",
    lessonCompletedBorder: "border-cyan-200",
    lessonCompletedIcon: "bg-emerald-50 text-emerald-600",
    lessonCompletedButton:
      "border border-cyan-200 bg-white text-slate-700 hover:bg-sky-50",
    lessonCurrentCard: "bg-white",
    lessonCurrentBorder: "border-cyan-500",
    lessonLockedCard: "bg-white/90",
    lessonLockedBorder: "border-sky-200",
    lessonLockedText: "text-slate-800",
    lessonLockedMutedText: "text-slate-600",
    lessonLockedBadge: "bg-slate-100 text-slate-600",
    lessonLockedIcon: "bg-sky-100 text-slate-500",
    lessonLockedButton:
      "border border-sky-200 bg-slate-50 text-slate-600",
  },
  master: {
    pageBackground:
      "bg-gradient-to-br from-slate-950 via-kodmigo-navy to-slate-900",
    cardBackground: "bg-slate-800/90 backdrop-blur-sm",
    cardBorder: "border-amber-500/20",
    cardShadow: "shadow-md shadow-black/30",
    stageCardBackground:
      "bg-gradient-to-br from-slate-800 via-slate-900 to-kodmigo-navy",
    softBadge: "bg-amber-500/15 text-amber-300 border border-amber-500/20",
    primaryText: "text-slate-100",
    mutedText: "text-slate-400",
    primaryButton:
      "bg-amber-600 text-slate-950 shadow-md shadow-amber-500/25",
    primaryButtonHover: "hover:bg-amber-500",
    secondaryButton:
      "bg-slate-700 text-amber-100 border border-amber-500/25 shadow-md shadow-black/20",
    secondaryButtonHover: "hover:bg-slate-600",
    progressBar: "bg-gradient-to-r from-amber-500 to-yellow-600",
    progressTrack: "bg-slate-700",
    iconBadge:
      "bg-gradient-to-br from-slate-700 to-slate-800 ring-amber-500/30",
    activeNav: "bg-amber-500/15",
    activeNavText: "text-amber-400",
    sectionAccent: "text-amber-400",
    currentBadge: "bg-amber-600 text-slate-950",
    nextBadge: "bg-slate-700 text-slate-400",
    streakBg: "bg-amber-500/15 text-amber-300",
    navBorder: "border-amber-500/15",
    navBackground: "bg-slate-950/95",
    migoAccent: "text-amber-400",
    lessonCompletedCard: "bg-slate-800/90 backdrop-blur-sm",
    lessonCompletedBorder: "border-emerald-500/25",
    lessonCompletedIcon: "bg-emerald-500/15 text-emerald-400",
    lessonCompletedButton:
      "border border-emerald-500/20 bg-slate-700/80 text-emerald-300 hover:bg-slate-700",
    lessonCurrentCard:
      "bg-gradient-to-br from-slate-800 via-slate-900 to-kodmigo-navy",
    lessonCurrentBorder: "border-amber-500/50",
    lessonLockedCard: "bg-slate-800/95 backdrop-blur-sm",
    lessonLockedBorder: "border-amber-500/20",
    lessonLockedText: "text-slate-300",
    lessonLockedMutedText: "text-slate-400",
    lessonLockedBadge:
      "border border-amber-500/15 bg-slate-700 text-slate-300",
    lessonLockedIcon: "bg-slate-700 text-amber-400/80",
    lessonLockedButton:
      "border border-amber-500/15 bg-slate-700/90 text-slate-400",
  },
};

export function getStageTheme(stageKey: StageKey): StageTheme {
  return stageThemes[stageKey];
}
