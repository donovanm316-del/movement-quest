import type { ExperienceLevel, OnboardingAnswers, Rank } from '../lib/types';

export const RANKS: Rank[] = [
  { id: 'beginner', name: 'Beginner', icon: '🌱', theme: 'Starting your journey', minExp: 0 },
  { id: 'bronze', name: 'Bronze', icon: '🥉', theme: 'Building the habit', minExp: 500 },
  { id: 'silver', name: 'Silver', icon: '🥈', theme: 'Getting consistent', minExp: 1500 },
  { id: 'gold', name: 'Gold', icon: '🥇', theme: 'Growing your skills', minExp: 3500 },
  { id: 'platinum', name: 'Platinum', icon: '💎', theme: 'Strong foundation', minExp: 7000 },
  { id: 'diamond', name: 'Diamond', icon: '🔥', theme: 'Advanced consistency', minExp: 12500 },
  { id: 'master', name: 'Master', icon: '👑', theme: 'Movement veteran', minExp: 20000 },
];

export function getRankForExp(exp: number): Rank {
  let current = RANKS[0];
  for (const rank of RANKS) {
    if (exp >= rank.minExp) current = rank;
  }
  return current;
}

export function getNextRank(exp: number): Rank | null {
  const current = getRankForExp(exp);
  const idx = RANKS.findIndex((r) => r.id === current.id);
  return RANKS[idx + 1] ?? null;
}

export function getRankProgress(exp: number) {
  const current = getRankForExp(exp);
  const next = getNextRank(exp);
  const floor = current.minExp;
  const ceiling = next ? next.minExp : current.minExp + 1;
  const span = ceiling - floor;
  const progressExp = exp - floor;
  const pct = next ? Math.min(100, Math.round((progressExp / span) * 100)) : 100;
  return { current, next, floor, ceiling, progressExp, span, pct };
}

// A simple overall "level" derived from total EXP, independent of rank, for a
// familiar RPG-style "LEVEL 12" readout. 100 EXP per level.
const EXP_PER_LEVEL = 100;

export function getLevel(exp: number): number {
  return Math.floor(exp / EXP_PER_LEVEL) + 1;
}

export function getLevelProgress(exp: number) {
  const level = getLevel(exp);
  const floor = (level - 1) * EXP_PER_LEVEL;
  const ceiling = level * EXP_PER_LEVEL;
  const pct = Math.round(((exp - floor) / EXP_PER_LEVEL) * 100);
  return { level, floor, ceiling, pct };
}

const ACTIVITY_SCORE: Record<ExperienceLevel, number> = { new: 0, casual: 1, active: 2, regular: 3 };
const WORKOUT_SCORE: Record<OnboardingAnswers['pastWorkouts'], number> = {
  never: 0,
  few: 1,
  sometimes: 2,
  regularly: 3,
};

// Starting EXP by combined experience score (0-6). Caps at Gold — someone who
// already trains regularly shouldn't be labeled "Beginner", but Platinum and
// above still has to be earned through actual quest consistency in the app.
const STARTING_EXP_BY_SCORE = [0, 500, 900, 1500, 2500, 3500, 4500];

export function computeStartingExp(onboarding: OnboardingAnswers): number {
  const score = ACTIVITY_SCORE[onboarding.activityLevel] + WORKOUT_SCORE[onboarding.pastWorkouts];
  return STARTING_EXP_BY_SCORE[score];
}

// --- Division system -------------------------------------------------------
// Each rank is split into 3 numbered levels (Gold 1, Gold 2, Gold 3), and each
// level is split into 3 divisions. Clearing division 3 of a level bumps you to
// the next numbered level within the same rank; clearing level 3 promotes you
// to the next rank entirely. Each level carries a small activity-themed title
// so the climb feels like it's about movement and momentum, not just numbers.
// Master has no ceiling, so it keeps climbing levels forever at a fixed pace.

export const DIVISIONS_PER_LEVEL = 3;
export const LEVELS_PER_RANK = 3;
const DIVISIONS_PER_RANK = LEVELS_PER_RANK * DIVISIONS_PER_LEVEL;
const MASTER_DIVISION_EXP = 1000;

export const RANK_LEVEL_NAMES: Record<Rank['id'], string[]> = {
  beginner: ['First Steps', 'Finding Your Rhythm', 'Warming Up'],
  bronze: ['Picking Up Pace', 'Locked In', 'Building Momentum'],
  silver: ['Steady Stride', 'In the Flow', 'Endurance Builder'],
  gold: ['Full Throttle', 'Peak Momentum', 'Golden Form'],
  platinum: ['Elite Drive', 'Relentless Pace', 'Unbreakable'],
  diamond: ['Powerhouse', 'Unstoppable Force', 'Diamond Discipline'],
  master: ['Movement Legend', 'Living Legend', 'Apex Mover'],
};

export interface RankPosition {
  rank: Rank;
  level: number;
  division: number;
  levelName: string;
  pct: number;
}

export function getRankPosition(exp: number): RankPosition {
  const rank = getRankForExp(exp);
  const next = getNextRank(exp);
  const floor = rank.minExp;
  const progressExp = Math.max(0, exp - floor);
  const divisionSize = next ? (next.minExp - floor) / DIVISIONS_PER_RANK : MASTER_DIVISION_EXP;

  const divisionIndex = Math.floor(progressExp / divisionSize);
  const level = Math.floor(divisionIndex / DIVISIONS_PER_LEVEL) + 1;
  const division = (divisionIndex % DIVISIONS_PER_LEVEL) + 1;
  const intoDivisionExp = progressExp - divisionIndex * divisionSize;
  const pct = Math.min(100, Math.round((intoDivisionExp / divisionSize) * 100));

  const names = RANK_LEVEL_NAMES[rank.id];
  const levelName = names[Math.min(level, names.length) - 1];

  return { rank, level, division, levelName, pct };
}

export function formatRankPosition(pos: RankPosition): string {
  return `${pos.rank.name} ${pos.level} · Div ${pos.division}`;
}
